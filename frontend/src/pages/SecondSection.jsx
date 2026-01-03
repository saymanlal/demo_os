import React from "react";
import { Globe, Users, Clock, CheckCircle } from "lucide-react";
import Lottie from "lottie-react";
import heroAnimation from "../assets/animations/hero.json";

export default function SecondSection() {
  const features = [
    { icon: Globe, text: "Multilingual, global-ready" },
    { icon: Users, text: "Natural human conversations" },
    { icon: Clock, text: "24/7 availability at scale" },
    { icon: CheckCircle, text: "Zero missed interactions" }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-center">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Built for real-world{" "}
          <span className="text-blue-600">communication load</span>
        </h2>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-xl">
          AiHouseOS handles thousands of simultaneous conversations without degrading experience.
          This is infrastructure, not a demo toy.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/70 dark:bg-slate-900/50 border hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-blue-500" />
                </div>
                <span className="font-medium text-lg">{f.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Lottie animationData={heroAnimation} loop className="max-w-lg" />
      </div>
    </section>
  );
}
