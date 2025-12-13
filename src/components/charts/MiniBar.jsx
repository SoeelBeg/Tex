import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  Cell,
} from "recharts";

// Color palette for bars
const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f97316",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

/**
 * Mini bar chart
 * Used inside Production cards
 *
 * @param {Array} data - [{ name, value }]
 */
export default function MiniBar({ data = [] }) {
  // Fallback when no data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ fontSize: 12, color: "#64748b" }}>
        No data
      </div>
    );
  }

  return (
    // Fixed height is IMPORTANT for recharts
    <div style={{ width: "100%", height: 60, minHeight: 60 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          {/* Hide X axis labels (compact view) */}
          <XAxis dataKey="name" hide />

          {/* Tooltip on hover */}
          <Tooltip />

          {/* Bars */}
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]} // rounded top corners
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]} // rotate colors
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
