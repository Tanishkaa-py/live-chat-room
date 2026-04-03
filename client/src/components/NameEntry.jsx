import { useState } from "react";

const ROOMS = [
  { id: "General", color: "#22c55e", desc: "General chat for everyone" },
  { id: "Tech Support", color: "#4f7ef8", desc: "Ask your dev questions here" },
];

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
  },
  card: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "36px 32px",
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  title: { fontSize: 22, fontWeight: 600, color: "var(--text)" },
  sub: { fontSize: 14, color: "var(--muted)", marginTop: 4 },
  label: { fontSize: 13, color: "var(--muted)", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: 15,
  },
  roomGrid: { display: "flex", flexDirection: "column", gap: 10 },
  roomBtn: (selected, color) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    background: selected ? `${color}18` : "var(--bg3)",
    border: `1px solid ${selected ? color : "var(--border)"}`,
    borderRadius: 10,
    color: "var(--text)",
    cursor: "pointer",
    transition: "all 0.15s",
    textAlign: "left",
  }),
  dot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
  submitBtn: (disabled) => ({
    width: "100%",
    padding: "12px",
    background: disabled ? "var(--bg3)" : "var(--blue)",
    color: disabled ? "var(--muted)" : "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "opacity 0.15s",
  }),
};

export default function NameEntry({ onEnter }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("General");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onEnter({ name: name.trim(), room });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div>
          <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
          <div style={styles.title}>Join the Chat Room</div>
          <div style={styles.sub}>Real-time messaging with Socket.io</div>
        </div>

        <div>
          <div style={styles.label}>Your name</div>
          <input
            style={styles.input}
            placeholder="e.g. Nakul"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            maxLength={20}
            autoFocus
          />
        </div>

        <div>
          <div style={styles.label}>Pick a room</div>
          <div style={styles.roomGrid}>
            {ROOMS.map((r) => (
              <button
                key={r.id}
                style={styles.roomBtn(room === r.id, r.color)}
                onClick={() => setRoom(r.id)}
              >
                <span style={styles.dot(r.color)} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{r.id}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.desc}</div>
                </div>
                {room === r.id && (
                  <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button style={styles.submitBtn(!name.trim())} onClick={handleSubmit}>
          Enter Chat →
        </button>
      </div>
    </div>
  );
}
