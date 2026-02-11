import { useState, useEffect, useRef } from "react";
import AdminLayout from "../AdminLayout";
import { getAdminRecordings } from "../../api/admin";
import {
  FiRefreshCw,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiSearch,
  FiPlay,
  FiPause,
  FiDownload,
} from "react-icons/fi";

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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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

  const handlePlayPause = (rec) => {
    if (!rec.recording_url) return;

    if (!audioRefs.current[rec.call_sid]) {
      const audio = new Audio(rec.recording_url + ".mp3");
      audioRefs.current[rec.call_sid] = audio;

      audio.onended = () => setCurrentlyPlaying(null);
    }

    const audio = audioRefs.current[rec.call_sid];

    if (currentlyPlaying === rec.call_sid) {
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying].pause();
      }

      audio.play();
      setCurrentlyPlaying(rec.call_sid);
    }
  };

  const handleDownload = async (rec) => {
    if (!rec.recording_url) return;

    try {
      const response = await fetch(rec.recording_url + ".mp3");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `recording-${rec.call_sid}.mp3`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const filteredRecordings = recordings.filter((rec) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      rec.phone_number?.toLowerCase().includes(query) ||
      rec.call_sid?.toLowerCase().includes(query) ||
      rec.from_number?.toLowerCase().includes(query) ||
      rec.to_number?.toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === "all" || rec.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "80px", color: "#94a3b8" }}>
          Loading calls...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff" }}>
            Call Records
          </h1>
        </div>

        <div style={{ marginBottom: "20px", display: "flex", gap: "16px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "10px",
            padding: "10px 14px",
            minWidth: "300px",
          }}>
            <FiSearch style={{ color: "#64748b" }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                width: "100%",
              }}
            />
          </div>

          <button
            onClick={fetchRecordings}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "#3b82f6",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div style={{
          background: "#1e293b",
          borderRadius: "14px",
          border: "1px solid #334155",
          overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#0f172a" }}>
              <tr>
                <th style={headerStyle}>Type</th>
                <th style={headerStyle}>From → To</th>
                <th style={headerStyle}>Call SID</th>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Duration</th>
                <th style={headerStyle}>Time</th>
                <th style={headerStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecordings.map((rec, index) => (
                <tr
                  key={rec.call_sid}
                  style={{
                    borderBottom:
                      index < filteredRecordings.length - 1
                        ? "1px solid #334155"
                        : "none",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#162033")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={cellStyle}>
                    {rec.call_type === "inbound" ? (
                      <FiPhoneIncoming size={20} />
                    ) : (
                      <FiPhoneOutgoing size={20} />
                    )}
                  </td>

                  <td style={cellStyle}>
                    <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                      {rec.from_number}
                    </div>
                    <div style={{ fontSize: "14px", color: "#fff" }}>
                      {rec.to_number}
                    </div>
                  </td>

                  <td style={{ ...cellStyle, fontFamily: "monospace" }}>
                    {rec.call_sid}
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        background: getStatusColor(rec.status),
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {rec.status}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    {formatDuration(rec.duration)}
                  </td>

                  <td style={cellStyle}>
                    {formatDateTime(rec.created_at)}
                  </td>

                  <td style={cellStyle}>
                    {rec.recording_url ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handlePlayPause(rec)}
                          style={{
                            background:
                              currentlyPlaying === rec.call_sid
                                ? "#ef4444"
                                : "#22c55e",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          {currentlyPlaying === rec.call_sid ? (
                            <FiPause size={14} />
                          ) : (
                            <FiPlay size={14} />
                          )}
                        </button>

                        <button
                          onClick={() => handleDownload(rec)}
                          style={{
                            background: "#3b82f6",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <FiDownload size={14} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#64748b", fontSize: "13px" }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

const headerStyle = {
  padding: "16px 20px",
  textAlign: "left",
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
};

const cellStyle = {
  padding: "18px 20px",
  fontSize: "14px",
  color: "#fff",
};
