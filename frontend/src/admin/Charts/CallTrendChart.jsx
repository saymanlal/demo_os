import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getCallTrend } from "../../api/admin";

export default function CallTrendChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCallTrend({ group_by: "day" }).then(res => {
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
      <h3 style={{ color: "#fff", marginBottom: "20px" }}>Call Trend (Daily)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="period" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line type="monotone" dataKey="total_calls" stroke="#60a5fa" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
