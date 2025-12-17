import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import roboAnimation from "../assets/animations/robolottie.json";
import { Mail, Lock, User, Eye, EyeOff, Check, ArrowRight, Globe, Zap, Home, Users, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AuthPages() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const switchMode = (newMode) => setMode(newMode);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } },
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 transition-all duration-500 overflow-x-hidden">
      
      {/* Navbar */}
      <Navbar />

      {/* Background Gradients - fixed z-index */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-4 pt-28 z-10 relative">
        <div className="w-full max-w-6xl">
          <motion.div
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden flex flex-col md:flex-row min-h-[600px]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* LEFT SIDE - Lottie Animation */}
            <div className="w-full md:w-1/2 p-12 flex items-center justify-center relative overflow-visible">
              <motion.div variants={itemVariants} className="relative flex flex-col items-center justify-center w-full h-full z-10">
                <Lottie animationData={roboAnimation} loop autoplay className="w-[300px] h-[300px] drop-shadow-2xl relative z-10" />

                <AnimatePresence mode="wait">
                  {mode === "signup" ? (
                    <motion.div key="signup-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center mt-6">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Join AiHouseOS</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">Where AI meets human-like conversations</p>
                    </motion.div>
                  ) : (
                    <motion.div key="signin-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center mt-6">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">Continue your AI usage journey</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-sky-500/10 hover:from-blue-500/20 hover:to-sky-500/20 text-blue-600 dark:text-blue-400 font-medium rounded-xl border border-blue-500/20 transition-all duration-300 flex items-center gap-2"
                >
                  {mode === "signup" ? (
                    <>
                      <span>Already have an account?</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>New to AiHouseOS?</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT SIDE - Forms */}
            <div className="w-full md:w-1/2 p-8 md:p-12 relative border-l border-slate-200/50 dark:border-slate-700/50 overflow-visible">
              <motion.div variants={itemVariants} className="relative flex flex-col z-10">
                <AnimatePresence mode="wait">
                  {mode === "signin" ? (
                    <motion.form
                      key="signin"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back 👋</h2>
                      <p className="text-slate-600 dark:text-slate-400">Sign in to your AiHouseOS account</p>

                      <div className="space-y-4">
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="email" placeholder="Enter your email" className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" required />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base">
                        {isLoading ? "Signing in..." : "Sign In to Dashboard"}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
                      <p className="text-slate-600 dark:text-slate-400">Start your free trial today</p>

                      <div className="space-y-4">
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="text" placeholder="Full name" className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" required />
                        </div>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="email" placeholder="Work email" className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" required />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type={showPassword ? "text" : "password"} placeholder="Create password" className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base">
                        {isLoading ? "Creating account..." : "Start Free Trial"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
