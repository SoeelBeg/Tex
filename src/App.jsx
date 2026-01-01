// src/App.jsx
import React, { lazy, Suspense } from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Lazy imports
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MainLayout = lazy(() => import("./layout/MainLayout"));

import { ThemeProvider } from "./ThemeContext";
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
          <Routes>

            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" />} />

          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

