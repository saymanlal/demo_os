import React, { useEffect, useState } from "react";
import { Sparkles, Users, TrendingUp, Phone } from "lucide-react";
import PhoneDemo from "../components/PhoneDemo";

import modi from "../assets/modi.png";
import mohan from "../assets/mohan.png";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [citizens, setCitizens] = useState(0);
  const [services, setServices] = useState(0);

  useEffect(() => {
    setMounted(true);

    let c = 0;
    let s = 0;

    const ci = setInterval(() => {
      c += 50;
      if (c >= 8500) {
        c = 8500;
        clearInterval(ci);
      }
      setCitizens(c);
    }, 10);

    const si = setInterval(() => {
      s += 3;
      if (s >= 350) {
        s = 350;
        clearInterval(si);
      }
      setServices(s);
    }, 20);

    return () => {
      clearInterval(ci);
      clearInterval(si);
    };
  }, []);

  const stats = [
    { 
      icon: Users, 
      label: "Citizens Served Daily", 
      value: `${citizens.toLocaleString('en-IN')}+`
    },
    { 
      icon: TrendingUp, 
      label: "Services Digitalized", 
      value: `${services}+`
    },
    { 
      icon: Phone, 
      label: "AI Helpline Calls", 
      value: `${(citizens / 100).toFixed(0)}K+`
    }
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-16 items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-green-50 -z-10"></div>
      <div className="absolute top-10 left-10 w-24 h-24 border-4 border-orange-600 rounded-full opacity-10"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-green-600 rounded-full opacity-10"></div>

      <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-orange-600 to-green-600 text-white mb-6 shadow-lg">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold">
            मध्य प्रदेश सरकार | MP Government
          </span>
        </div>

        {/* Titles */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-gray-100">
          मध्य प्रदेश <span className="text-orange-600">AI</span> पोर्टल
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-400">
          Empowering Citizens with{" "}
          <span className="text-green-600">Artificial Intelligence</span>
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-500 mb-8 max-w-xl">
          Bridging technology and governance through intelligent AI agents.
          Get instant access to government services, information, and support 
          in your preferred language.
        </p>

        {/* Features */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-400">Key Features:</h3>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              🇮🇳 24/7 Hindi & English Support
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              📱 Voice & Chat Assistance
            </span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              🏛️ Government Services Portal
            </span>
          </div>
        </div>

        {/* Leadership Photos */}
        <div className="flex items-center gap-6 mb-12">
          <div className="text-center">
            <img 
              src={modi} 
              alt="Narendra Modi"
              className="w-20 h-20 rounded-full object-fill shadow-lg mb-2"
            />
            <div className="text-sm font-semibold text-gray-200">Shri Narendra Modi</div>
            <div className="text-xs text-gray-400">Hon'ble Prime Minister</div>
          </div>

          <div className="text-center">
            <img 
              src={mohan} 
              alt="Mohan Yadav"
              className="w-20 h-20 rounded-full object-cover shadow-lg mb-2"
            />
            <div className="text-sm font-semibold text-gray-200">Shri Mohan Yadav</div>
            <div className="text-xs text-gray-400">Hon'ble Chief Minister</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 border-t border-b border-gray-200 py-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center mb-3 mx-auto shadow-sm">
                <s.icon className="w-6 h-6 text-gray-700" />
              </div>
              <div className="text-2xl font-bold text-gray-300">{s.value}</div>
              <div className="text-xs text-gray-600 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Access Government Services →
          </button>
        </div>
      </div>

      {/* Phone Demo */}
      <div className="flex justify-center lg:justify-end relative">
        <div className="relative">
          <PhoneDemo />
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-orange-500">
            <div className="text-center">
              <div className="text-xs font-bold text-orange-600">MP</div>
              <div className="text-[8px] text-gray-600">Govt.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
