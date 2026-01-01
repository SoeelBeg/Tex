import React, { useMemo, useState } from "react";
// import Donut from "../charts/Donut";
import MiniBar from "../charts/MiniBar";

/**
 * Reusable production summary card
 * - Searchable list
 * - Donut + mini bar charts
 * - Used for Book / Item / Beam / Factory etc.
 */
export default function ProductionCard({ title, data = [], labelKey }) {

  /* Search text state */
  const [search, setSearch] = useState("");

  /* Filter data based on search input */
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((row) =>
      String(row[labelKey] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search, labelKey]);

  // /* Donut chart data (top 4 items) */
  // const donutData = useMemo(() => {
  //   return filteredData.slice(0, 4).map((row) => ({
  //     name: String(row[labelKey] ?? "").slice(0, 6),
  //     value: Number(row.Production ?? 0) || 1, // avoid zero for donut
  //   }));
  // }, [filteredData, labelKey]);

  /* Mini bar chart data (top 6 items) */
   const miniData = useMemo(() => {
    return data.slice(0, 6).map((row) => ({
      name: String(row[labelKey] ?? "").slice(0, 6),
      value: Number(row.Production ?? 0),
    }));
  }, [data, labelKey]);

  return (
    <div className="prod-card">

      {/* Header: title + total count */}
      {/* <div className="prod-card-header">
        <strong>{title}</strong>
        <span style={{ fontSize: 14, color: "#64748b" }}>
          {filteredData.length}
        </span>
      </div> */}

      {/* Search box */}
      {/* <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          marginTop: 6,
          padding: "6px 8px",
          fontSize: 13,
          borderRadius: 6,
          border: "1px solid #e5e7eb",
        }}
      /> */}

      {/* Charts section */}
      <div style={{ display: "flex", gap: 8, height: 140, marginTop: 8 }}>
        {/* <div style={{ width: 140 }}>
          <Donut data={donutData} inner={50} />
        </div> */}
        <div style={{ flex: 1 }}>
          <MiniBar data={miniData} />
        </div>
      </div>

      {/* Scrollable list */}
      {/* <div style={{ maxHeight: 160, overflowY: "auto", marginTop: 8 }}>
        {filteredData.map((row, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: "#4e4949",
            }}
          >
            <span>{row[labelKey]}</span>
            <strong>{row.Production}</strong>
          </div>
        ))}
      </div> */}

    </div>
  );
}
