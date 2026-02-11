import { useEffect, useState } from "react";
import { getAvgDuration } from "../../api/admin";

export default function AvgDurationCard() {
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    getAvgDuration()
      .then((res) => {
        setAvg(res.data.average_call_duration_seconds || 0);
      })
      .catch(() => {
        setAvg(0);
      });
  }, []);

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "16px",
        border: "1px solid #1f2937",
        padding: "28px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#9ca3af",
          marginBottom: "12px",
        }}
      >
        Average Call Duration
      </div>

      <div
        style={{
          fontSize: "38px",
          fontWeight: "700",
          color: "#3b82f6",
        }}
      >
        {Math.round(avg)} sec
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        Based on all completed calls
      </div>
    </div>
  );
}
