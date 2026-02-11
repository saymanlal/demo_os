import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiPhone,
  FiMic,
  FiFileText,
  FiActivity,
} from "react-icons/fi";

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <FiGrid /> },
    { path: "/admin/calls", label: "Call Logs", icon: <FiPhone /> },
    { path: "/admin/recordings", label: "Recordings", icon: <FiMic /> },
    { path: "/admin/complaints", label: "Complaints", icon: <FiFileText /> },
  ];

  return (
    <div
      style={{
        width: "270px",
        background: "linear-gradient(180deg, #0f172a, #0b1220)",
        borderRight: "1px solid #1e293b",
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Section */}
      <div>
        <div
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "36px",
            letterSpacing: "1px",
          }}
        >
          ADMIN CONTROL
        </div>

        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                marginBottom: "10px",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: active ? "600" : "500",
                color: active ? "#60a5fa" : "#94a3b8",
                background: active ? "rgba(96,165,250,0.08)" : "transparent",
                border: active
                  ? "1px solid rgba(96,165,250,0.3)"
                  : "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Bottom Status Card */}
      <div
        style={{
          padding: "18px",
          background: "rgba(30,41,59,0.6)",
          borderRadius: "12px",
          border: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "6px",
          }}
        >
          <FiActivity style={{ color: "#22c55e" }} />
          <span
            style={{
              color: "#22c55e",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            System Online
          </span>
        </div>

        <div
          style={{
            color: "#64748b",
            fontSize: "12px",
          }}
        >
          All services operational
        </div>
      </div>
    </div>
  );
}
