import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import roboAnimation from "../assets/animations/robolottie.json";
import {
  Mail,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  Key,
  CheckCircle,
  Loader2
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  signupUser,
  sendSignupOTP,
  sendLoginOTP,
  verifyOTP,
  sendForgotOTP,
  verifyForgotOTP,
  resetPassword,
} from "../api/auth";

import { setAuthToken } from "../api";

export default function AuthPages() {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot
  const [step, setStep] = useState("form"); // form | otp | reset
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await signupUser(formData);
      await sendSignupOTP({ phone: formData.phone });
      setStep("otp");
      setSuccess("OTP sent to your phone!");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendLoginOTP({
        phone: formData.phone,
        password: formData.password,
      });
      setStep("otp");
      setSuccess("OTP sent to your phone!");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await verifyOTP({
        phone: formData.phone,
        otp: otp.join(""),
      });

      setAuthToken(res.data.access);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* -------- FORGOT PASSWORD FLOW -------- */

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendForgotOTP({ phone: formData.phone });
      setStep("otp");
      setSuccess("OTP sent to your phone!");
    } catch (err) {
      setError(err.response?.data?.error || "Phone number not found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyForgotOTP = async (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await verifyForgotOTP({
        phone: formData.phone,
        otp: otp.join(""),
      });
      setStep("reset");
      setSuccess("OTP verified! Set your new password.");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await resetPassword({
        phone: formData.phone,
        new_password: formData.password,
      });

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        setMode("signin");
        setStep("form");
        setFormData({ name: "", email: "", phone: "", password: "" });
        setOtp(new Array(6).fill(""));
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    const newMode = mode === "signin" ? "signup" : "signin";
    setMode(newMode);
    setStep("form");
    setError("");
    setSuccess("");
    setFormData({ name: "", email: "", phone: "", password: "" });
    setOtp(new Array(6).fill(""));
  };

  const goBack = () => {
    if (step === "otp" && mode === "forgot") {
      setStep("form");
      setOtp(new Array(6).fill(""));
    } else if (step === "reset") {
      setStep("otp");
      setFormData(prev => ({ ...prev, password: "" }));
    } else if (step === "otp") {
      setStep("form");
      setOtp(new Array(6).fill(""));
    } else if (mode === "forgot") {
      setMode("signin");
      setStep("form");
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      <Navbar />

      {/* FIXED NAVBAR OVERLAP - Added more top padding */}
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4 py-16 pt-28">
        <div className="w-full max-w-5xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl rounded-3xl flex flex-col lg:flex-row overflow-hidden border border-gray-200 dark:border-slate-800">
          {/* LEFT - ANIMATION & INFO */}
          <div className="w-full lg:w-2/5 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-sky-100 dark:from-slate-800 dark:to-slate-900">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 dark:bg-blue-900/20 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-200 dark:bg-purple-900/20 rounded-full translate-x-24 translate-y-24"></div>
            
            <div className={`relative z-10 transition-all duration-700 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}>
              <Lottie 
                animationData={roboAnimation} 
                className="w-64 h-64 md:w-72 md:h-72 hover:scale-105 transition-transform duration-500" 
              />
              
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Secure Authentication
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={mode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {mode === "signup"
                        ? "Join AI VoiceOS"
                        : mode === "forgot"
                        ? "Reset Password"
                        : "Welcome Back"}
                    </motion.span>
                  </AnimatePresence>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
                  {mode === "signup" 
                    ? "Create your account and start automating communications" 
                    : mode === "forgot"
                    ? "Secure password reset with OTP verification"
                    : "Login to access your AI agents dashboard"}
                </p>

                {/* SIMPLIFIED FEATURES - Removed fake ones */}
                <div className="space-y-3 text-left max-w-sm mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Phone & OTP verification
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Secure password protection
                    </span>
                  </div>
                </div>

                {mode !== "forgot" && (
                  <motion.button
                    onClick={switchMode}
                    className="mt-8 px-6 py-3 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={mode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {mode === "signup" 
                          ? "Already have an account?" 
                          : "New here?"}
                      </motion.span>
                    </AnimatePresence>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16">
            <AnimatePresence mode="wait">
              {/* FORM */}
              {step === "form" && (
                <motion.form
                  key={mode} // Changed key to mode for better transitions
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  onSubmit={
                    mode === "signup"
                      ? handleSignup
                      : mode === "forgot"
                      ? handleForgotPassword
                      : handleLogin
                  }
                  className="space-y-6"
                >
                  {/* BACK BUTTON FOR FORGOT PASSWORD */}
                  {mode === "forgot" && (
                    <motion.button
                      type="button"
                      onClick={goBack}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </motion.button>
                  )}

                  <motion.div 
                    className={`transition-all duration-700 delay-100`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
                      <Key className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Secure Login"}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={mode}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {mode === "signup"
                            ? "Create Your Account"
                            : mode === "forgot"
                            ? "Reset Password"
                            : "Welcome Back"}
                        </motion.span>
                      </AnimatePresence>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                      {mode === "signup"
                        ? "Fill in your details to get started"
                        : mode === "forgot"
                        ? "Enter your phone number to receive OTP"
                        : "Enter your credentials to continue"}
                    </p>
                  </motion.div>

                  {/* ANIMATED FORM FIELDS */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, staggerChildren: 0.1 }}
                      className="space-y-5"
                    >
                      {mode === "signup" && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Input
                              icon={User}
                              placeholder="Full name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                            />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Input
                              icon={Mail}
                              type="email"
                              placeholder="Email address"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                            />
                          </motion.div>
                        </>
                      )}

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: mode === "signup" ? 0.3 : 0.1 }}
                      >
                        <Input
                          icon={Phone}
                          placeholder="Phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </motion.div>

                      {mode !== "forgot" && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: mode === "signup" ? 0.4 : 0.2 }}
                        >
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {mode === "signup" && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                              Must be at least 8 characters with numbers & symbols
                            </p>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {mode === "signin" && !isLoading && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setStep("form");
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Forgot Password?
                    </motion.button>
                  )}

                  {error && (
                    <motion.div 
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white font-medium hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Please wait...
                      </>
                    ) : mode === "forgot" ? (
                      "Send Reset OTP"
                    ) : (
                      "Continue to OTP"
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* OTP */}
              {step === "otp" && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  onSubmit={
                    mode === "forgot"
                      ? handleVerifyForgotOTP
                      : handleVerifyOTP
                  }
                  className="space-y-8"
                >
                  {/* BACK BUTTON */}
                  <motion.button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </motion.button>

                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Verify Identity
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
                      Enter OTP
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      We've sent a 6-digit code to <span className="font-semibold">{formData.phone}</span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      OTP expires in 5 minutes
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <motion.input
                          key={index}
                          type="text"
                          maxLength="1"
                          className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none transition-all"
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onFocus={(e) => e.target.select()}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        // Resend OTP logic would go here
                        setSuccess("New OTP sent!");
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  </motion.div>

                  {error && (
                    <motion.div 
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white font-medium hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* RESET PASSWORD */}
              {step === "reset" && (
                <motion.form
                  key="reset"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  onSubmit={handleResetPassword}
                  className="space-y-8"
                >
                  {/* BACK BUTTON */}
                  <motion.button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to OTP
                  </motion.button>

                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4">
                      <Key className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        Set New Password
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
                      Create New Password
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Your new password must be different from previous passwords
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <span className={`text-xs ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${/\d/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <span className={`text-xs ${/\d/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                          Contains a number
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <span className={`text-xs ${/[!@#$%^&*]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                          Contains a special character
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {error && (
                    <motion.div 
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white font-medium hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-800 dark:hover:to-purple-900 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ---------- INPUT COMPONENT ---------- */
function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        className="w-full pl-12 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        required
      />
    </div>
  );
}