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
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  signupUser,
  sendSignupOTP,
  sendLoginOTP,
  verifyOTP,
} from "../api/auth";

import { setAuthToken } from "../api";

export default function AuthPages() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [step, setStep] = useState("form"); // form | otp
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  /* ---------------- HANDLERS ---------------- */

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signupUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      await sendSignupOTP({ phone: formData.phone });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendLoginOTP({
        phone: formData.phone,
        password: formData.password,
      });

      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await verifyOTP({
        phone: formData.phone,
        otp,
      });

      setAuthToken(res.data.access);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setStep("form");
    setError("");
    setFormData({ name: "", email: "", phone: "", password: "" });
    setOtp("");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-black">
      <Navbar />

      <div className="flex items-center justify-center pt-28 px-4">
        <div className="w-full max-w-6xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden">

          {/* LEFT */}
          <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center">
            <Lottie animationData={roboAnimation} className="w-72 h-72" />
            <h2 className="text-3xl font-bold mt-6">
              {mode === "signup" ? "Join AiHouseOS" : "Welcome Back"}
            </h2>
            <p className="text-slate-500 mt-2 text-center">
              Secure login with phone, password & OTP
            </p>

            <button
              onClick={switchMode}
              className="mt-6 px-6 py-3 rounded-xl border text-blue-600"
            >
              {mode === "signup" ? "Already have an account?" : "New here?"}
              <ArrowRight className="inline ml-2 w-4 h-4" />
            </button>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2 p-10 border-l">
            <AnimatePresence mode="wait">

              {/* FORM */}
              {step === "form" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  onSubmit={mode === "signup" ? handleSignup : handleLogin}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-bold">
                    {mode === "signup" ? "Create Account" : "Login"}
                  </h2>

                  {mode === "signup" && (
                    <>
                      <Input
                        icon={User}
                        placeholder="Full name"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />

                      <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </>
                  )}

                  <Input
                    icon={Phone}
                    placeholder="Phone number"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />

                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full pl-12 pr-12 py-4 rounded-xl border"
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
                      className="absolute right-4 top-4 text-gray-400"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

                  {error && <p className="text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-blue-600 text-white"
                  >
                    {isLoading ? "Please wait..." : "Send OTP"}
                  </button>
                </motion.form>
              )}

              {/* OTP */}
              {step === "otp" && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Verify OTP</h2>
                  <p className="text-slate-500">
                    OTP sent to <b>{formData.phone}</b>
                  </p>

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full py-4 px-4 rounded-xl border"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />

                  {error && <p className="text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-green-600 text-white"
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </button>
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
      <Icon className="absolute left-4 top-4 text-gray-400" />
      <input
        {...props}
        className="w-full pl-12 py-4 rounded-xl border"
        required
      />
    </div>
  );
}
