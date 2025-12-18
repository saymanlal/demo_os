import api from "../api";

// SIGNUP
export const signupUser = (data) =>
  api.post("/auth/signup/", data);

// SEND OTP (PHONE)
export const sendSignupOTP = (data) =>
  api.post("/auth/send-otp/", data);

// LOGIN OTP
export const sendLoginOTP = (data) =>
  api.post("/auth/login-otp/", data);

// VERIFY OTP
export const verifyOTP = (data) =>
  api.post("/auth/verify-otp/", data);
