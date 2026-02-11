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
import AdminRecordings from "./admin/pages/AdminRecordings";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

/* ============================
   🔐 AUTH HELPERS
============================ */

const getToken = () => localStorage.getItem("access_token");

const getGroups = () => {
  try {
    return JSON.parse(localStorage.getItem("user_groups") || "[]");
  } catch {
    return [];
  }
};

const isAuth = () => !!getToken();

const isAdmin = () => {
  if (!isAuth()) return false;

  const groups = getGroups();
  return groups.includes("Admin") || groups.includes("SuperAdmin");
};

/* ============================
   🚀 APP ROOT
============================ */

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
          element={
            isAuth()
              ? <Dashboard />
              : <Navigate to="/auth" replace />
          }
        />

        {/* 🔐 ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            isAdmin()
              ? <AdminDashboard />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/admin/calls"
          element={
            isAdmin()
              ? <AdminCalls />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/admin/complaints"
          element={
            isAdmin()
              ? <AdminComplaints />
              : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/admin/recordings"
          element={
            isAdmin()
              ? <AdminRecordings />
              : <Navigate to="/auth" replace />
          }
        />

      </Routes>
    </ThemeProvider>
  </BrowserRouter>
);
