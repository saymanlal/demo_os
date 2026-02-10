export default function DashboardCards({ data }) {
  const stats = data?.stats || {
    total_calls: 0,
    completed_calls: 0,
    total_complaints: 0,
    resolved_complaints: 0,
  };

  const cards = [
    { label: "📞 Total Calls", value: stats.total_calls, color: "#3b82f6", bgColor: "#1e3a8a" },
    { label: "✅ Completed Calls", value: stats.completed_calls, color: "#22c55e", bgColor: "#14532d" },
    { label: "📝 Total Complaints", value: stats.total_complaints, color: "#f59e0b", bgColor: "#78350f" },
    { label: "🏆 Resolved Complaints", value: stats.resolved_complaints, color: "#8b5cf6", bgColor: "#4c1d95" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "32px" }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: card.bgColor,
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #334155",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "8px" }}>{card.label}</div>
          <div style={{ color: card.color, fontSize: "36px", fontWeight: "700" }}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}