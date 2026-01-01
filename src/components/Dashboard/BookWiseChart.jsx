import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function BookWiseChart({ data = [] }) {

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No book data</div>;
  }

  const chartData = data.map((r, i) => ({
    name:
      r.Book_Name ||
      r.BookName ||
      r.bookName ||
      r.Book ||
      r.Name ||
      `Book ${i + 1}`,
    value: Number(r.Production ?? 0),
  }));

  const formatBookName = (name) =>
    name.length > 18 ? name.slice(0, 18) + "…" : name;

  return (
    <div className="chart-card">
      <h6 className="chart-title">Book Wise Production</h6>

      <div className="chart-container">
        <ResponsiveContainer>
          <BarChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f2f3f4 "
            />

            <XAxis
              dataKey="name"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={90}     // 👈 pehle 80 tha
              tick={{ fontSize: 12, fontWeight: 600, fill: "var(--text-main)" }}
              tickFormatter={formatBookName}
            />
            <YAxis
              width={70}
              tick={{ fontSize: 12, fontWeight: 600, fill: "var(--text-main)" }}
              tickFormatter={(v) => Number(v).toLocaleString()}
              tickMargin={10}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-main)"
              }}
              labelStyle={{
                color: "var(--text-main)"
              }}
            />

            {/* SINGLE COLOR BAR */}
            <defs>
              <linearGradient id="barTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#1ee7e0d2" stopOpacity={0.8} />
                <stop offset="90%" stopColor="#0be583ff" stopOpacity={0.9} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="value"
              fill="url(#barTeal)"
              radius={[6, 6, 0, 0]}
              animationDuration={900}

            />

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
