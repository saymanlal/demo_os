import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getCallTrend } from "../../api/admin";

export default function CallTrendChart() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("line");

  useEffect(() => {
    getCallTrend({ group_by: "day" }).then((res) =>
      setData(res.data || [])
    );
  }, []);

  return (
    <div style={container}>
      <ChartHeader
        title="Call Trend"
        type={type}
        setType={setType}
      />

      <ResponsiveContainer width="100%" height={350}>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="period" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total_calls"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="period" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="total_calls" fill="#6366f1" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

const container = {
  background: "#111827",
  padding: "30px",
  borderRadius: "16px",
  border: "1px solid #1f2937",
};

function ChartHeader({ title, type, setType }) {
  return (
    <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
      <h3>{title}</h3>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          background: "#0f172a",
          border: "1px solid #374151",
          color: "#e5e7eb",
          padding: "6px 12px",
          borderRadius: "6px",
        }}
      >
        <option value="line">Line</option>
        <option value="bar">Bar</option>
      </select>
    </div>
  );
}
