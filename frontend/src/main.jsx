import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Features from "./pages/Features";
import UseCases from "./pages/Use-Cases";
import AuthPages from "./pages/AuthPages";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/features" element={<Features />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/auth" element={<AuthPages />} />
        {/* Add more routes here */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/pricing" element={<Pricing />} /> */}
      </Routes>
    </ThemeProvider>
  </BrowserRouter>
);