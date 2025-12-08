// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  // close dropdown when clicking outside
  useEffect(() => {
    const onDoc = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-btn"
          aria-label="Open menu"
          onClick={() => setMenuOpen((s) => !s)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="header-title">Tex Dashboard</div>
      </div>

      {/* Desktop links */}
      {/* <nav className="nav-links">
        <a href="#dashboard">Dashboard</a>
        <a href="#users">Users</a>
        <a href="#reports">Reports</a>
        <a href="#settings">Settings</a>
      </nav> */}

      {/* Mobile dropdown (renders when menuOpen true) */}
      {/* {menuOpen && (
        <div className="nav-dropdown" ref={dropdownRef} role="menu">
          <a href="#dashboard" role="menuitem" onClick={() => setMenuOpen(false)}>Dashboard</a>
          <a href="#users" role="menuitem" onClick={() => setMenuOpen(false)}>Users</a>
          <a href="#reports" role="menuitem" onClick={() => setMenuOpen(false)}>Reports</a>
          <a href="#settings" role="menuitem" onClick={() => setMenuOpen(false)}>Settings</a>
        </div>
      )} */}
    </header>
  );
}
