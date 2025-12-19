import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import AuthPages from "./pages/AuthPages";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

const isAuth = () => !!localStorage.getItem("access_token");

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthPages />} />

        {/* 🔒 PROTECTED DASHBOARD */}
        <Route
          path="/dashboard"
          element={isAuth() ? <Dashboard /> : <Navigate to="/auth" />}
        />
      </Routes>
    </ThemeProvider>
  </BrowserRouter>
);
