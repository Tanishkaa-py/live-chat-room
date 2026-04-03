import { useState, useEffect, useRef } from "react";
import { socket } from "../socket.js";

const ROOMS = ["General", "Tech Support"];
const ROOM_COLORS = { General: "#22c55e", "Tech Support": "#4f7ef8" };

const AVATAR_COLORS = [
  "#4f7ef8", "#a78bfa", "#f472b6", "#2dd4bf",
  "#fb923c", "#22c55e", "#e879f9", "#38bdf8",
];
function avatarColor(name) {
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}
function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const s = {
  layout: {
    display: "flex",
    height: "100vh",
    background: "var(--bg)",
    overflow: "hidden",
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: "#1e2035",
    borderRight: "1px solid #3d4166",
    display: "flex",
    flexDirection: "column",
  },
  sidebarTop: {
    padding: "18px 16px 12px",
    borderBottom: "1px solid #3d4166",
  },
  appName: { fontSize: 15, fontWeight: 700, color: "#f0f2ff" },
  appSub: { fontSize: 12, color: "#9ba3c9", marginTop: 2 },
  sectionLabel: {
    padding: "14px 16px 6px",
    fontSize: 11,
    fontWeight: 700,
    color: "#c5caf0",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  roomBtn: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 16px",
    background: active ? "#2d3050" : "transparent",
    border: "none",
    color: active ? "#f0f2ff" : "#9ba3c9",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    fontSize: 14,
    fontWeight: active ? 700 : 400,
    transition: "all 0.12s",
  }),
  dot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
  onlineSection: {
    marginTop: "auto",
    borderTop: "1px solid var(--border)",
    padding: "12px 16px",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 0",
    fontSize: 13,
    color: "var(--muted)",
  },
  leaveBtn: {
    display: "block",
    width: "100%",
    marginTop: 10,
    padding: "7px",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--muted)",
    fontSize: 13,
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "14px 20px",
    borderBottom: "1px solid #3d4166",
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#1e2035",
  },
  headerName: { fontWeight: 700, fontSize: 15, color: "#f0f2ff" },
  headerSub: { marginLeft: "auto", fontSize: 12, color: "#9ba3c9" },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    background: "#1a1c2e",
  },
  msgRow: (isOwn) => ({
    display: "flex",
    gap: 10,
    flexDirection: isOwn ? "row-reverse" : "row",
    alignItems: "flex-end",
  }),
  avatar: (color) => ({
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: `${color}30`,
    color: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  }),
  bubble: (isOwn) => ({
    maxWidth: "60%",
    padding: "10px 14px",
    borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    background: isOwn ? "#5b8dee" : "#2d3050",
    color: "#f0f2ff",
    fontSize: 14,
    lineHeight: 1.6,
    border: isOwn ? "none" : "1px solid #3d4166",
  }),
  msgMeta: (isOwn) => ({
    fontSize: 12,
    color: "#c5caf0",
    marginBottom: 5,
    fontWeight: 500,
    textAlign: isOwn ? "right" : "left",
  }),
  systemMsg: {
    textAlign: "center",
    fontSize: 12,
    color: "#c5caf0",
    background: "#2d3050",
    padding: "5px 14px",
    borderRadius: 99,
    alignSelf: "center",
    border: "1px solid #3d4166",
  },
  typingBar: {
    minHeight: 26,
    padding: "0 20px 4px",
    fontSize: 13,
    color: "#c5caf0",
    fontStyle: "italic",
    fontWeight: 500,
  },
  inputRow: {
    padding: "12px 20px",
    borderTop: "1px solid #3d4166",
    display: "flex",
    gap: 10,
    background: "#1e2035",
  },
  input: {
    flex: 1,
    padding: "11px 16px",
    background: "#2d3050",
    border: "1px solid #3d4166",
    borderRadius: 10,
    color: "#f0f2ff",
    fontSize: 14,
  },
  sendBtn: {
    padding: "10px 20px",
    background: "var(--blue)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default function ChatRoom({ user, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineCount, setOnlineCount] = useState(1);
  const [currentRoom, setCurrentRoom] = useState(user.room);
  const typingTimer = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.connect();
    socket.emit("join_room", { name: user.name, room: currentRoom });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, { ...msg, type: "chat" }]);
    });

    socket.on("user_typing", ({ name, isTyping }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (isTyping) next[name] = true;
        else delete next[name];
        return next;
      });
    });

    socket.on("user_joined", ({ name }) => {
      setMessages((prev) => [
        ...prev,
        { type: "system", text: `${name} joined the room`, ts: Date.now() },
      ]);
      setOnlineCount((n) => n + 1);
    });

    socket.on("user_left", ({ name }) => {
      setMessages((prev) => [
        ...prev,
        { type: "system", text: `${name} left the room`, ts: Date.now() },
      ]);
      setOnlineCount((n) => Math.max(1, n - 1));
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_joined");
      socket.off("user_left");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const switchRoom = (room) => {
    setCurrentRoom(room);
    setMessages([]);
    setTypingUsers({});
    socket.emit("join_room", { name: user.name, room });
  };

  const handleInput = (val) => {
    setInput(val);
    socket.emit("typing", { room: currentRoom, isTyping: true });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("typing", { room: currentRoom, isTyping: false });
    }, 1000);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send_message", { text: input.trim(), room: currentRoom });
    setInput("");
    clearTimeout(typingTimer.current);
    socket.emit("typing", { room: currentRoom, isTyping: false });
  };

  const typingNames = Object.keys(typingUsers).filter((n) => n !== user.name);
  const typingText = typingNames.length > 0
    ? `${typingNames.join(", ")} ${typingNames.length === 1 ? "is" : "are"} typing...`
    : "";

  return (
    <div style={s.layout}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarTop}>
          <div style={s.appName}>💬 ChatRoom</div>
          <div style={s.appSub}>Socket.io powered</div>
        </div>

        <div style={s.sectionLabel}>Channels</div>
        {ROOMS.map((r) => (
          <button
            key={r}
            style={s.roomBtn(currentRoom === r)}
            onClick={() => switchRoom(r)}
          >
            <span style={s.dot(ROOM_COLORS[r])} />
            {r}
          </button>
        ))}

        <div style={s.onlineSection}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
            ONLINE — {onlineCount}
          </div>
          <div style={s.userRow}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                flexShrink: 0,
              }}
            />
            {user.name} (you)
          </div>
          <button style={s.leaveBtn} onClick={onLeave}>
            ← Leave room
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        <div style={s.header}>
          <span style={s.dot(ROOM_COLORS[currentRoom])} />
          <span style={s.headerName}>{currentRoom}</span>
          <span style={s.headerSub}>{messages.filter((m) => m.type === "chat").length} messages</span>
        </div>

        <div style={s.messages}>
          {messages.length === 0 && (
            <div style={s.systemMsg}>
              You joined <strong>{currentRoom}</strong>. Say hello! 👋
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.type === "system") {
              return (
                <div key={i} style={s.systemMsg}>
                  {msg.text}
                </div>
              );
            }
            const isOwn = msg.from === user.name;
            const color = avatarColor(msg.from);
            return (
              <div key={i} style={s.msgRow(isOwn)}>
                <div style={s.avatar(color)}>{initials(msg.from)}</div>
                <div>
                  <div style={s.msgMeta(isOwn)}>
                    {msg.from} · {fmtTime(msg.ts)}
                  </div>
                  <div style={s.bubble(isOwn)}>{msg.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div style={s.typingBar}>
         {typingText}
        </div>

        <div style={s.inputRow}>
          <input
            style={s.input}
            placeholder={`Message #${currentRoom.toLowerCase()}...`}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            autoFocus
          />
          <button style={s.sendBtn} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
