// src/components/Header.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../ThemeContext";
import { Moon, Sun, User, Settings, LogOut } from "lucide-react";
import "./Header.css";
import { useNavigate } from "react-router-dom";


export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const ref = useRef();
 const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
};

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="dash-header">
      <h2 className="dh-title">Tex Dashboard</h2>

      <div className="dh-right" ref={ref}>
        {/* THEME BUTTON */}
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* PROFILE ICON */}
        <div className="profile-circle" onClick={() => setOpen(!open)}>
          <User size={16} />
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="profile-menu">
            <div className="pm-item">
              {/* <Settings size={16} /> Settings */}
            </div>
            <div className="pm-item" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </div>

          </div>
        )}
      </div>
    </header>
  );
}
