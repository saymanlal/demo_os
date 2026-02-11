import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getCallStatus } from "../../api/admin";

const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#6366f1"];

export default function CallStatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCallStatus()
      .then((res) => setData(res.data || []))
      .catch(() => setData([]));
  }, []);

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "16px",
        border: "1px solid #1f2937",
        padding: "28px",
      }}
    >
      <h3
        style={{
          color: "#f3f4f6",
          marginBottom: "20px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Call Status Distribution
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            outerRadius={110}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1f2937",
              borderRadius: "8px",
            }}
          />

          <Legend wrapperStyle={{ color: "#9ca3af" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
