import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { getAdminCalls, exportCallsCSV } from "../../api/admin";

export default function AdminCalls() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    getAdminCalls().then(res => {
      setCalls(res.data);
    });
  }, []);

  const handleExport = () => {
    exportCallsCSV().then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "calls_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ color: "#fff" }}>Call Logs</h2>
        <button 
          onClick={handleExport}
          style={{
            background: "#22c55e",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          📥 Export CSV
        </button>
      </div>

      <div style={{
        background: "#1e293b",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #334155"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              <th style={thStyle}>Call SID</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Duration</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {calls.map(call => (
              <tr key={call.call_sid} style={{ borderBottom: "1px solid #334155" }}>
                <td style={tdStyle}>{call.call_sid}</td>
                <td style={tdStyle}>{call.phone}</td>
                <td style={tdStyle}>
                  <span style={{
                    background: call.type === "inbound" ? "#22c55e" : "#60a5fa",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}>
                    {call.type}
                  </span>
                </td>
                <td style={tdStyle}>{call.duration}s</td>
                <td style={tdStyle}>{call.status}</td>
                <td style={tdStyle}>{new Date(call.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

const thStyle = {
  padding: "16px",
  textAlign: "left",
  color: "#94a3b8",
  fontWeight: "600",
  fontSize: "14px"
};

const tdStyle = {
  padding: "16px",
  color: "#fff",
  fontSize: "14px"
};
