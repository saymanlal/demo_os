import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getComplaintStatus } from "../../api/admin";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

export default function ComplaintStatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getComplaintStatus().then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <div style={{
      background: "#1e293b",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #334155"
    }}>
      <h3 style={{ color: "#fff", marginBottom: "20px" }}>Complaint Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}