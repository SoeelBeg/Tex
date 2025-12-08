// src/components/YearSelector.jsx (small change)
import React from "react";

export default function YearSelector({ year, setYear }) {
  const years = ["All", 2025, 2024, 2023, 2022];

  return (
    <div className="year-selector">
      <label htmlFor="year" className="year-label">Select Year:</label>
      <select
        id="year"
        className="year-select"
        value={year ?? "All"}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "All") setYear(null);
          else setYear(Number(val));
        }}
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
