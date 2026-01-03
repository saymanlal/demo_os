import React, { useState, useEffect } from "react";
import { Phone, ChevronRight, Sun, Moon, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Use Cases", path: "/use-cases" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrollY > 10
          ? "bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-md"
          : "bg-transparent"
      } ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              AiHouseOS
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI Calling Platform
            </p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium transition-all relative ${
                isActive(item.path)
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-500"
              }`}
            >
              {item.name}
              {isActive(item.path) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500"></span>
              )}
            </Link>
          ))}

          {/* DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-6 rounded-full p-1 bg-slate-200 dark:bg-slate-800 flex items-center"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow transition-all ${
                darkMode ? "translate-x-6" : ""
              }`}
            >
              {darkMode ? (
                <Moon className="w-3 h-3 text-blue-400 mx-auto mt-1" />
              ) : (
                <Sun className="w-3 h-3 text-orange-500 mx-auto mt-1" />
              )}
            </div>
          </button>

          {/* AUTH */}
          <Link
            to="/auth"
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm hover:scale-105 transition"
          >
            Get Started <ChevronRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="px-6 py-6 flex flex-col gap-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenu(false)}
                className={`text-base font-medium ${
                  isActive(item.path)
                    ? "text-blue-600 font-bold"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/auth"
              onClick={() => setMobileMenu(false)}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
