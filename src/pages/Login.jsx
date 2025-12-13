// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in → go dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

 const handleLogin = async () => {
  setError("");

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/Auth/Login`,
      {
        params: {
          GstNumber: "GST123",
          UserName: username,
          Password: password,
          CompCode: Number(import.meta.env.VITE_COMP_CODE),
          BranchCode: Number(import.meta.env.VITE_BRANCH_CODE),
          FnYear: Number(import.meta.env.VITE_DEFAULT_YEAR),
        },
      }
    );

    const token = res.data?.token;
    if (!token) {
      setError("Token not returned from server");
      return;
    }

    localStorage.setItem("token", token);
    navigate("/dashboard", { replace: true });
  } catch (err) {
    console.error("Login error:", err);
    setError("Login failed");
  }
};


  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>

        <label className="login-label">Username</label>
        <input
          className="login-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
