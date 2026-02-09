import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { getAdminComplaints } from "../../api/admin";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getAdminComplaints().then(res => {
      setComplaints(res.data);
    });
  }, []);

  return (
    <AdminLayout>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Complaints</h2>

      <div style={{
        background: "#1e293b",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #334155"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Caller</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Verified</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.complaint_id} style={{ borderBottom: "1px solid #334155" }}>
                <td style={tdStyle}>{c.complaint_id}</td>
                <td style={tdStyle}>{c.caller}</td>
                <td style={tdStyle}>
                  <span style={{
                    background: c.status === "RESOLVED" ? "#22c55e" : "#eab308",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={tdStyle}>{c.category}</td>
                <td style={tdStyle}>{c.verified ? "✓" : "✗"}</td>
                <td style={tdStyle}>{new Date(c.created_at).toLocaleString()}</td>
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