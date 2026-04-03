const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

// ─── Level 1: Basic connection ───────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  // ─── Level 2 + 3: Join a named room ──────────────────────────────────────
  socket.on("join_room", ({ name, room }) => {
    // Leave any previous room (except the default socket room)
    const prevRoom = socket.data.room;
    if (prevRoom) {
      socket.leave(prevRoom);
      socket.to(prevRoom).emit("user_left", { name: socket.data.name });
    }

    socket.data.name = name;
    socket.data.room = room;
    socket.join(room);

    console.log(`👤 ${name} joined room: ${room}`);

    // Tell everyone else in the room someone joined
    socket.to(room).emit("user_joined", { name });
  });

  // ─── Level 1 + 3: Send message only to current room ──────────────────────
  socket.on("send_message", ({ text, room }) => {
    const message = {
      from: socket.data.name,
      text,
      room,
      ts: Date.now(),
    };
    // Broadcast to ALL users in the room (including sender)
    io.to(room).emit("receive_message", message);
    console.log(`💬 [${room}] ${socket.data.name}: ${text}`);
  });

  // ─── Level 2: Typing indicator ───────────────────────────────────────────
  socket.on("typing", ({ room, isTyping }) => {
    // Send to everyone in room EXCEPT the sender
    socket.to(room).emit("user_typing", {
      name: socket.data.name,
      isTyping,
    });
  });

  // ─── Disconnect ───────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    const { name, room } = socket.data;
    if (name && room) {
      socket.to(room).emit("user_left", { name });
    }
    console.log(`❌ ${name || "Unknown"} disconnected`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
