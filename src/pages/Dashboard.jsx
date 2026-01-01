// src/pages/Dashboard.jsx
import React, {
  useEffect, useMemo, useState, lazy,
  Suspense
} from "react";
import { getProductionData, getProductionTiles } from "../api/dashboardApi";
import { getStockData, getStockTiles } from "../api/stockApi";

// UI Components
import TilesRow from "../components/Dashboard/TilesRow";

// Lazy loaded (heavy components)
const YearChart = lazy(() => import("../components/Dashboard/YearChart"));
const MonthChart = lazy(() => import("../components/Dashboard/MonthChart"));
const ProductionGrid = lazy(() => import("../components/Dashboard/ProductionGrid"));

export default function DashboardPage() {

  //"production" → Production dashboard ,"stock" → Stock dashboard
  const [activeTab, setActiveTab] = useState("production");

  const apiMap = useMemo(() => ({
    production: {
      getData: getProductionData,
      getTiles: getProductionTiles
    },
    stock: {
      getData: getStockData,
      getTiles: getStockTiles
    }
  }), []);



  // STATE---- API se aane wala raw data------
  const [yearList, setYearList] = useState([]);
  const [monthList, setMonthList] = useState([]);
  const [lists, setLists] = useState({});

  //User ne kaunsa Year / Month select kiya
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  //Loader control
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingLists, setLoadingLists] = useState(false);

  //Converts API year list to chart format
  const yearToChart = (arr = []) =>
    Array.isArray(arr)
      ? arr.map(r => ({
        name: String(r?.FnYear ?? r?.Year ?? r?.fnYear ?? ""),
        value: Number(r?.Production ?? 0),
        __raw: r
      }))
      : [];

  //Converts API month list to chart format
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
            ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthNo - 1]
            : "");

        return {
          name: monthName,
          value: Number(r?.Production ?? 0),
          monthNo,
          __raw: r
        };
      })
      : [];

  //Load Year wise production
  const loadYears = async () => {
    try {
      const res = await apiMap[activeTab].getData({
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


  //  Load Month list for selected year
  const loadMonths = async (year) => {
    if (!year) return [];

    try {
      const res = await apiMap[activeTab].getData({
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
   * Load all production lists | APIs parallel me call hoti hai
   * book / beam / item / factory / customer etc
   */
  const loadLists = async (year, month = 0) => {
    if (!year) return;

    setLoadingLists(true);

    try {
      const types = ["book", "beam", "item", "selvage", "factory", "customer"];

      const results = await Promise.all(
        types.map(type =>
          apiMap[activeTab].getData({
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


  //---Tils-------
  const [tilesData, setTilesData] = useState(null);
  const [loadingTiles, setLoadingTiles] = useState(false);

  const loadTiles = async () => {
    setLoadingTiles(true);

    try {
      const res = await apiMap[activeTab].getTiles();
      setTilesData(res);

    } catch (err) {
      console.error("loadTiles error:", err);
      setTilesData(null);
    } finally {
      setLoadingTiles(false);
    }
  };

  // INITIAL LOAD (on page open)

  useEffect(() => {
    (async () => {
      setYearList([]);
      setMonthList([]);
      setLists({});
      setTilesData(null);

      await loadTiles();

      const years = await loadYears();
      if (!years.length) return;

      const latestYear = Math.max(
        ...years.map(y => Number(y?.FnYear ?? y?.Year))
      );

      setSelectedYear(latestYear);
      await loadMonths(latestYear);
      await loadLists(latestYear, 0);
    })();
  }, [activeTab]);


  // -----EVENT HANDLERS | Chart click → Month chart + Grid update
  const handleYearClick = async (year) => {
    if (!year) return;

    setSelectedYear(year);
    setSelectedMonth(null);

    const months = await loadMonths(year);
    const monthNos = months.map(m => Number(m?.MonthNo)).filter(Boolean);
    const latestMonth = monthNos.length ? Math.max(...monthNos) : 0;

    setSelectedMonth(latestMonth);
    await loadLists(year, 0);
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


  // // Period label for KPI tiles
  // const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const yearLabel = tilesData?.Year
    ? `Year ${tilesData.Year}`
    : "—";

  const monthLabel = tilesData?.Month
    ? `${tilesData.Month} ${tilesData.Year}`
    : "—";

  const weekLabel = tilesData?.Week
    ? `Week ${tilesData.Week}`
    : "—";

  const dayLabel = tilesData?.Date
    ? new Date(tilesData.Date).toDateString()
    : "—";


  const summary = {
    quantity: tilesData?.YearlyProduction ?? "—",
    rework: tilesData?.MonthlyProduction ?? "—",
    cost: tilesData?.WeeklyProduction ?? "—",
    labor: tilesData?.DailyProduction ?? "—"
  };



  // -----------UI-------------
  return (
    <div className="dashboard-page container-fluid p-3">

      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab("production")}
          className={activeTab === "production" ? "active" : ""}
        >
          Production
        </button>

        <button
          onClick={() => setActiveTab("stock")}
          className={activeTab === "stock" ? "active" : ""}
        >
          Stock
        </button>
      </div>


      <TilesRow
        summary={summary}
        yearLabel={yearLabel}
        monthLabel={monthLabel}
        weekLabel={weekLabel}
        dayLabel={dayLabel}
      />


      <div className="row g-3">
        <div className="col-lg-6">
          <Suspense fallback={<div>Loading Year Chart...</div>}>
            <YearChart
              data={yearChartData}
              onSelectYear={handleYearClick}
            />
          </Suspense>
        </div>

        <div className="col-lg-6">
          <Suspense fallback={<div>Loading Month Chart...</div>}>
            <MonthChart
              data={monthChartData}
              onSelectMonth={handleMonthClick}
            />
          </Suspense>
        </div>
      </div>


      <div className="production-wrapper">

        <ProductionGrid lists={lists} />

        {loadingLists && (
          <div className="overlay-loading">
            Loading lists...
          </div>
        )}
      </div>

      {loadingPage}
    </div>
  );
}
