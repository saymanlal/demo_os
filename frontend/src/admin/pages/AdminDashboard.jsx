import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import DashboardCards from "../DashboardCards";
import CallTrendChart from "../Charts/CallTrendChart";
import CallStatusChart from "../Charts/CallStatusChart";
import ComplaintStatusChart from "../Charts/ComplaintStatusChart";
import AvgDurationCard from "../Charts/AvgDurationCard";
import { getAdminDashboard } from "../../api/admin";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getAdminDashboard();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <div style={{ fontSize: "18px" }}>Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#fff", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
          📊 Admin Dashboard
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "32px" }}>
          Welcome back! Here's your system overview and analytics.
        </p>
        
        {/* Dashboard Cards */}
        <DashboardCards data={data} />
        
        {/* Charts Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", padding: "24px" }}>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>📈 Call Trend (Last 7 Days)</h2>
            <CallTrendChart />
          </div>
          
          <div style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", padding: "24px" }}>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>⏱️ Average Call Duration</h2>
            <AvgDurationCard />
          </div>
        </div>

        {/* Status Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", padding: "24px" }}>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>📊 Call Status Distribution</h2>
            <CallStatusChart />
          </div>
          
          <div style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", padding: "24px" }}>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>📝 Complaint Status</h2>
            <ComplaintStatusChart />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}