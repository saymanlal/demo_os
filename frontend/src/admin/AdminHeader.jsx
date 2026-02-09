export default function AdminHeader() {
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  return (
    <div style={{
      padding: "16px 24px",
      background: "#1e293b",
      borderBottom: "1px solid #334155",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
        Enterprise Admin Dashboard
      </h3>
      <button 
        onClick={handleLogout}
        style={{
          background: "#ef4444",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Logout
      </button>
    </div>
  );
}