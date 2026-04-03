import { io } from "socket.io-client";

// In dev: Vite proxies /socket.io → localhost:3001
// In production: same origin as the deployed server
const URL =
  import.meta.env.MODE === "development" ? "http://localhost:3001" : "https://live-chat-room-y46y.onrender.com"; "/";

export const socket = io(URL, { autoConnect: false });
