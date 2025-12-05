import React from "react";
import { CheckCircle, Globe, Users, Clock } from "lucide-react";

export default function Landing() {
  const features = [
    { icon: Globe, text: "Multilingual Support" },
    { icon: Users, text: "Human-like Conversations" },
    { icon: Clock, text: "24/7 Availability" },
    { icon: CheckCircle, text: "Zero Wait Time" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to <span className="text-emerald-500">Transform</span> Your Communication?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join 500+ businesses using VoiceOS for intelligent customer engagement
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT - Features */}
        <div>
          {/* Features List */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="
                  p-4 rounded-xl
                  bg-white/50 dark:bg-gray-900/50
                  border border-gray-200 dark:border-gray-800
                  backdrop-blur-sm
                "
              >
                <div className="flex items-center gap-3">
                  <div className="
                    w-10 h-10 rounded-lg
                    bg-gradient-to-br from-emerald-400/20 to-emerald-600/20
                    flex items-center justify-center
                  ">
                    <feature.icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="
            p-6 rounded-2xl
            bg-gradient-to-br from-emerald-500/10 to-emerald-600/10
            border border-emerald-500/20
          ">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Calls/Day</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-8 p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
              <div>
                <p className="italic text-gray-700 dark:text-gray-300 mb-2">
                  "VoiceOS reduced our response time by 90%. Game changer for our support team."
                </p>
                <div className="font-medium">Sarah Chen</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">CTO, TechCorp</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Form */}
        <div className="
          relative
          p-8 rounded-3xl
          bg-gradient-to-br from-white to-gray-50
          dark:from-gray-900 dark:to-gray-950
          border border-gray-200 dark:border-gray-800
          shadow-2xl
        ">
          {/* Decorative element */}
          <div className="
            absolute -top-3 -right-3
            w-24 h-24
            bg-gradient-to-br from-emerald-400 to-emerald-600
            rounded-2xl -rotate-12
            opacity-10
          "></div>

          <div className="relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                Request a <span className="text-emerald-500">Personalized</span> Demo
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                See how VoiceOS can transform your business communications
              </p>
            </div>

            <form className="space-y-4">
              {[
                { label: "Full Name", type: "text", placeholder: "John Doe" },
                { label: "Work Email", type: "email", placeholder: "john@company.com" },
                { label: "Phone Number", type: "tel", placeholder: "+1 (555) 123-4567" },
                { label: "Company Name", type: "text", placeholder: "Your Company" }
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="
                      w-full px-4 py-3 rounded-xl
                      bg-white/50 dark:bg-gray-800/50
                      border border-gray-300 dark:border-gray-700
                      focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                      outline-none transition
                    "
                  />
                </div>
              ))}

              <div className="pt-4">
                <button
                  type="submit"
                  className="
                    w-full py-3 rounded-xl
                    bg-gradient-to-r from-emerald-500 to-emerald-600
                    hover:from-emerald-600 hover:to-emerald-700
                    text-white font-semibold
                    shadow-lg shadow-emerald-500/25
                    hover:shadow-xl hover:shadow-emerald-500/40
                    transition-all duration-300
                  "
                >
                  Schedule Demo Call
                </button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                  Get a callback within 30 minutes
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}