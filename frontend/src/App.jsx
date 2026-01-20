import React, { useEffect, useState } from "react";
import Hero from "./pages/Hero";
import SecondSection from "./pages/SecondSection";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useTheme } from "./context/ThemeContext";



export default function App() {
  const [mounted, setMounted] = useState(false);
  const { darkMode } = useTheme();

  // 🔥 popup state
  const [talkOpen, setTalkOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 transition-all duration-500 overflow-x-hidden">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <div className="pt-[44px]">
        <Hero mounted={mounted} />
      </div>

      {/* SECOND SECTION */}
      <SecondSection />
      
      {/* FOOTER */}
      <Footer />

      {/* 🔥 FLOATING TALK BUTTON */}
    
      {/* STYLES */}
      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        body {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
