import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, Shield, Sparkles, Globe, Zap, Check, ArrowRight, MessageSquare, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "./Footer";

export default function AuthPages() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-6xl z-10">
          {/* Logo Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">VoiceOS</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">AI Calling Platform</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-base text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Enterprise Security</span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Real-time AI Calls</span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>Smart Conversations</span>
              </div>
            </div>
          </motion.div>

          {/* Main Wide Auth Card */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden min-h-[600px] flex"
          >
            
            {/* LEFT SIDE */}
            <div className="w-1/2 p-12 relative overflow-hidden">
              {/* Background Gradient - Changes based on mode */}
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-sky-500/10 rounded-full blur-3xl"></div>
              
              <motion.div 
                variants={itemVariants}
                className="relative z-10 h-full flex flex-col"
              >
                {/* Toggle Option for Left Side */}
                <div className="mb-8">
                  <button
                    onClick={() => switchMode(mode === "signup" ? "signin" : "signup")}
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group"
                  >
                    {mode === "signup" ? (
                      <>
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span>Go to Sign In</span>
                      </>
                    ) : (
                      <>
                        <span>Go to Sign Up</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>

                {/* Content based on active mode */}
                <AnimatePresence mode="wait">
                  {mode === "signup" ? (
                    <motion.div
                      key="left-signup"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4 }}
                      className="flex-grow"
                    >
                      {/* Header */}
                      <div className="mb-10">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                          Create Account
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                          Join thousands of businesses using VoiceOS AI calling
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-6 mb-8">
                        {[
                          { icon: <Volume2 className="w-6 h-6" />, text: "AI Voice Agents that sound human", color: "text-blue-500" },
                          { icon: <MessageSquare className="w-6 h-6" />, text: "Smart conversation management", color: "text-green-500" },
                          { icon: <Zap className="w-6 h-6" />, text: "Real-time call analytics", color: "text-purple-500" },
                          { icon: <Shield className="w-6 h-6" />, text: "Enterprise-grade security", color: "text-amber-500" },
                        ].map((feature, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4"
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color.includes('blue') ? 'from-blue-500/20 to-blue-600/20' : feature.color.includes('green') ? 'from-green-500/20 to-green-600/20' : feature.color.includes('purple') ? 'from-purple-500/20 to-purple-600/20' : 'from-amber-500/20 to-amber-600/20'} flex items-center justify-center`}>
                              <div className={feature.color}>
                                {feature.icon}
                              </div>
                            </div>
                            <span className="text-lg text-slate-700 dark:text-slate-300">{feature.text}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-2xl mb-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Support</div>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="text-center">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Ready to transform your communication?
                        </p>
                        <button
                          onClick={() => switchMode("signup")}
                          className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                        >
                          <span>Get Started Free</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="left-signin"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4 }}
                      className="flex-grow"
                    >
                      {/* Sign In Preview */}
                      <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                          Welcome Back!
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                          Sign in to access your dashboard and analytics
                        </p>
                      </div>

                      {/* Benefits of Signing In */}
                      <div className="space-y-6 mb-8">
                        {[
                          { icon: <Zap className="w-6 h-6" />, text: "Access real-time call analytics", color: "text-blue-500" },
                          { icon: <MessageSquare className="w-6 h-6" />, text: "Manage your AI agents", color: "text-green-500" },
                          { icon: <Shield className="w-6 h-6" />, text: "Secure account access", color: "text-purple-500" },
                          { icon: <Volume2 className="w-6 h-6" />, text: "Configure voice settings", color: "text-amber-500" },
                        ].map((feature, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4"
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color.includes('blue') ? 'from-blue-500/20 to-blue-600/20' : feature.color.includes('green') ? 'from-green-500/20 to-green-600/20' : feature.color.includes('purple') ? 'from-purple-500/20 to-purple-600/20' : 'from-amber-500/20 to-amber-600/20'} flex items-center justify-center`}>
                              <div className={feature.color}>
                                {feature.icon}
                              </div>
                            </div>
                            <span className="text-lg text-slate-700 dark:text-slate-300">{feature.text}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Quick Sign In Button */}
                      <div className="text-center">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Returning user?
                        </p>
                        <button
                          onClick={() => switchMode("signin")}
                          className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                        >
                          <span>Sign In Now</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                {/* Toggle Option for Right Side */}
                <div className="mb-8 flex justify-end">
                  <button
                    onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group"
                  >
                    {mode === "signin" ? (
                      <>
                        <span>Go to Sign Up</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    ) : (
                      <>
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span>Go to Sign In</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Active Mode Indicator */}
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