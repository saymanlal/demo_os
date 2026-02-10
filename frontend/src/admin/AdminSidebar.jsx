import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    display: "block",
    padding: "14px 20px",
    color: location.pathname === path ? "#60a5fa" : "#94a3b8",
    background: location.pathname === path ? "#1e293b" : "transparent",
    textDecoration: "none",
    borderRadius: "8px",
    marginBottom: "8px",
    fontSize: "15px",
    fontWeight: location.pathname === path ? "600" : "400",
    transition: "all 0.2s",
  });

  return (
    <div
      style={{
        width: "260px",
        background: "#0f172a",
        padding: "24px",
        borderRight: "1px solid #1e293b",
      }}
    >
      <div
        style={{
          color: "#fff",
          fontSize: "20px",
          fontWeight: "700",
          marginBottom: "40px",
          borderBottom: "2px solid #1e293b",
          paddingBottom: "16px",
        }}
      >
        🔐 Admin Portal
      </div>

      <Link to="/admin" style={linkStyle("/admin")}>
        📊 Dashboard
      </Link>

      <Link to="/admin/calls" style={linkStyle("/admin/calls")}>
        📞 Call Logs
      </Link>

      <Link to="/admin/recordings" style={linkStyle("/admin/recordings")}>
        🎙️ Recordings
      </Link>

      <Link to="/admin/complaints" style={linkStyle("/admin/complaints")}>
        📝 Complaints
      </Link>

      <div
        style={{
          marginTop: "40px",
          padding: "16px",
          background: "#1e293b",
          borderRadius: "8px",
        }}
      >
        <div style={{ color: "#94a3b8", fontSize: "12px" }}>System Status</div>
        <div
          style={{
            color: "#22c55e",
            fontSize: "14px",
            fontWeight: "600",
            marginTop: "8px",
          }}
        >
          ● Online
        </div>
      </div>
    </div>
  );
}