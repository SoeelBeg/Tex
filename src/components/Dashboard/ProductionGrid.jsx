import React from "react";
import BookWiseChart from "./BookWiseChart";

export default function ProductionGrid({ lists = {} }) {

  // Sirf BOOK WISE data
  const bookData = lists.book || [];

  return (
    <div className="production-grid">

      {/* FULL ROW BOOK WISE CHART */}
      <div className="prod-card">
        <BookWiseChart data={bookData} />
      </div>

      {/*
        Beam / Item / Factory / Customer
        abhi intentionally OFF rakhe hain
      */}
    </div>
  );
}
