import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import Features from "./pages/Features";
import UseCases from "./pages/Use-Cases";
import AuthPages from "./pages/AuthPages";
import Dashboard from "./pages/Dashboard";

// 🔥 ADMIN IMPORTS
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminCalls from "./admin/pages/AdminCalls";
import AdminComplaints from "./admin/pages/AdminComplaints";

import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

const isAuth = () => !!localStorage.getItem("access_token");

// 🔐 Check if user is Admin (you can customize this logic)
const isAdmin = () => {
  const token = localStorage.getItem("access_token");
  // For now, just check if token exists
  // Later you can decode JWT to check user.groups
  return !!token;
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<App />} />
        <Route path="/features" element={<Features />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/auth" element={<AuthPages />} />

        {/* 🔒 USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={isAuth() ? <Dashboard /> : <Navigate to="/auth" />}
        />

        {/* 🔐 ADMIN ROUTES (Protected) */}
        <Route
          path="/admin"
          element={isAdmin() ? <AdminDashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/admin/calls"
          element={isAdmin() ? <AdminCalls /> : <Navigate to="/auth" />}
        />
        <Route
          path="/admin/complaints"
          element={isAdmin() ? <AdminComplaints /> : <Navigate to="/auth" />}
        />
      </Routes>
    </ThemeProvider>
  </BrowserRouter>
);
