// src/main.jsx (example)
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // <- make sure this matches your CSS file name
import "bootstrap/dist/css/bootstrap.min.css";
import "./pages/Dashboard.css"; // we'll add this file below



createRoot(document.getElementById("root")).render(<App />);
