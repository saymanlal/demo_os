import React, { useEffect, useState } from "react";
import {
  Headphones,
  Briefcase,
  CreditCard,
  Stethoscope,
  Users,
  Bot
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UseCases() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const useCases = [
    {
      icon: Headphones,
      title: "Customer Support",
      desc: "Handle high-volume support calls with AI agents that resolve issues, escalate intelligently, and stay available 24/7.",
    },
    {
      icon: Briefcase,
      title: "Sales & Lead Qualification",
      desc: "Qualify leads, follow up instantly, and book meetings without human intervention or delays.",
    },
    {
      icon: CreditCard,
      title: "Fintech & Banking",
      desc: "Secure voice workflows for KYC, payment confirmations, reminders, and transactional alerts.",
    },
    {
      icon: Stethoscope,
      title: "Healthcare Operations",
      desc: "Appointment reminders, patient follow-ups, and inbound call handling with compliance-ready AI.",
    },
    {
      icon: Users,
      title: "HR & Recruitment",
      desc: "Automate interview scheduling, candidate screening, and employee notifications at scale.",
    },
    {
      icon: Bot,
      title: "Internal Automation",
      desc: "Replace repetitive internal calls and notifications with fast, reliable AI-driven workflows.",
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
            Real-world Applications
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Built for{" "}
            <span className="text-blue-600 dark:text-blue-400">
              real business use-cases
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            AiHouseOS adapts across industries, teams, and workflows. These are
            not demos. These are production-grade use cases running at scale.
          </p>
        </section>

        {/* USE CASES GRID */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
          {useCases.map((u, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5">
                <u.icon className="w-7 h-7 text-blue-500" />
              </div>

              <h3 className="text-xl font-semibold mb-3">{u.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {u.desc}
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
