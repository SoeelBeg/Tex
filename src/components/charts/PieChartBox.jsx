// src/components/charts/PieChartBox.jsx
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

/**
 * Props:
 * - data: [{ name, value }]
 * - title: string
 * - onSliceClick(payload)
 */
const DEFAULT_COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f97316", "#ef4444", "#6366f1", "#f59e0b"];

export default function PieChartBox({ data = [], title = "Pie", onSliceClick }) {
  const handleClick = (entry, index) => {
    if (!onSliceClick) return;
    const p = entry && entry.payload ? entry.payload : entry;
    onSliceClick(p, index);
  };

  return (
    <div className="chart-box">
      <h3 className="chart-title">{title}</h3>
      <div style={{ minHeight: 240, height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={80}
              onClick={handleClick}
              label={(entry) => entry.name}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
