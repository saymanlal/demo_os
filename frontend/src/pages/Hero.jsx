import React, { useEffect, useState } from "react";
import { Sparkles, Zap, Shield, Phone } from "lucide-react";
import PhoneDemo from "../components/PhoneDemo";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [customers, setCustomers] = useState(0);
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    setMounted(true);

    let c = 0;
    let u = 0;

    const ci = setInterval(() => {
      c += 5;
      if (c >= 500) {
        c = 500;
        clearInterval(ci);
      }
      setCustomers(c);
    }, 20);

    const ui = setInterval(() => {
      u += 400;
      if (u >= 25000) {
        u = 25000;
        clearInterval(ui);
      }
      setUsage(u);
    }, 30);

    return () => {
      clearInterval(ci);
      clearInterval(ui);
    };
  }, []);

  const stats = [
    { icon: Zap, label: "Customers", value: `${customers}+` },
    { icon: Shield, label: "Security SLA", value: "99.9%" },
    { icon: Phone, label: "Daily Calls", value: `${(usage / 1000).toFixed(0)}K+` }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-center">
      <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border mb-6">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            AI Voice Infrastructure
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Enterprise-grade{" "}
          <span className="text-blue-600 dark:text-blue-400">AI Agents</span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-xl">
          Production-ready AI agents for calls, chat and messaging.
          Designed for scale, reliability and measurable outcomes.
        </p>

        <div className="flex flex-wrap gap-12">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                <s.icon className="w-7 h-7 text-blue-500" />
              </div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <PhoneDemo />
      </div>
    </section>
  );
}
