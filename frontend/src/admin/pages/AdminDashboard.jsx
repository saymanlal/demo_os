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

  useEffect(() => {
    getAdminDashboard().then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <AdminLayout>
      <DashboardCards data={data} />
      
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <CallTrendChart />
        <AvgDurationCard />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <CallStatusChart />
        <ComplaintStatusChart />
      </div>
    </AdminLayout>
  );
}

