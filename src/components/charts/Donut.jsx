import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Color palette for pie slices
const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f97316",
  "#e55757ff",
  "#06b6d4",
  "#a855f7",
];

/**
 * Donut / Pie chart component
 * @param {Array} data - [{ name, value }]
 * @param {Number} inner - inner radius (for donut look)
 */
export default function Donut({ data = [], inner = 50 }) {
  // If no data, show fallback
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ fontSize: 12, color: "#64748b" }}>
        No data
      </div>
    );
  }

  return (
    // IMPORTANT: parent must have fixed height
    <div style={{ width: "100%", height: 140, minHeight: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}              // chart data
            dataKey="value"          // numeric value
            nameKey="name"           // label
            cx="50%"                 // center X
            cy="50%"                 // center Y
            // innerRadius={inner}      // donut hole
            outerRadius={inner + 18} // thickness
            paddingAngle={2}         // gap between slices
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]} // rotate colors
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
