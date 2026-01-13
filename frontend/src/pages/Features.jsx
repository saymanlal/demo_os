import React, { useEffect, useState } from "react";
import { PhoneCall, BarChart3, Workflow, Shield, Zap, FileText, Globe, MessageSquare, Clock, ShieldCheck, Users } from "lucide-react";
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
      title: "24/7 Voice Assistance",
      desc: "AI voice agents available round-the-clock in Hindi and English for citizen support and service delivery.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: FileText,
      title: "Digital Document Services",
      desc: "Apply for certificates, licenses, and government documents through AI-guided processes.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MessageSquare,
      title: "Multi-language Chat",
      desc: "Chat support in Hindi, English, and regional languages for inclusive citizen engagement.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: BarChart3,
      title: "Public Service Analytics",
      desc: "Real-time monitoring of service delivery, response times, and citizen satisfaction metrics.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Workflow,
      title: "Automated Workflows",
      desc: "Streamlined processes for grievance redressal, application processing, and service delivery.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Globe,
      title: "Rural Connect",
      desc: "Bridging digital divide with voice-first interfaces accessible across all districts of MP.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Clock,
      title: "Instant Response",
      desc: "Reduced waiting times with AI-powered instant responses to citizen queries.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: ShieldCheck,
      title: "Secure Authentication",
      desc: "Government-grade security with Aadhaar integration and secure citizen data protection.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Users,
      title: "Citizen Empowerment",
      desc: "Democratizing access to government services through intuitive AI interfaces.",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 text-gray-900">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="pt-28">
        {/* HEADER */}
        <section
          className={`max-w-7xl mx-auto px-6 mb-16 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Government Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-600 to-green-600 rounded-lg shadow-lg text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">मध्य प्रदेश सरकार</h2>
                <p className="text-sm opacity-90">Madhya Pradesh Government</p>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <p className="text-sm">"सबका साथ, सबका विकास, सबका विश्वास"</p>
                <p className="text-xs">With everyone's support, everyone's development, everyone's trust</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="px-4 py-2 rounded-md bg-orange-100 text-orange-700 text-sm font-bold">
              डिजिटल सुविधाएँ | Digital Features
            </div>
            <div className="h-1 flex-1 bg-gradient-to-r from-orange-500 to-green-500"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            <span className="text-orange-600">AI-Powered</span> Public Services
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Transforming <span className="text-green-600">Governance</span> in Madhya Pradesh
          </h2>

          <p className="text-lg text-gray-700 max-w-3xl">
            Experience next-generation citizen services powered by Artificial Intelligence. 
            Our platform integrates cutting-edge technology with government processes to deliver 
            efficient, transparent, and accessible services to every resident of Madhya Pradesh.
          </p>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">85+</div>
              <div className="text-sm text-gray-600">Districts Covered</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">350+</div>
              <div className="text-sm text-gray-600">Services Available</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Service Availability</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-bold mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {f.desc}
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* MISSION STATEMENT */}
        <section className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-16 mb-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="text-3xl font-bold mb-6">हमारा उद्देश्य | Our Mission</div>
            <p className="text-xl max-w-4xl mx-auto leading-relaxed">
              To create a digitally inclusive Madhya Pradesh where every citizen, 
              regardless of location or digital literacy, can access government services 
              with ease, speed, and transparency through intelligent AI interfaces.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold">श्री नरेंद्र मोदी</div>
                <div className="text-sm opacity-90">माननीय प्रधानमंत्री</div>
              </div>
              <div className="border-l border-white/30 h-16"></div>
              <div className="text-center">
                <div className="text-4xl font-bold">श्री मोहन यादव</div>
                <div className="text-sm opacity-90">माननीय मुख्यमंत्री</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}