// src/components/charts/BarChartBox.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * Props:
 * - data: [{ name, value }]
 * - title: string
 * - color: string
 * - onBarClick: function(payload) // payload is { name, value, ... }
 */
export default function BarChartBox({ data = [], title = "Bar", color = "#10b981", onBarClick }) {
  const handleBarClick = (payload, index) => {
    if (!onBarClick) return;
    // payload.payload sometimes present depending on Recharts; normalize:
    const p = payload && payload.payload ? payload.payload : payload;
    onBarClick(p, index);
  };

  return (
    <div className="chart-box">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-container" style={{ minHeight: 320, height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#e5e7eb"   // light horizontal lines
            />

            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} onClick={handleBarClick} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
