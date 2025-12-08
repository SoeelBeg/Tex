import React from 'react';

export default function Sidebar({ menuOpen, toggleMenu }) {
  return (
    <nav className={`sidebar ${menuOpen ? 'open' : ''}`}>
      {/* Mobile cancel button */}
      <button className="close-btn" onClick={toggleMenu}>
        ✕
      </button>

      <h2>Menu</h2>
      <a href="#">Dashboard</a>
      <a href="#">Users</a>
      <a href="#">Reports</a>
      <a href="#">Settings</a>
      <footer>© 2025 Tex Dashboard</footer>
    </nav>
  );
}
