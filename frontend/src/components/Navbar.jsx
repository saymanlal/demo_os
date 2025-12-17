import React, { useState, useEffect } from "react";
import { Phone, ChevronRight, Sun, Moon, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", scrollTo: "home" },
    { name: "Features", scrollTo: "features" },
    { name: "Use Cases", scrollTo: "usecases" },
    { name: "Pricing", scrollTo: "pricing" },
    { name: "Contact", scrollTo: "contact" },
  ];

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);

      navItems.forEach((item) => {
        const section = document.getElementById(item.scrollTo);
        if (section) {
          const top = section.offsetTop - 100; // adjust offset for navbar height
          const bottom = top + section.offsetHeight;
          if (window.scrollY >= top && window.scrollY < bottom) {
            setActiveSection(item.scrollTo);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollHandler = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover:rotate-3 shadow-lg shadow-blue-500/20">
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
          {navItems.map((item, i) => (
            <button
              key={item.name}
              onClick={() => scrollHandler(item.scrollTo)}
              style={{ animationDelay: `${i * 100}ms` }}
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 relative group ${
                activeSection === item.scrollTo
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400"
              }`}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}

          {/* DARK MODE SWITCH */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-6 rounded-full p-1 bg-slate-200 dark:bg-slate-800 flex items-center"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center transition-all duration-500 ${
                darkMode ? "translate-x-6" : ""
              }`}
            >
              {darkMode ? (
                <Moon className="w-3 h-3 text-blue-400" />
              ) : (
                <Sun className="w-3 h-3 text-orange-500" />
              )}
            </div>
          </button>

          {/* GET STARTED */}
          <Link
            to="/auth"
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            Get Started
            <ChevronRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-lg border-t border-slate-200 dark:border-slate-800 md:hidden z-50">
          <div className="px-6 py-6 flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  scrollHandler(item.scrollTo);
                  setMobileMenu(false);
                }}
                className="text-base font-medium text-slate-700 dark:text-slate-300"
              >
                {item.name}
              </button>
            ))}

            <div className="flex justify-between items-center">
              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-12 h-6 rounded-full p-1 bg-slate-200 dark:bg-slate-800 flex items-center"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center transition-all duration-500 ${
                    darkMode ? "translate-x-6" : ""
                  }`}
                >
                  {darkMode ? (
                    <Moon className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Sun className="w-3 h-3 text-orange-500" />
                  )}
                </div>
              </button>

              {/* Auth Button */}
              <Link
                to="/auth"
                onClick={() => setMobileMenu(false)}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
