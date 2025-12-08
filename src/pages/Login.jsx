// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Default values (change if your environment needs different)
  const GST_NUMBER = "GST123";
  const COMP_CODE = 1;
  const BRANCH_CODE = 1001;
  const FN_YEAR = 2025;

  const handleLogin = async () => {
    setError("");
    try {
      // IMPORTANT: your backend login (curl) used GET with query params
      const url = "http://devserver:54700/api/Auth/Login";
      const params = {
        GstNumber: GST_NUMBER,
        UserName: username || "Admin",
        Password: password || "12345",
        CompCode: COMP_CODE,
        BranchCode: BRANCH_CODE,
        FnYear: FN_YEAR,
      };

      const res = await axios.get(url, { params });
      console.log("Login response:", res);

      const token = res.data?.token;
      if (!token) {
        setError("Login failed: token not returned by server");
        return;
      }

      localStorage.setItem("token", token);
      // After token stored, navigate to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error full:", err);
      if (err.response) {
        // server responded with a status (4xx,5xx)
        console.error("Server response:", err.response.status, err.response.data);
        setError(`Login failed: ${err.response.status} ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        // request made but no response (often CORS / network)
        console.error("No response (request):", err.request);
        setError("No response from server. Check server is running and CORS.");
      } else {
        setError(err.message);
      }
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
          placeholder="Username (e.g. Admin)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
  
        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="Password (e.g. 12345)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
  
        <button className="login-btn" onClick={handleLogin}>Login</button>
  
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
