// src/components/charts/DrillDownChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DrillDownChart({ data = [], onBarClickYear }) {
  // data: [{ name, value }, ...]
  const handleClick = (e) => {
    // e.activePayload[0].payload -> the data object
    if (!e || !e.activePayload || !e.activePayload[0]) return;
    const payload = e.activePayload[0].payload;
    if (onBarClickYear) onBarClickYear(payload);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} onClick={handleClick}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
