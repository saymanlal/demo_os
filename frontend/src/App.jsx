import React, { useState, useEffect } from "react";
import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import SecondSection from "./pages/SecondSection";
import Footer from "./pages/Footer";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 transition-all duration-500 overflow-x-hidden">
        
        {/* NAVBAR */}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} mounted={mounted} />
        
        {/* HERO SECTION */}
        <div className="pt-4"> {/* Add padding for fixed navbar */}
          <Hero mounted={mounted} />
        </div>
        
        {/* SECOND SECTION */}
        <SecondSection />
        
        {/* FOOTER */}
        <Footer />

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