// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import "./Dashboard.css";

import { getProductionData } from "../api/dashboardApi";
import BarChartBox from "../components/charts/BarChartBox";
import LineChartBox from "../components/charts/LineChartBox";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

/**
 * Full Dashboard.jsx
 *
 * Behavior summary:
 * - Loads yearList (type="year") and months for selected year (type="month" where available).
 * - Loads 6 lists for the selected year + month (month may be null).
 * - Click a year bar -> updates selectedYear -> loads months -> loads lists.
 * - Click a month point -> updates selectedMonth -> loads lists.
 * - Click a small type chart -> sets selectedType (UI shows that type's medium chart).
 * - Bottom grid always renders the six lists as rows (book, beam, item, selvage, factory, customer).
 *
 * Important: month labels are shown as names (Apr, May, ...) so clicks are easy to parse.
 */

export default function Dashboard() {
  // --- state for lists
  const [yearList, setYearList] = useState([]); // raw rows returned by API for "year"
  const [monthList, setMonthList] = useState([]); // raw rows returned by API for "month"
  const [bookList, setBookList] = useState([]);
  const [beamList, setBeamList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selvageList, setSelvageList] = useState([]);
  const [factoryList, setFactoryList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  // --- controls
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // number 1..12 or null => full year
  const [selectedType, setSelectedType] = useState(null); // "book" | "beam" | "item" | "selvage" | "factory" | "customer"

  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  // month names for labels
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // --------------------------
  // Helpers to parse API shapes
  // --------------------------
  function parseYearValue(row) {
    if (row == null) return null;
    if (typeof row === "number") return row;
    if (typeof row === "string" && /^\d{4}$/.test(row)) return Number(row);
    if (typeof row === "object") {
      const keys = ["fnYear", "FnYear", "year", "Year", "FYEAR"];
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null) {
          const n = Number(row[k]);
          if (!Number.isNaN(n)) return n;
        }
      }
      for (const v of Object.values(row)) {
        const n = Number(v);
        if (!Number.isNaN(n) && n > 1900 && n < 2100) return n;
      }
    }
    return null;
  }

  function parseMonthValue(rowOrLabel) {
    // Accept number 1..12, string numbers, short names, or object with Month/MonthName
    if (rowOrLabel == null) return null;
    if (typeof rowOrLabel === "number" && rowOrLabel >= 1 && rowOrLabel <= 12) return rowOrLabel;
    if (typeof rowOrLabel === "string") {
      // numeric string
      if (/^\d{1,2}$/.test(rowOrLabel)) {
        const n = Number(rowOrLabel);
        if (n >= 1 && n <= 12) return n;
      }
      const key = rowOrLabel.slice(0,3).toLowerCase();
      const map = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 };
      if (map[key]) return map[key];
    }
    if (typeof rowOrLabel === "object") {
      const keys = ["Month", "month", "MonthNo", "MonthNumber", "MonthName", "monthName"];
      for (const k of keys) {
        if (rowOrLabel[k] !== undefined && rowOrLabel[k] !== null) {
          const v = rowOrLabel[k];
          if (typeof v === "number" && v >=1 && v<=12) return v;
          if (typeof v === "string") {
            if (/^\d{1,2}$/.test(v)) {
              const n = Number(v); if (n>=1 && n<=12) return n;
            }
            const key = v.slice(0,3).toLowerCase();
            const map = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 };
            if (map[key]) return map[key];
          }
        }
      }
    }
    return null;
  }

  // Normalize a product row to { name, value } for small charts & top lists
  function normalizeToNameValue(row) {
    if (!row) return { name: "Unknown", value: 0 };
    const nameKeys = ["Book_Name","BookName","Item","Beam","Factory","Customer","Name","book","item"];
    let name = null;
    for (const k of nameKeys) {
      if (row[k] !== undefined && row[k] !== null) { name = String(row[k]); break; }
    }
    if (!name) {
      for (const v of Object.values(row)) if (typeof v === "string" && v.trim()) { name = v; break; }
    }
    if (!name) name = "Unknown";

    // value: prefer Production/value fields; fallback to 0
    const valKeys = ["Production","production","Value","value"];
    let value = 0;
    for (const k of valKeys) {
      if (row[k] !== undefined && row[k] !== null) {
        const n = Number(row[k]);
        if (!Number.isNaN(n)) { value = n; break; }
      }
    }
    if (!value) {
      for (const v of Object.values(row)) {
        const n = Number(v);
        if (!Number.isNaN(n)) { value = n; break; }
      }
    }
    return { name: String(name), value: Number(value) || 0, raw: row };
  }

  // convert any rows to chart { name, value } with name-field candidates
  function listToChartRaw(rows = [], nameFields = []) {
    if (!Array.isArray(rows)) return [];
    return rows.map((r, i) => {
      let name = null;
      for (const k of nameFields) {
        if (r[k] !== undefined && r[k] !== null) { name = String(r[k]); break; }
      }
      if (!name) {
        for (const v of Object.values(r)) if (typeof v === "string" && v.trim()) { name = v; break; }
      }
      if (!name) name = `R${i+1}`;
      const value = Number(r?.Production ?? r?.production ?? r?.Value ?? 0) || 0;
      return { name: String(name).slice(0, 20), value, raw: r };
    });
  }

  // --------------------------
  // Chart data creators
  // --------------------------
  function makeYearlyChart(rows = []) {
    if (!Array.isArray(rows)) return [];
    // ensure each bar has name=year and value (sum or Production field if present)
    return rows.map((r, i) => {
      const y = parseYearValue(r) ?? r?.fnYear ?? r?.FnYear ?? r?.Year ?? r?.name ?? `Y${i+1}`;
      const value = Number(r?.Production ?? r?.production ?? r?.Value ?? 0) || 0;
      return { name: String(y), value, raw: r };
    });
  }

  function makeMonthlyChart(rows = []) {
    if (!Array.isArray(rows)) return [];
    return rows.map((r, i) => {
      // determine month number, then label as short name (Apr) — this fixes click parsing
      const mnum = parseMonthValue(r) ?? parseMonthValue(r?.Month ?? r?.month ?? r?.MonthName ?? r?.name);
      const label = mnum ? monthNames[mnum - 1] : (r?.MonthName ?? r?.monthYear ?? r?.name ?? `M${i+1}`);
      const value = Number(r?.Production ?? r?.production ?? r?.Value ?? 0) || 0;
      return { name: String(label), value, monthNumber: mnum ?? null, raw: r };
    });
  }

  // --------------------------
  // Load the 6 lists (book..customer) for fnYear + month
  // --------------------------
  async function loadListsFor(fnYear, month) {
    setLoading(true);
    setInfoMsg(`Loading lists for ${fnYear} / ${month ?? "null"} ...`);
  
    try {
      const types = ["book", "beam", "item", "selvage", "factory", "customer"];
  
      const promises = types.map((t) => {
        const monthToSend = t === "customer" ? null : month;   // ⭐ FIX HERE
  
        return getProductionData({
          fnYear,
          month: monthToSend,
          type: t,
        }).then((res) => ({ t, res }));
      });
  
      const results = await Promise.all(promises);
  
      results.forEach(({ t, res }) => {
        const data = res || [];
        switch (t) {
          case "book": setBookList(data); break;
          case "beam": setBeamList(data); break;
          case "item": setItemList(data); break;
          case "selvage": setSelvageList(data); break;
          case "factory": setFactoryList(data); break;
          case "customer": setCustomerList(data); break;
          default: break;
        }
      });
  
      setInfoMsg("Lists loaded.");
    } catch (err) {
      console.error("loadListsFor error:", err);
      setInfoMsg("Failed to load lists (see console).");
    } finally {
      setLoading(false);
    }
  }
  

  // --------------------------
  // Initial load: year list -> months -> lists
  // --------------------------
  useEffect(() => {
    async function initialLoad() {
      setLoading(true);
      setInfoMsg("Initial loading (years & months) ...");
      try {
        // try API type "year"
        const yearsRaw = await getProductionData({ fnYear: null, month: null, type: "year" });

        let chosenYear = null;
        if (Array.isArray(yearsRaw) && yearsRaw.length) {
          setYearList(yearsRaw);
          const parsed = yearsRaw.map(parseYearValue).filter((v) => v != null);
          chosenYear = parsed.length ? Math.max(...parsed) : parseYearValue(yearsRaw[0]) ?? new Date().getFullYear();
        } else {
          // fallback: probe recent years by calling type "book" for each year
          const thisYear = new Date().getFullYear();
          const probed = [];
          for (let y = thisYear; y >= thisYear - 3; y--) {
            const r = await getProductionData({ fnYear: y, month: null, type: "book" });
            const total = (r || []).reduce((s, it) => s + (Number(it?.Production ?? it?.production ?? 0) || 0), 0);
            probed.push({ fnYear: y, Production: total });
          }
          setYearList(probed);
          chosenYear = probed.length ? probed[0].fnYear : new Date().getFullYear();
        }

        setSelectedYear(chosenYear);

        // load months for chosenYear (type="month" if available)
        const monthsRaw = await getProductionData({ fnYear: chosenYear, month: null, type: "month" });
        if (Array.isArray(monthsRaw) && monthsRaw.length) {
          setMonthList(monthsRaw);
          // choose max numeric month if present
          const parsedM = monthsRaw.map((m) => parseMonthValue(m) ?? parseMonthValue(m?.Month ?? m?.month ?? m?.MonthName)).filter((v)=>v!=null);
          const pickMonth = parsedM.length ? Math.max(...parsedM) : null;
          setSelectedMonth(pickMonth);
          await loadListsFor(chosenYear, pickMonth);
        } else {
          setMonthList([]);
          setSelectedMonth(null);
          await loadListsFor(chosenYear, null);
        }
      } catch (err) {
        console.error("initialLoad error:", err);
        setInfoMsg("Initial load failed (see console).");
      } finally {
        setLoading(false);
      }
    }

    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------
  // Chart data prepare
  // --------------------------
  const yearlyChartData = makeYearlyChart(yearList);
  const monthlyChartData = makeMonthlyChart(monthList);

  // type -> small chart data
  const typeChartMap = {
    book: listToChartRaw(bookList, ["Book_Name","BookName"]),
    beam: listToChartRaw(beamList, ["Beam","BeamName","Beam_No"]),
    item: listToChartRaw(itemList, ["Item","ItemName"]),
    selvage: listToChartRaw(selvageList, ["Selvage","SelvageName","Selvage_Name"]),
    factory: listToChartRaw(factoryList, ["Factory","FactoryName"]),
    customer: listToChartRaw(customerList, ["Customer","CustomerName"]),
  };

  const typeColors = {
    book: "#06b6d4",
    beam: "#8b5cf6",
    item: "#10b981",
    selvage: "#f97316",
    factory: "#ef4444",
    customer: "#6366f1",
  };

  // selected type medium chart (top 20)
  const selectedTypeChart = selectedType ? (typeChartMap[selectedType] || []).slice(0, 20) : [];

  // topN helper for product grid
  function topN(list = [], n = 6) {
    return (list || []).map(normalizeToNameValue).sort((a,b) => b.value - a.value).slice(0, n);
  }

  const bookTop = topN(bookList);
  const beamTop = topN(beamList);
  const itemTop = topN(itemList);
  const selvageTop = topN(selvageList);
  const factoryTop = topN(factoryList);
  const customerTop = topN(customerList);

  // --------------------------
  // Click handlers
  // --------------------------
  const onYearBarClick = async (payload) => {
    // Recharts payload sometimes wraps in payload.payload
    const p = payload && payload.payload ? payload.payload : payload;
    const yearVal = Number(p?.name ?? p?.fnYear ?? p?.Year ?? p);
    if (!Number.isFinite(yearVal)) return;
    setSelectedYear(yearVal);
    setSelectedType(null);
    setLoading(true);
    try {
      const monthsRaw = await getProductionData({ fnYear: yearVal, month: null, type: "month" });
      setMonthList(monthsRaw || []);
      const parsedM = (monthsRaw || []).map((m) => parseMonthValue(m) ?? parseMonthValue(m?.Month ?? m?.month ?? m?.MonthName)).filter((v)=>v!=null);
      const pick = parsedM.length ? Math.max(...parsedM) : null;
      setSelectedMonth(pick);
      await loadListsFor(yearVal, pick);
    } catch (err) {
      console.error("onYearBarClick error:", err);
      setInfoMsg("Failed while loading after year click.");
    } finally {
      setLoading(false);
    }
  };

  const onMonthPointClick = async (payload) => {
    // payload here comes from LineChartBox as the clicked point (payload.payload or plain)
    const p = payload && payload.payload ? payload.payload : payload;
    // our monthlyChart rows include monthNumber (if parsed) OR label name like 'Apr'
    const monthNumber = p?.monthNumber ?? parseMonthValue(p?.name ?? p?.Month ?? p?.month ?? p);
    if (!Number.isFinite(monthNumber)) {
      // can't parse month -> ignore
      return;
    }
    setSelectedMonth(monthNumber);
    setSelectedType(null);
    await loadListsFor(selectedYear, monthNumber);
  };

  const onTypeClick = (type) => {
    if (!type) return;
    setSelectedType(type);
    setInfoMsg(`Selected type: ${type}`);
  };

  // --------------------------
  // Render
  // --------------------------
  return (
    <DashboardLayout>
      {/* Row 1: Tiles */}
      <div className="kpi-row">
        <div className="kpi-card hover-glow" style={{ borderLeft: "5px solid #06b6d4" }}>
          <div className="kpi-label">Selected Year</div>
          <div className="kpi-value">{selectedYear ?? "—"}</div>
          <div className="kpi-sub">Months available: {Array.isArray(monthList) ? monthList.length : 0}</div>
        </div>

        <div className="kpi-card hover-glow" style={{ borderLeft: "5px solid #8b5cf6" }}>
          <div className="kpi-label">Selected Month</div>
          <div className="kpi-value">{selectedMonth ? monthNames[selectedMonth-1] : "— (full year)"}</div>
          <div className="kpi-sub">Click a monthly point to select</div>
        </div>

        <div className="kpi-card hover-glow" style={{ borderLeft: "5px solid #10b981" }}>
          <div className="kpi-label">Selected Type</div>
          <div className="kpi-value">{selectedType ?? "—"}</div>
          <div className="kpi-sub">Click a small type chart to view details</div>
        </div>
      </div>

      {/* Row 2: Year + Month large charts */}
      <div className="big-charts-row">
        <div className="big-chart">
          {yearlyChartData.length ? (
            <BarChartBox
              data={yearlyChartData}
              title="Yearly (click a bar)"
              color="#10b981"
              onBarClick={(payload) => onYearBarClick(payload)}
            />
          ) : (
            <div className="chart-box placeholder">
              <h3 className="chart-title">Yearly Production</h3>
              <div style={{ padding: 28, color: "#777" }}>No yearly data available</div>
            </div>
          )}
        </div>

        <div className="big-chart">
          <div className="chart-box">
            <h3 className="chart-title">Monthly (click a point)</h3>
            <div className="chart-container" style={{ height: 320 }}>
              {monthlyChartData.length ? (
                <LineChartBox
                  data={monthlyChartData}
                  stroke="#6366f1"
                  onPointClick={(payload) => onMonthPointClick(payload)}
                />
              ) : (
                <div style={{ padding: 28, color: "#777" }}>No monthly data for this year. Click a year to load months.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medium chart: selected type details */}
      {/* <div style={{ marginTop: 12 }}>
        <div className="chart-box">
          <h3 className="chart-title">{selectedType ? `Top ${selectedType}` : "Selected type details"}</h3>
          <div style={{ padding: 12 }}>
            {selectedType ? (
              selectedTypeChart.length ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={selectedTypeChart} margin={{ top: 6, right: 12, left: 6, bottom: 6 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill={typeColors[selectedType] ?? "#8884d8"} radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ padding: 18, color: "#777" }}>No data for selected type.</div>
              )
            ) : (
              <div style={{ padding: 18, color: "#777" }}>No type selected — click a type chart below.</div>
            )}
          </div>
        </div>
      </div> */}

      {/* Row 3: small type charts + bottom product grid */}
      {/* <div className="chart-box" style={{ marginTop: 12 }}>
        <h3 className="chart-title">Type overview (click a type)</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
          {["book","beam","item","selvage","factory","customer"].map((t) => (
            <div key={t} style={{ width: 220 }}>
              <BarChartBox
                data={(typeChartMap[t] || []).slice(0, 6)}
                title={t}
                color={typeColors[t]}
                onBarClick={() => onTypeClick(t)}
              />
            </div>
          ))}
        </div>
      </div> */}

      {/* Bottom grid: shows the top rows for each of the six lists (always visible) */}
      <div className="products-grid" style={{ marginTop: 12 }}>
        {[
          { title: "Bookwise", rows: bookTop, color: typeColors.book },
          { title: "Beamwise", rows: beamTop, color: typeColors.beam },
          { title: "Itemwise", rows: itemTop, color: typeColors.item },
          { title: "Selvagewise", rows: selvageTop, color: typeColors.selvage },
          { title: "Factorywise", rows: factoryTop, color: typeColors.factory },
          { title: "Customerwise", rows: customerTop, color: typeColors.customer },
        ].map((card, idx) => (
          <div key={idx} className="product-card hover-elevate" style={{ borderTop: `4px solid ${card.color}` }}>
            <div className="product-card-header">
              <div className="product-card-title">{card.title} (Top)</div>
              <div className="product-card-sub">Showing top {card.rows.length} items</div>
            </div>

            <div className="product-card-body">
              <div className="product-list">
                {card.rows.length ? (
                  card.rows.map((r, i) => (
                    <div key={i} className="product-row">
                      <div className="prod-name" title={r.name}>{r.name}</div>
                      <div className="prod-value">{r.value.toLocaleString()}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">No data</div>
                )}
              </div>

              <div className="product-mini">
                {card.rows.length ? (
                  <ResponsiveContainer width="100%" height={70}>
                    <BarChart data={card.rows.map((x) => ({ name: x.name.slice(0,6), value: x.value }))}>
                      <XAxis dataKey="name" hide />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6,6,0,0]} fill={card.color} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ color: "#9aa4b2", textAlign: "center", fontSize: 13 }}>No chart</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, color: "#444" }}>{loading ? "Loading..." : infoMsg}</div>
    </DashboardLayout>
  );
}
