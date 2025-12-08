// src/pages/DashboardLayout.jsx
import React from "react";

/**
 * Layout wrapper for dashboard pages.
 * Keeps header / footer separate from data logic.
 */
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-root">
      {/* <header className="header">
        <div className="header-left">
          <div className="header-title">Factory Analytics</div>
        </div>
        <nav className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#production">Production</a>
          <a href="#reports">Reports</a>
        </nav>
      </header> */}

      <main className="dashboard-page">{children}</main>

      <footer style={{ textAlign: "center", padding: 18, color: "#7b7f88", fontSize: 13 }}>
        © {new Date().getFullYear()} Factory Analytics — Demo
      </footer>
    </div>
  );
}
