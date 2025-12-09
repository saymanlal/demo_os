import React, { useState, useEffect } from "react";
import { CheckCircle, Globe, Users, Clock, MessageSquare, Headphones } from "lucide-react";

export default function SecondSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    { icon: Globe, text: "Multilingual Support", color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    { icon: Users, text: "Human-like Conversations", color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
    { icon: Clock, text: "24 hours Availability", color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
    { icon: CheckCircle, text: "Zero Response Time Issue", color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" }
  ];

  return (
    <div className={`transition-all duration-1000 delay-700 ${
      mounted ? "opacity-100" : "opacity-0"
    }`}>
      <section className="max-w-6xl mx-auto px-6 py-20">
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Ready to <span className="text-blue-600 dark:text-blue-400">Transform</span> Your Communication?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-4 text-lg">
            Join 500+ businesses using AiHouseOS for intelligent customer engagement.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT – FEATURES */}
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <span className="font-medium text-lg text-slate-800 dark:text-slate-200">{feature.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-3 text-center gap-8">
                {[
                  { label: "Satisfaction", value: "97%", color: "text-blue-600 dark:text-blue-400" },
                  { label: "Calls/Day", value: "5K+", color: "text-orange-600 dark:text-orange-400" },
                  { label: "Support", value: "24 x 7", color: "text-blue-600 dark:text-blue-400" }
                ].map((s, i) => (
                  <div key={i}>
                    <div className={`text-3xl font-bold ${s.color}`}>
                      {s.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <Headphones className="w-5 h-5 text-orange-500" />
              </div>
              <p className="italic text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-2">
                "AiHouseOS reduced our response time by 90%. The blend of intelligent AI with warm, human-like interactions is a game changer for customer support."
              </p>
              <div className="font-semibold text-lg text-slate-800 dark:text-slate-200">Akhil Chawla</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Founder, Cybokrafts</div>
            </div>
          </div>

          {/* RIGHT – PHONE INPUT DEMO */}
          <PhoneDemo />
        </div>
      </section>
    </div>
  );
}

function PhoneDemo() {
  return (
    <div className="flex justify-center lg:justify-end">
      <div
        className="
          relative w-[300px] md:w-[340px]
          rounded-[2.8rem]
          bg-[#0B0B0B]
          border-[12px] border-[#939393]
          shadow-[0_40px_90px_rgba(0,0,0,0.9)]
          overflow-hidden
        "
      >
        {/* Notch */}
        <div
          className="
            absolute top-0 left-1/2 -translate-x-1/2
            w-36 h-7 bg-[#000000]
            rounded-b-3xl z-20
          "
        />

        {/* Screen */}
        <div
          className="
            h-[620px] w-full p-6
            flex flex-col justify-between
            bg-gradient-to-br
            from-[#111]
            via-[#161616]
            to-[#0A0A0A]
            text-white
          "
        >
          {/* App Header */}
          <div className="flex items-center gap-2">
            <div
              className="
                w-10 h-10 rounded-full
                bg-gradient-to-br from-gray-700 to-gray-900
                flex items-center justify-center
                font-bold
              "
            >
              AI
            </div>
            <span className="text-lg font-semibold text-gray-200">
              AiHouseOS
            </span>
          </div>

          {/* Instruction */}
          <div
            className="
              bg-[#171717]
              p-4 rounded-2xl
              border border-[#2A2A2A]
              text-sm text-gray-200
              max-w-[90%]
            "
          >
            Enter your phone number
          </div>

          {/* Phone Input */}
          <div
            className="
              bg-[#0F0F0F]
              border border-[#2A2A2A]
              rounded-xl
              flex items-center overflow-hidden
            "
          >
            <select
              className="
                bg-transparent px-3 py-3
                text-sm text-gray-300
                outline-none border-r border-[#2A2A2A]
              "
              defaultValue="+91"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+81">🇯🇵 +81</option>
            </select>

            <input
              type="tel"
              placeholder="Phone number"
              className="
                flex-1 bg-transparent
                px-3 py-3 text-sm
                text-gray-200
                placeholder-gray-500
                outline-none
              "
            />
          </div>

          {/* Call Button */}
          <button
            className="
              w-full py-3 rounded-xl
              bg-gradient-to-r from-gray-200 to-gray-400
              text-black font-semibold
              transition-all duration-300
              hover:from-white hover:to-gray-300
              hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]
              active:scale-95
              flex items-center justify-center gap-2
            "
          >
            📞 Receive Demo Call
          </button>
        </div>
      </div>
    </div>
  );
}