import React, { useEffect, useState } from "react";
import { Zap, Shield, PhoneCall, BarChart3, Workflow, Plug } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Features() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: PhoneCall,
      title: "AI Voice Agents",
      desc: "Human-like AI agents that handle inbound and outbound calls with high accuracy and natural flow.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      desc: "Track call volume, outcomes, latency, and agent performance with live dashboards.",
    },
    {
      icon: Workflow,
      title: "Smart Automation",
      desc: "Automate call routing, follow-ups, lead qualification, and workflows without manual effort.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "Built with compliance, encryption, and SLA-backed reliability for production environments.",
    },
    {
      icon: Plug,
      title: "Easy Integrations",
      desc: "Connect seamlessly with CRMs, ticketing tools, and internal systems via APIs.",
    },
    {
      icon: Zap,
      title: "Built for Scale",
      desc: "Designed to handle thousands of concurrent calls without performance degradation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 transition-all duration-500">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="pt-[120px]">
        {/* HEADER */}
        <section
          className={`max-w-7xl mx-auto px-6 mb-20 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
            Platform Capabilities
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Features built for{" "}
            <span className="text-blue-600 dark:text-blue-400">
              real-world scale
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            AiHouseOS gives teams production-ready AI voice infrastructure with
            reliability, observability, and control baked in from day one.
          </p>
        </section>

        {/* FEATURES GRID */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5">
                <f.icon className="w-7 h-7 text-blue-500" />
              </div>

              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
