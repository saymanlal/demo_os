import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  Phone,
  Zap,
  Shield,
} from "lucide-react";

import Landing from "./pages/Landing";
import Lottie from "lottie-react";
import heroAnimation from "./assets/animations/hero.json";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 transition-all duration-500 overflow-x-hidden">

        {/* NAVBAR */}
        <nav className={`max-w-7xl mx-auto px-6 py-6 flex justify-between items-center transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}>

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

          {/* LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Use Cases", "Pricing", "Contact"].map((item, index) => (
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

            <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group">
              Get Started <ChevronRight className="inline w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* MOBILE MENU */}
          <button className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-transform duration-300">
            <div className="w-6 h-0.5 bg-slate-600 dark:bg-slate-400 mb-1 transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-slate-600 dark:bg-slate-400 mb-1 transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-slate-600 dark:bg-slate-400 transition-all duration-300"></div>
          </button>
        </nav>

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT – LOTTIE ANIMATION */}
          <div className="flex justify-center">
            <Lottie 
              animationData={heroAnimation} 
              loop={true} 
              className="w-full max-w-lg hover:scale-105 transition-transform duration-700" 
            />
          </div>

          {/* RIGHT – TEXT CONTENT */}
          <div className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                AI-Powered Voice Agents
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className={`inline-block transition-all duration-700 delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                AI Agents for{" "}
              </span>
              <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-500">
                Enterprises
              </span>
            </h1>

            {/* Subheading */}
            <p className={`text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              Automate voice, SMS, WhatsApp, chat, and email with AI agents that understand intent, trigger workflows, and close the loop with measurable impact.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-10">
              {[
                { icon: Zap, label: "Active Users", value: "<500ms", bgColor: "bg-blue-100 dark:bg-blue-900/30", textColor: "text-blue-500" },
                { icon: Shield, label: "Security", value: "ISO/GDPR", bgColor: "bg-orange-100 dark:bg-orange-900/30", textColor: "text-orange-500" },
                { icon: Phone, label: "Scalability", value: "Millions/day", bgColor: "bg-blue-100 dark:bg-blue-900/30", textColor: "text-blue-500" },
              ].map((s, i) => (
                <div 
                  key={i} 
                  className="text-center hover:scale-110 transition-all duration-500 hover:z-10"
                  style={{ animationDelay: `${600 + i * 200}ms` }}
                >
                  <div className={`w-14 h-14 rounded-xl ${s.bgColor} flex items-center justify-center mx-auto mb-2 hover:rotate-12 transition-transform duration-500 ${
                    mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  }`}>
                    <s.icon className={`w-7 h-7 ${s.textColor} hover:scale-125 transition-transform duration-300`} />
                  </div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{s.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LANDING SECTION */}
        <div className={`transition-all duration-1000 delay-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}>
          <Landing />
        </div>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto px-6 py-8 mt-20 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300"></div>
                <span className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300">VoiceOS</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                © 2025 Cybocraft. All rights reserved.
              </p>
            </div>

            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies", "Contact"].map((item, index) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </footer>

        {/* Add custom CSS for subtle animations */}
        <style jsx>{`
          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce-subtle {
            animation: bounce-subtle 2s ease-in-out infinite;
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Fade-in animation for page load */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          body {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>

      </div>
    </div>
  );
}