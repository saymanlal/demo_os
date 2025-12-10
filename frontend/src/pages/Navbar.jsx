import React, { useState } from "react";
import { Phone, ChevronRight, Sun, Moon, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Add this import

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme(); // Get from context

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = ["Features", "Use Cases", "Pricing", "Contact"];

  return (
    <nav 
      className={`max-w-7xl mx-auto px-6 py-6 flex justify-between items-center transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover:rotate-3 shadow-lg shadow-blue-500/20">
          <Phone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300">
            VoiceOS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AI Calling Platform
          </p>
        </div>
      </div>

      {/* DESKTOP LINKS */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item, index) => (
          <a 
            key={item} 
            href="#" 
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 relative group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
        ))}

        {/* THEME TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-6 rounded-full p-1 bg-slate-200 dark:bg-slate-800 flex items-center relative transition-all duration-500 hover:scale-110"
          aria-label="Toggle dark mode"
        >
          <div className={`w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center transform transition-all duration-500 ${
            darkMode ? "translate-x-6" : ""
          }`}>
            {darkMode ? (
              <Moon className="w-3 h-3 text-blue-400" />
            ) : (
              <Sun className="w-3 h-3 text-orange-500" />
            )}
          </div>
        </button>

        {/* GET STARTED BUTTON */}
        <button 
          onClick={() => navigate("/auth")}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          Get Started 
          <ChevronRight className="inline w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button 
        className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-transform duration-300"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        ) : (
          <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        )}
      </button>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-lg border-t border-slate-200 dark:border-slate-800 md:hidden z-50">
          <div className="max-w-7xl mx-auto px-6 py-6">

            {/* Navigation Links */}
            <div className="flex flex-col gap-4 mb-6">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 py-2 border-b border-slate-100 dark:border-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile Theme Toggle + Button */}
            <div className="flex items-center justify-between">
              
              {/* toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-12 h-6 rounded-full p-1 bg-slate-200 dark:bg-slate-800 flex items-center relative transition-all duration-500"
                aria-label="Toggle dark mode"
              >
                <div className={`w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center transform transition-all duration-500 ${
                  darkMode ? "translate-x-6" : ""
                }`}>
                  {darkMode ? (
                    <Moon className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Sun className="w-3 h-3 text-orange-500" />
                  )}
                </div>
              </button>

              {/* MOBILE GET STARTED BUTTON */}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/auth");
                }}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}