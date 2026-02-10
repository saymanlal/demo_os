import api from "../api/api";  // ✅ Correct path to src/api.js

// Dashboard Summary
export const getAdminDashboard = (params) => {
  return api.get("/admin/dashboard/", { params });
};

// Call List
export const getAdminCalls = (params) => {
  return api.get("/admin/calls/", { params });
};

// Complaint List
export const getAdminComplaints = (params) => {
  return api.get("/admin/complaints/", { params });
};

// 🎙️ Recordings List (NEW)
export const getAdminRecordings = (params) => {
  return api.get("/admin/recordings/", { params });
};

// Analytics
export const getCallTrend = (params) => {
  return api.get("/admin/analytics/call-trend/", { params });
};

export const getCallStatus = () => {
  return api.get("/admin/analytics/call-status/");
};

export const getComplaintStatus = () => {
  return api.get("/admin/analytics/complaint-status/");
};

export const getAvgDuration = () => {
  return api.get("/admin/analytics/avg-duration/");
};

// CSV Export
export const exportCallsCSV = () => {
  return api.get("/admin/export/calls/", { responseType: "blob" });
};