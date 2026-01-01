import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

/**
 * KPI Tile component
 * Shows a main value with percentage change indicator
 *
 * @param {string} title     - KPI title (e.g. Quantity)
 * @param {string|number} value - Main KPI value
 * @param {number} diff      - Percentage difference (+ / -)
 * @param {boolean} positive - Controls arrow & color
 * @param {string} sub       - Subtitle (period info)
 */
export default function KpiTile({
  title,
  value,
  diff = 0,
  positive = true,
  sub = "",
  className = "",   // ✅ STEP 1: accept className
}) {
  return (
    <div className={`kpi-tile ${className}`}> {/* ✅ STEP 2: forward */}
      
    {/* for border animation  */}
    <span className="border-runner">
        <i className="top"></i>
        <i className="right"></i>
        <i className="bottom"></i>
        <i className="left"></i>
      </span>

      <div className="kpi-title">{title}</div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="kpi-value">
          {value ?? "—"}
        </div>
      </div>

      {sub && (
        <div className="kpi-sub mt-2">
          {sub}
        </div>
      )}
    </div>
  );
}
