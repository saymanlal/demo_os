import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import roboAnimation from "../assets/animations/robolottie.json";
import { Mail, Lock, User, Phone, Eye, EyeOff, Shield, Sparkles, Globe, Zap, Check, ArrowRight, MessageSquare, Volume2, ChevronLeft, ChevronRight, Menu, X, Home, Users, Settings, HelpCircle, BookOpen } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function AuthPages() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const switchMode = (newMode) => {
    if (newMode !== mode) {
      setMode(newMode);
    }
  };

  const navItems = [
    { label: "Home", icon: <Home className="w-4 h-4" /> },
    { label: "Features", icon: <Zap className="w-4 h-4" /> },
    { label: "Pricing", icon: <BookOpen className="w-4 h-4" /> },
    { label: "About", icon: <Users className="w-4 h-4" /> },
    { label: "Docs", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 transition-all duration-500 overflow-x-hidden">
      
      {/* Navbar */}
       <Navbar />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
      </div>


      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-6xl z-10">
          {/* Main Wide Auth Card */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden min-h-[600px] flex mt-8"
          >
            
            {/* LEFT SIDE - Lottie Animation */}
            <div className="w-1/2 p-12 relative flex items-center justify-center overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-full blur-3xl"></div>
              
              <motion.div 
                variants={itemVariants}
                className="relative z-10 flex flex-col items-center justify-center w-full h-full"
              >
                {/* Lottie Animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-sky-500/30 rounded-full blur-3xl scale-150"></div>
                  <Lottie 
                    animationData={roboAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-[350px] h-[350px] drop-shadow-2xl relative z-10"
                  />
                </motion.div>

                {/* Animated Title */}
                <AnimatePresence mode="wait">
                  {mode === "signup" ? (
                    <motion.div
                      key="signup-title"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center mt-8"
                    >
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Join VoiceOS
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Where AI meets human-like conversations
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signin-title"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center mt-8"
                    >
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome Back
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Continue your AI calling journey
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mode Switch Button */}
                <motion.button
                  onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-sky-500/10 hover:from-blue-500/20 hover:to-sky-500/20 text-blue-600 dark:text-blue-400 font-medium rounded-xl border border-blue-500/20 transition-all duration-300 flex items-center gap-2 group"
                >
                  {mode === "signup" ? (
                    <>
                      <span>Already have an account?</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>New to VoiceOS?</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2 p-12 relative overflow-hidden border-l border-slate-200/50 dark:border-slate-700/50">
              {/* Background Gradient */}
              <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
              
              <motion.div 
                variants={itemVariants}
                className="relative z-10 h-full flex flex-col"
              >
                {/* Mode Indicator */}
                <div className="relative mb-10">
                  <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      initial={false}
                      animate={{
                        x: mode === "signin" ? "0%" : "-100%",
                        width: "100%"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={`text-sm font-medium transition-colors duration-300 ${mode === "signup" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                      Sign Up
                    </span>
                    <span className={`text-sm font-medium transition-colors duration-300 ${mode === "signin" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                      Sign In
                    </span>
                  </div>
                </div>

                {/* Animated Form Container */}
                <div className="relative flex-grow">
                  <AnimatePresence mode="wait">
                    {mode === "signin" ? (
                      <motion.form
                        key="signin-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                      >
                        {/* Header */}
                        <div>
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Welcome Back 👋
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400">
                            Sign in to your VoiceOS account
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <Mail className="w-5 h-5 text-slate-400" />
                            </div>
                            <input 
                              type="email" 
                              placeholder="Enter your email" 
                              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-base"
                              required
                            />
                          </div>

                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <Lock className="w-5 h-5 text-slate-400" />
                            </div>
                            <input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Enter your password" 
                              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-base"
                              required
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-300"></div>
                              <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" />
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                          </label>
                          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
                            Forgot password?
                          </a>
                        </div>

                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Signing in...
                            </>
                          ) : (
                            <>
                              Sign In to Dashboard
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="signup-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                      >
                        {/* Header */}
                        <div>
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Create Account 🚀
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400">
                            Start your free trial today
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <User className="w-5 h-5 text-slate-400" />
                            </div>
                            <input 
                              type="text" 
                              placeholder="Full name" 
                              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-base"
                              required
                            />
                          </div>

                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <Mail className="w-5 h-5 text-slate-400" />
                            </div>
                            <input 
                              type="email" 
                              placeholder="Work email" 
                              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-base"
                              required
                            />
                          </div>

                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <Lock className="w-5 h-5 text-slate-400" />
                            </div>
                            <input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create password" 
                              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-base"
                              required
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <div className="relative mt-1">
                            <input type="checkbox" className="sr-only peer" required />
                            <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-300"></div>
                            <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" />
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            I agree to the{" "}
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
                              Privacy Policy
                            </a>
                          </span>
                        </label>

                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Creating account...
                            </>
                          ) : (
                            <>
                              Start Free Trial
                              <Sparkles className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300/50 dark:border-slate-700/50"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      className="py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      </svg>
                      Google
                    </button>
                    <button 
                      type="button"
                      className="py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <Globe className="w-5 h-5" />
                      SSO
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}