import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Activity, 
  LogOut,
  Sparkles,
  Bell,
  ChevronRight,
  Shield,
  Zap,
  MessageSquare,
  TrendingUp,
  Download,
  Settings,
  HelpCircle
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    calls: 0,
    messages: 0,
    resolution: 0,
    satisfaction: 0
  });

  useEffect(() => {
    api.get("/dashboard/")
      .then((res) => {
        setData(res.data);
        // Start counter animations
        setTimeout(() => {
          animateStats(res.data.stats || {
            calls: 1250,
            messages: 3420,
            resolution: 94,
            satisfaction: 96
          });
        }, 500);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        window.location.href = "/auth";
      });
    
    setMounted(true);
  }, []);

  const animateStats = (targetStats) => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    
    Object.keys(targetStats).forEach((key) => {
      let current = 0;
      const target = targetStats[key];
      const step = target / steps;
      
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setStats(prev => ({
          ...prev,
          [key]: Math.round(current)
        }));
      }, stepDuration);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/auth";
  };

  const planColors = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    expired: "bg-red-500",
    premium: "bg-purple-500",
    basic: "bg-blue-500",
    enterprise: "bg-indigo-500"
  };

  const getPlanColor = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('enterprise')) return 'indigo';
    if (name.includes('premium')) return 'purple';
    if (name.includes('pro')) return 'blue';
    return 'blue';
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <Navbar />
        <div className="pt-32 flex justify-center items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const planColor = getPlanColor(data.plan.name);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <div className="pt-28 px-4 md:px-10 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className={`mb-8 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Welcome back!
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2 dark:text-white">
            Hello,{" "}
            <span className="text-blue-600 dark:text-blue-400">{data.user.name.split(' ')[0]} 👋</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's what's happening with your AI agents today
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Stats Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              {[
                { 
                  icon: Phone, 
                  label: "Total Calls", 
                  value: `${stats.calls}+`, 
                  color: "blue",
                  trend: "+12%",
                  delay: 0
                },
                { 
                  icon: MessageSquare, 
                  label: "Messages", 
                  value: `${stats.messages}+`, 
                  color: "green",
                  trend: "+24%",
                  delay: 100
                },
                { 
                  icon: Shield, 
                  label: "Resolution", 
                  value: `${stats.resolution}%`, 
                  color: "purple",
                  trend: "+3%",
                  delay: 200
                },
                { 
                  icon: TrendingUp, 
                  label: "Satisfaction", 
                  value: `${stats.satisfaction}%`, 
                  color: "indigo",
                  trend: "+8%",
                  delay: 300
                }
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-${stat.color}-300 dark:hover:border-${stat.color}-600 transition-all duration-500 group hover:scale-[1.02] cursor-pointer ${
                    mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  style={{ transitionDelay: `${200 + stat.delay}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                    </div>
                    <span className={`text-sm font-medium text-${stat.color}-600 dark:text-${stat.color}-400`}>
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Plan Details Card */}
            <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500 delay-300 hover:shadow-lg ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      Your Plan
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Manage your subscription and billing
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-${planColor}-100 dark:bg-${planColor}-900/30 text-${planColor}-600 dark:text-${planColor}-400`}>
                    {data.plan.status}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{data.plan.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Active until Dec 31, 2024</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Usage Limit</p>
                      <p className="font-semibold text-slate-800 dark:text-white">10K calls/month</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">Current Usage</p>
                      <p className="font-semibold text-slate-800 dark:text-white">3,420 calls</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Manage Plan
                </button>
                <button className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 text-sm font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Invoice History
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-500 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  { time: "10:30 AM", action: "New voice agent deployed", status: "success" },
                  { time: "Yesterday", action: "Monthly usage report generated", status: "info" },
                  { time: "2 days ago", action: "Billing payment processed", status: "success" },
                  { time: "Dec 5", action: "Plan upgraded to Enterprise", status: "warning" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'success' ? 'bg-green-500' : 
                        item.status === 'warning' ? 'bg-yellow-500' : 
                        'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{item.action}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Quick Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-500 delay-500 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {data.user.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{data.user.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise Account</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                    <p className="font-medium text-slate-800 dark:text-white truncate">{data.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                    <p className="font-medium text-slate-800 dark:text-white">{data.user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Member Since</p>
                    <p className="font-medium text-slate-800 dark:text-white">Jan 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`space-y-3 transition-all duration-500 delay-600 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Quick Actions</h3>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all hover:scale-[1.02] group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="font-medium text-slate-800 dark:text-white">Upgrade Plan</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all hover:scale-[1.02] group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Activity className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="font-medium text-slate-800 dark:text-white">View Analytics</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all hover:scale-[1.02] group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="font-medium text-slate-800 dark:text-white">Support Center</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:scale-[1.02] group border border-red-200 dark:border-red-800 mt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <LogOut className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="font-medium">Logout</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}