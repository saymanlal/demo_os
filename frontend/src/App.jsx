import React, { useState } from "react";
import { Sun, Moon, ChevronRight, Sparkles, Phone, Zap, Shield } from "lucide-react";
import Landing from "./pages/Landing";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    // Apply dark class to parent
    <div className={darkMode ? "dark" : ""}>
      
      {/* Background gradient */}
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-900 dark:text-gray-100 transition-all duration-500">
        
        {/* Top Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                VoiceOS
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI Calling Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition">
              Features
            </a>
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition">
              Use Cases
            </a>
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition">
              Contact
            </a>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="
                w-12 h-6 rounded-full p-1
                bg-gray-200 dark:bg-gray-800
                relative transition-all duration-300
                flex items-center
              "
              aria-label="Toggle theme"
            >
              {/* Toggle circle */}
              <div className={`
                w-5 h-5 rounded-full bg-white dark:bg-gray-900
                shadow-lg transform transition-transform duration-300
                ${darkMode ? 'translate-x-6' : 'translate-x-0'}
                flex items-center justify-center
              `}>
                {darkMode ? 
                  <Moon className="w-3 h-3 text-emerald-400" /> : 
                  <Sun className="w-3 h-3 text-amber-500" />
                }
              </div>
            </button>

            <button className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition">
              Get Started <ChevronRight className="inline w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400"></div>
          </button>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="
              inline-flex items-center gap-2
              px-4 py-2 rounded-full
              bg-emerald-500/10 dark:bg-emerald-500/20
              border border-emerald-500/20
            ">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                AI-Powered Voice Agents
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="
            text-4xl md:text-6xl lg:text-7xl font-bold text-center
            leading-tight md:leading-[1.1]
            max-w-4xl mx-auto mb-6
          ">
            Transform Conversations with{" "}
            <span className="
              bg-gradient-to-r from-emerald-400 to-emerald-600
              bg-clip-text text-transparent
            ">
              Intelligent Voice
            </span>
          </h1>

          {/* Subheading */}
          <p className="
            text-lg md:text-xl text-gray-600 dark:text-gray-400
            text-center max-w-2xl mx-auto mb-12
          ">
            Deploy 24×7 multilingual AI agents that handle support, sales, 
            and engagement—naturally.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {[
              { icon: Zap, label: "Response Time", value: "< 2s" },
              { icon: Shield, label: "Uptime", value: "99.9%" },
              { icon: Phone, label: "Calls Handled", value: "10M+" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="
                  w-12 h-12 rounded-xl
                  bg-gradient-to-br from-emerald-400/20 to-emerald-600/20
                  flex items-center justify-center mx-auto mb-3
                ">
                  <stat.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Landing Component */}
        <div className="pb-20">
          <Landing />
        </div>

        {/* Footer */}
        <footer className="
          max-w-7xl mx-auto px-6 py-8 mt-20
          border-t border-gray-200 dark:border-gray-800
        ">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                <span className="font-bold">VoiceOS</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                © 2024 AI Calling Platform. All rights reserved.
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500">
                Cookies
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}