// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getProductionData } from "../api/dashboardApi";

// UI Components
import TilesRow from "../components/Dashboard/TilesRow";
import YearChart from "../components/Dashboard/YearChart";
import MonthChart from "../components/Dashboard/MonthChart";
import ProductionGrid from "../components/Dashboard/ProductionGrid";

export default function DashboardPage() {
  
  // STATE---- define all list---

  const [yearList, setYearList] = useState([]);
  const [monthList, setMonthList] = useState([]);
  const [lists, setLists] = useState({});

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingLists, setLoadingLists] = useState(false);

  // HELPERS: API → Chart format

  /**
   * Converts API year list to chart format
   */
  const yearToChart = (arr = []) =>
    Array.isArray(arr)
      ? arr.map(r => ({
          name: String(r?.FnYear ?? r?.Year ?? r?.fnYear ?? ""),
          value: Number(r?.Production ?? 0),
          __raw: r
        }))
      : [];

  /**
   * Converts API month list to chart format
   */
  const monthToChart = (arr = []) =>
    Array.isArray(arr)
      ? arr.map(r => {
          const monthNo =
            Number(r?.MonthNo) ||
            Number(r?.Month) ||
            Number(r?.month) ||
            0;

          const monthName =
            r?.MonthName ||
            (monthNo
              ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][monthNo - 1]
              : "");

          return {
            name: monthName,
            value: Number(r?.Production ?? 0),
            monthNo,
            __raw: r
          };
        })
      : [];

  // API CALLS
  /**
   * Load Year wise production
   */
  const loadYears = async () => {
    try {
      const res = await getProductionData({
        type: "year",
        fnYear: 0,
        month: 0
      });

      const arr = Array.isArray(res) ? res : [];
      setYearList(arr);
      return arr;
    } catch (err) {
      console.error("loadYears error:", err);
      setYearList([]);
      return [];
    }
  };

  /**
   * Load Month list for selected year
   */
  const loadMonths = async (year) => {
    if (!year) return [];

    try {
      const res = await getProductionData({
        type: "month",
        fnYear: year,
        month: 0
      });

      const arr = Array.isArray(res) ? res : [];
      setMonthList(arr);
      return arr;
    } catch (err) {
      console.error("loadMonths error:", err);
      setMonthList([]);
      return [];
    }
  };

  /**
   * Load all production lists
   * book / beam / item / factory / customer etc
   */
  const loadLists = async (year, month = 0) => {
    if (!year) return;

    setLoadingLists(true);

    try {
      const types = ["book","beam","item","selvage","factory","customer"];

      const results = await Promise.all(
        types.map(type =>
          getProductionData({
            fnYear: year,
            month,
            type
          })
        )
      );

      setLists({
        book: results[0] || [],
        beam: results[1] || [],
        item: results[2] || [],
        selvage: results[3] || [],
        factory: results[4] || [],
        customer: results[5] || []
      });

    } catch (err) {
      console.error("loadLists error:", err);
      setLists({});
    } finally {
      setLoadingLists(false);
    }
  };

  // INITIAL LOAD (on page open)

  useEffect(() => {
    (async () => {
      setLoadingPage(true);

      try {
        const years = await loadYears();
        if (!years.length) return;

        // Pick latest financial year
        const yearNumbers = years
          .map(y => Number(y?.FnYear ?? y?.Year))
          .filter(Boolean);

        const latestYear = Math.max(...yearNumbers);
        setSelectedYear(latestYear);

        // Load months for that year
        const months = await loadMonths(latestYear);
        const monthNos = months
          .map(m => Number(m?.MonthNo ?? m?.Month))
          .filter(Boolean);

        const latestMonth = monthNos.length ? Math.max(...monthNos) : 0;
        setSelectedMonth(latestMonth);

        // Load detail lists
        await loadLists(latestYear, latestMonth);

      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setLoadingPage(false);
      }
    })();
  }, []);

  // -----EVENT HANDLERS

  const handleYearClick = async (year) => {
    if (!year) return;

    setSelectedYear(year);
    setSelectedMonth(null);

    const months = await loadMonths(year);
    const monthNos = months.map(m => Number(m?.MonthNo)).filter(Boolean);
    const latestMonth = monthNos.length ? Math.max(...monthNos) : 0;

    setSelectedMonth(latestMonth);
    await loadLists(year, latestMonth);
  };

  const handleMonthClick = async (monthNo) => {
    const month = Number(monthNo);
    if (!month || !selectedYear) return;

    setSelectedMonth(month);
    await loadLists(selectedYear, month);
  };

  // DERIVED DATA

  const yearChartData = useMemo(
    () => yearToChart(yearList),
    [yearList]
  );

  const monthChartData = useMemo(
    () => monthToChart(monthList),
    [monthList]
  );

  const summary = {
    quantity: (lists.book || []).reduce(
      (sum, r) => sum + Number(r?.Production ?? 0),
      0
    ),
    rework: "—",
    cost: "—",
    labor: "—"
  };

  // Period label for KPI tiles
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const periodLabel = selectedMonth
    ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`
    : `Year ${selectedYear}`;

  // -----------UI-------------


  return (
    <div className="dashboard-page container-fluid p-3">

      <TilesRow summary={summary} periodLabel={periodLabel} />

      <div className="row g-3">
        <div className="col-lg-6">
          <YearChart
            data={yearChartData}
            onSelectYear={handleYearClick}
          />
        </div>

        <div className="col-lg-6">
          <MonthChart
            data={monthChartData}
            onSelectMonth={handleMonthClick}
          />
        </div>
      </div>

      <div style={{ marginTop: 18, position: "relative", minHeight: 420 }}>
        <ProductionGrid lists={lists} />

        {loadingLists && (
          <div className="overlay-loading">
            Loading lists...
          </div>
        )}
      </div>

      {loadingPage && <div>Loading dashboard...</div>}
    </div>
  );
}
