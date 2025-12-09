import React, { useState, useEffect } from "react";
import { Sparkles, Zap, Shield, Phone } from "lucide-react";
import Lottie from "lottie-react";
import heroAnimation from "../assets/animations/hero.json"; // Adjust path as needed

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { 
      icon: Zap, 
      label: "Active Users", 
      value: "<500ms", 
      bgColor: "bg-blue-100 dark:bg-blue-900/30", 
      textColor: "text-blue-500" 
    },
    { 
      icon: Shield, 
      label: "Security", 
      value: "ISO/GDPR", 
      bgColor: "bg-orange-100 dark:bg-orange-900/30", 
      textColor: "text-orange-500" 
    },
    { 
      icon: Phone, 
      label: "Scalability", 
      value: "Millions/day", 
      bgColor: "bg-blue-100 dark:bg-blue-900/30", 
      textColor: "text-blue-500" 
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
      {/* LEFT – LOTTIE ANIMATION */}
      <div className="flex justify-center order-2 md:order-1">
        <Lottie 
          animationData={heroAnimation} 
          loop={true} 
          className="w-full max-w-lg hover:scale-105 transition-transform duration-700" 
        />
      </div>

      {/* RIGHT – TEXT CONTENT */}
      <div className={`transition-all duration-1000 order-1 md:order-2 ${
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
          {stats.map((s, i) => (
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
  );
}