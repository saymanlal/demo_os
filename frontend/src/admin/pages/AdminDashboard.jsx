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
  const [activeChart, setActiveChart] = useState("trend");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "60px", textAlign: "center", color: "white" }}>
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "white" }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "grey", marginTop: "6px" }}>
            System analytics overview
          </p>
        </div>

        <DashboardCards data={data} />

        <div style={{ marginTop: "30px", marginBottom: "20px" }}>
          <select
            value={activeChart}
            onChange={(e) => setActiveChart(e.target.value)}
            style={{
              padding: "10px 16px",
              background: "#111827",
              border: "1px solid #374151",
              color: "#e5e7eb",
              borderRadius: "8px",
            }}
          >
            <option value="trend">Call Trend</option>
            <option value="status">Call Status</option>
            <option value="complaints">Complaint Status</option>
          </select>
        </div>

        {activeChart === "trend" && <CallTrendChart />}
        {activeChart === "status" && <CallStatusChart />}
        {activeChart === "complaints" && <ComplaintStatusChart />}

        <div style={{ marginTop: "30px" }}>
          <AvgDurationCard />
        </div>
      </div>
    </AdminLayout>
  );
}
