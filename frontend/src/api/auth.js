import api from "../api";

// helper: no auth header
const noAuth = {
  headers: {
    Authorization: undefined,
  },
};

/* ===============================
   🔐 AUTH APIs
================================= */

// 📝 SIGNUP
export const signupUser = (data) =>
  api.post("/auth/signup/", data, noAuth);

// 📱 SEND SIGNUP OTP
export const sendSignupOTP = (data) =>
  api.post("/auth/send-otp/", data, noAuth);

// 🔑 SEND LOGIN OTP
export const sendLoginOTP = (data) =>
  api.post("/auth/login-otp/", data, noAuth);

// ✅ VERIFY LOGIN / SIGNUP OTP
export const verifyOTP = (data) =>
  api.post("/auth/verify-otp/", data, noAuth);

// 🔁 FORGOT PASSWORD FLOW
export const sendForgotOTP = (data) =>
  api.post("/auth/forgot-password/", data, noAuth);

export const verifyForgotOTP = (data) =>
  api.post("/auth/verify-forgot-otp/", data, noAuth);

export const resetPassword = (data) =>
  api.post("/auth/reset-password/", data, noAuth);

/* ===============================
   👤 CURRENT USER (ROLE FETCH)
================================= */

export const getMe = () => api.get("/auth/me/");
