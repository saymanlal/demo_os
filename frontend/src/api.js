import axios from "axios";

/**
 * Single axios instance for entire app
 * Production-ready: token persist + auto attach
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://web-prodution-62a2b1.up.railway.app/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Set / remove auth token globally
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common.Authorization;
  }
};

/**
 * Restore token on page refresh
 */
const existingToken = localStorage.getItem("access_token");
if (existingToken) {
  api.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
}

export default api;
