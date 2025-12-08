// src/components/charts/LineChartBox.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function LineChartBox({ data = [], stroke = "#4f46e5" }) {
  // data format expected: [{ name: "September", value: 12345 }, ...]
  return (
    <div className="chart-container" style={{ width: "100%", height: "300px", minHeight: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="0"
            vertical={false}
            stroke="#e5e7eb"   // light horizontal lines
          />

          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
