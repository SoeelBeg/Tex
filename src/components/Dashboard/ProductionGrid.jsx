import React from "react";
import ProductionCard from "./ProductionCard";

/**
 * Renders grid of production cards
 * (Book / Beam / Item / Selvage / Factory / Customer)
 */
export default function ProductionGrid({ lists = {} }) {

  /* Configuration for each card */
  const CARD_CONFIG = [
    { key: "book", title: "Book Wise" },
    { key: "beam", title: "Beam Wise" },
    { key: "item", title: "Item Wise" },
    { key: "selvage", title: "Selvage Wise" },
    { key: "factory", title: "Factory Wise" },
    { key: "customer", title: "Customer Wise" },
  ];

  /* Auto-detect label key (name / itemName / bookName etc.) */
  const getLabelKey = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return "";

    return (
      Object.keys(arr[0]).find((k) =>
        k.toLowerCase().includes("name")
      ) || Object.keys(arr[0])[0]
    );
  };

  return (
    <div className="production-grid">
      {CARD_CONFIG.map((card) => {
        const data = lists[card.key] || [];
        const labelKey = getLabelKey(data);

        return (
          <ProductionCard
            key={card.key}
            title={card.title}
            data={data}
            labelKey={labelKey}
          />
        );
      })}
    </div>
  );
}
