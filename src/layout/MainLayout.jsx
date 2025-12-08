// src/layout/MainLayout.jsx
import React from "react";
import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-content">
        <main>{children}</main>
      </div>
    </div>
  );
}
