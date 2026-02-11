export default function DashboardCards({ data }) {
  const cardStyle = {
    background: "#1e293b",
    padding: "24px",
    borderRadius: "12px",
    color: "#fff",
    flex: 1,
    marginRight: "20px",
    border: "1px solid #334155"
  };

  const titleStyle = {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "12px",
    fontWeight: "500"
  };

  const valueStyle = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#60a5fa"
  };

  return (
    <div style={{ display: "flex", marginBottom: "30px", gap: "20px" }}>
      <div style={cardStyle}>
        <div style={titleStyle}>Total Calls</div>
        <div style={valueStyle}>{data?.calls?.total || 0}</div>
        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
          ↑ {data?.calls?.inbound || 0} inbound / {data?.calls?.outbound || 0} outbound
        </div>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}>Total Complaints</div>
        <div style={valueStyle}>{data?.complaints?.total || 0}</div>
        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
          ✓ {data?.complaints?.resolved || 0} resolved
        </div>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}>Talk Time</div>
        <div style={valueStyle}>
          {Math.round((data?.calls?.total_talk_time_seconds || 0) / 60)} min
        </div>
        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
          Total duration
        </div>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}>Success Rate</div>
        <div style={valueStyle}>
          {data?.calls?.total > 0 
            ? Math.round((data?.calls?.completed / data?.calls?.total) * 100) 
            : 0}%
        </div>
        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
          Completed calls
        </div>
      </div>
    </div>
  );
}