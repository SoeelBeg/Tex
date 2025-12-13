import React from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* Month short names (used for fallback month detection) */
const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

/* Tooltip shown on hover */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="custom-tooltip">
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 6 }}>
        {Number(payload[0].value).toLocaleString()}
      </div>
    </div>
  );
}

/**
 * Month-wise production chart
 * - Shows area + line chart
 * - Clicking a point selects that month
 */
function MonthChart({ data = [], onSelectMonth = () => {} }) {

  /* Extract month number safely from different API shapes */
  const handlePointClick = (payload) => {
    if (!payload) return;

    // Sometimes recharts wraps data inside __raw
    const row = payload.__raw ?? payload;

    // Try numeric month fields first
    const monthNumber =
      Number(row?.MonthNo) ||
      Number(row?.Month) ||
      Number(row?.MonthNumber) ||
      Number(row?.month) ||
      Number(row?.monthNo) ||
      null;

    if (monthNumber && !Number.isNaN(monthNumber)) {
      onSelectMonth(monthNumber);
      return;
    }

    // Fallback: detect month from name (Jan, Feb, etc.)
    const monthName = String(
      row?.MonthName ?? row?.name ?? payload?.name ?? ""
    ).slice(0, 3).toLowerCase();

    const index = MONTH_NAMES.findIndex(
      (m) => m.toLowerCase() === monthName
    );

    if (index >= 0) {
      onSelectMonth(index + 1); // month = index + 1
    }
  };

  return (
    <div className="chart-card">
      <h5 className="chart-title">Monthly Production</h5>

      {/* Chart container */}
      <div style={{ width: "100%", height: 320, minHeight: 320 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ left: 8, right: 8, top: 12, bottom: 8 }}

            /* Click anywhere on chart */
            onClick={(e) => {
              const payload =
                e?.activePayload?.[0]?.payload ??
                (e?.activeLabel
                  ? {
                      name: e.activeLabel,
                      value: e?.activePayload?.[0]?.value,
                    }
                  : null);

              if (payload) handlePointClick(payload);
            }}
          >
            {/* Gradient for area */}
            <defs>
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#46a3e5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#46c5e5" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eef2ff"
            />

            {/* X Axis */}
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />

            {/* Y Axis */}
            <YAxis
              width={70}
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => Number(v).toLocaleString()}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Area chart */}
            <Area
              type="monotone"
              dataKey="value"
              fill="url(#colorProd)"
              stroke="none"
            />

            {/* Line + clickable dots */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#46a3e5"
              strokeWidth={3}
              dot={(props) => (
                <circle
                  {...props}
                  r={6}
                  fill="#fff"
                  stroke="#46a3e5"
                  strokeWidth={3}
                  cursor="pointer"
                  onClick={() => handlePointClick(props.payload)}
                />
              )}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* Memo: re-render only when data reference changes */
export default React.memo(MonthChart, (prev, next) => {
  return prev.data === next.data;
});
