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
}) {
  return (
    <div className="kpi-tile">
      {/* KPI Title */}
      <div className="kpi-title">{title}</div>

      {/* Value + Diff row */}
      <div className="d-flex align-items-center justify-content-between">
        {/* Main value */}
        <div className="kpi-value">
          {value ?? "—"}
        </div>

        {/* Percentage change */}
        <div className={`kpi-diff ${positive ? "pos" : "neg"}`}>
          {positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
          <span className="ms-1">
            {Math.abs(diff)}%
          </span>
        </div>
      </div>

      {/* Subtitle (period info) */}
      {sub && (
        <div className="kpi-sub mt-2">
          {sub}
        </div>
      )}
    </div>
  );
}
