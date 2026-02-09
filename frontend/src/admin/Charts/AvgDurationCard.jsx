import { useEffect, useState } from "react";
import { getAvgDuration } from "../../api/admin";

export default function AvgDurationCard() {
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    getAvgDuration().then(res => {
      setAvg(res.data.average_call_duration_seconds);
    });
  }, []);

  return (
    <div style={{
      background: "#1e293b",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #334155",
      color: "#fff"
    }}>
      <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "12px" }}>
        Average Call Duration
      </div>
      <div style={{ fontSize: "32px", fontWeight: "700", color: "#60a5fa" }}>
        {Math.round(avg)} sec
      </div>
    </div>
  );
}