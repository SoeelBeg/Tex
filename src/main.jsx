// src/main.jsx (example)
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // <- make sure this matches your CSS file name

createRoot(document.getElementById("root")).render(<App />);
