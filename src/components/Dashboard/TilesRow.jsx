import React from "react";
import KpiTile from "./KpiTile";

/**
 * Top KPI tiles row (Quantity, Rework, Cost, Labor)
 */
export default function TilesRow({ summary = {}, periodLabel = "All" }) {
  return (
    <div className="tiles-row">

      {/* Quantity KPI */}
      <KpiTile
        title="Quantity"
        value={summary.quantity?.toLocaleString() ?? "—"}
        diff={15}
        positive={true}
        sub={`Production (${periodLabel})`}
      />

      {/* Rework KPI */}
      <KpiTile
        title="Rework Quantity"
        value={summary.rework ?? "—"}
        diff={-89}
        positive={false}
        sub="Current Month"
      />

      {/* Manufacturing Cost KPI */}
      <KpiTile
        title="Manufacturing Cost"
        value={summary.cost ?? "—"}
        diff={-90}
        positive={false}
        sub="Current Month"
      />

      {/* Labor Cost KPI */}
      <KpiTile
        title="Labor Cost"
        value={summary.labor ?? "—"}
        diff={-91}
        positive={false}
        sub="Current Month"
      />

    </div>
  );
}
