import React from "react";
import KpiTile from "./KpiTile";

/**
 * Top KPI tiles row (Quantity, Rework, Cost, Labor)
 */
export default function TilesRow({
  summary = {},
  yearLabel = "—",
  monthLabel = "—",
  weekLabel = "—",
  dayLabel = "—"
}) {

  return (
    <div className="tiles-row">

      {/* Quantity KPI */}
      <KpiTile
        className="kpi-primary"
        title="Year Production"
        value={summary.quantity}
        sub={yearLabel}
      />

      <KpiTile
        className="kpi-success"
        title="Month Production"
        value={summary.rework}
        sub={monthLabel}
      />

      <KpiTile
        className="kpi-warning"
        title="Week Production"
        value={summary.cost}
        sub={weekLabel}
      />

      <KpiTile
        className="kpi-danger"
        title="Today Production"
        value={summary.labor}
        sub={dayLabel}
      />


    </div>
  );
}
