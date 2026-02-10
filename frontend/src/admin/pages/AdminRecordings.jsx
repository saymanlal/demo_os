import { useState, useEffect, useRef } from "react";
import AdminLayout from "../AdminLayout";
import { getAdminRecordings } from "../../api/admin";

export default function AdminRecordings() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRefs = useRef({});

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const response = await getAdminRecordings();
      setRecordings(response.data.recordings || []);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "#22c55e",
      "in-progress": "#3b82f6",
      busy: "#f59e0b",
      failed: "#ef4444",
      "no-answer": "#64748b",
      cancelled: "#64748b",
    };
    return colors[status] || "#64748b";
  };

  const getCallTypeIcon = (type) => {
    return type === "inbound" ? "📥" : "📤";
  };

  const handlePlayPause = (callSid) => {
    const audio = audioRefs.current[callSid];
    if (!audio) return;

    if (currentlyPlaying === callSid) {
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying].pause();
      }
      audio.play();
      setCurrentlyPlaying(callSid);
    }
  };

  const handleDownload = (recordingUrl, callSid) => {
    const mp3Url = recordingUrl + ".mp3";
    const link = document.createElement("a");
    link.href = mp3Url;
    link.download = `recording-${callSid}.mp3`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecordings = recordings.filter((rec) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      rec.phone_number?.toLowerCase().includes(query) ||
      rec.call_sid?.toLowerCase().includes(query) ||
      rec.from_number?.toLowerCase().includes(query) ||
      rec.to_number?.toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "with-recording" && rec.recording_url) ||
      (filterStatus === "no-recording" && !rec.recording_url) ||
      rec.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎙️</div>
          <div style={{ fontSize: "18px" }}>Loading recordings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#fff", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
            🎙️ Call Recordings
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "16px" }}>Listen to all recorded calls with complete details</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "📊 Total Calls", value: recordings.length, color: "#fff" },
            { label: "🎙️ With Recordings", value: recordings.filter(r => r.recording_url).length, color: "#22c55e" },
            { label: "⏱️ Total Duration", value: formatDuration(recordings.reduce((sum, r) => sum + (r.duration || 0), 0)), color: "#60a5fa" },
            { label: "✅ Completed", value: recordings.filter(r => r.status === "completed").length, color: "#22c55e" }
          ].map((stat, idx) => (
            <div key={idx} style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
              <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: "32px", fontWeight: "700" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="🔍 Search by phone, Call SID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: "300px", padding: "14px 20px", background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff", fontSize: "15px", outline: "none" }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: "14px 20px", background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", color: "#fff", fontSize: "15px", outline: "none", cursor: "pointer" }}
          >
            <option value="all">All Calls</option>
            <option value="with-recording">With Recording</option>
            <option value="no-recording">No Recording</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="busy">Busy</option>
            <option value="no-answer">No Answer</option>
          </select>

          <button
            onClick={fetchRecordings}
            style={{ padding: "14px 24px", background: "#3b82f6", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: "16px", color: "#94a3b8", fontSize: "14px" }}>
          Showing {filteredRecordings.length} of {recordings.length} calls
        </div>

        {/* Recordings Table */}
        {filteredRecordings.length === 0 ? (
          <div style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", padding: "60px", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "18px" }}>No recordings found</div>
          </div>
        ) : (
          <div style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0f172a", borderBottom: "1px solid #334155" }}>
                    <th style={headerStyle}>Type</th>
                    <th style={headerStyle}>From → To</th>
                    <th style={headerStyle}>Call SID</th>
                    <th style={headerStyle}>Status</th>
                    <th style={headerStyle}>Duration</th>
                    <th style={headerStyle}>Recording</th>
                    <th style={headerStyle}>Time</th>
                    <th style={headerStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecordings.map((rec, index) => (
                    <tr key={rec.call_sid} style={{ borderBottom: index < filteredRecordings.length - 1 ? "1px solid #334155" : "none" }}>
                      <td style={cellStyle}><div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "24px" }}>{getCallTypeIcon(rec.call_type)}</div></td>
                      <td style={cellStyle}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ color: "#94a3b8", fontSize: "12px" }}>From:</div>
                          <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{rec.from_number || "N/A"}</div>
                          <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>To:</div>
                          <div style={{ color: "#60a5fa", fontWeight: "600", fontSize: "14px" }}>{rec.to_number || "N/A"}</div>
                        </div>
                      </td>
                      <td style={cellStyle}>
                        <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#94a3b8", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={rec.call_sid}>
                          {rec.call_sid}
                        </div>
                      </td>
                      <td style={cellStyle}>
                        <span style={{ background: getStatusColor(rec.status), color: "#fff", padding: "6px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "inline-block" }}>
                          {rec.status}
                        </span>
                      </td>
                      <td style={cellStyle}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ color: "#94a3b8", fontSize: "12px" }}>Call:</div>
                          <div style={{ fontFamily: "monospace", color: "#fff", fontWeight: "600", fontSize: "15px" }}>{formatDuration(rec.duration)}</div>
                          {rec.recording_duration > 0 && (
                            <>
                              <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Rec:</div>
                              <div style={{ fontFamily: "monospace", color: "#a78bfa", fontWeight: "600", fontSize: "15px" }}>{formatDuration(rec.recording_duration)}</div>
                            </>
                          )}
                        </div>
                      </td>
                      <td style={{ ...cellStyle, minWidth: "300px" }}>
                        {rec.recording_url ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <audio
                              ref={(el) => (audioRefs.current[rec.call_sid] = el)}
                              onEnded={() => setCurrentlyPlaying(null)}
                              onPause={() => { if (currentlyPlaying === rec.call_sid) setCurrentlyPlaying(null); }}
                              style={{ width: "100%", maxWidth: "280px", height: "32px" }}
                            >
                              <source src={rec.recording_url + ".mp3"} type="audio/mpeg" />
                            </audio>
                            {rec.recording_sid && (
                              <div style={{ fontSize: "11px", color: "#64748b" }}>
                                <div style={{ fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={rec.recording_sid}>SID: {rec.recording_sid}</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ color: "#64748b", fontSize: "13px", fontStyle: "italic" }}>No recording</div>
                        )}
                      </td>
                      <td style={cellStyle}><div style={{ fontSize: "13px", color: "#94a3b8" }}>{formatDateTime(rec.created_at)}</div></td>
                      <td style={cellStyle}>
                        {rec.recording_url && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handlePlayPause(rec.call_sid)} style={{ padding: "8px 16px", background: currentlyPlaying === rec.call_sid ? "#ef4444" : "#22c55e", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                              {currentlyPlaying === rec.call_sid ? "⏸️ Pause" : "▶️ Play"}
                            </button>
                            <button onClick={() => handleDownload(rec.recording_url, rec.call_sid)} style={{ padding: "8px 16px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                              ⬇️ MP3
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const headerStyle = { padding: "16px 20px", textAlign: "left", color: "#94a3b8", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" };
const cellStyle = { padding: "20px", color: "#fff", fontSize: "14px", verticalAlign: "top" };