import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS = ["#4f46e5","#06b6d4","#f97316","#ef4444","#a855f7"];

 function YearChart({ data = [], onSelectYear = () => {} }) {
  const handleClick = (e) => {
    const yr = Number(e?.activeLabel ?? e?.payload?.name ?? e?.payload?.payload?.name);
    if (!Number.isNaN(yr) && yr) onSelectYear(yr);
  };

  return (
    <div className="chart-card">
      <h5 className="chart-title">Yearly Production</h5>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} onClick={handleClick} margin={{ left: 16, right: 12, top: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6edf6"/>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={70} />
            <Tooltip formatter={(v) => Number(v).toLocaleString()} />
            <Bar dataKey="value" radius={[6,6,0,0]}>
              {data.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


export default React.memo(YearChart, (prev, next) => {
  return prev.data === next.data;
});