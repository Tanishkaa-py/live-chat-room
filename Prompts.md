# Prompts.md

This file documents the AI prompts used during the development of this project, as required by the assignment.

---

## Prompt 1 — Project Architecture

**Prompt given to AI:**
> "I have a WebSocket assignment to build a Live Chat Room with Socket.io covering 3 levels: basic broadcast, typing indicators with usernames, and chat rooms. Give me the full project structure and explain each file."

**What I learned:**
- How to structure a Node.js + React monorepo
- The difference between `socket.emit`, `io.emit`, and `socket.to(room).emit`
- Why WebSockets are needed instead of regular HTTP for real-time apps

---

## Prompt 2 — Server Setup (Level 1 + 3)

**Prompt given to AI:**
> "Write the Socket.io server code that handles join_room, send_message only to a specific room, and logs connections."

**What I learned:**
- `socket.join(room)` puts a socket into a named room
- `io.to(room).emit(...)` sends to everyone in that room
- `socket.to(room).emit(...)` sends to everyone in that room EXCEPT the sender

---

## Prompt 3 — Typing Indicator (Level 2)

**Prompt given to AI:**
> "How do I implement a typing indicator with Socket.io that clears after the user stops typing for 1 second?"

**What I learned:**
- Use `clearTimeout` + `setTimeout` pattern (debounce) on the client
- Emit `isTyping: true` on keypress, `isTyping: false` after 1s of no keypresses
- Server uses `socket.to(room).emit` so the sender doesn't see their own typing indicator

---

## Prompt 4 — React Integration

**Prompt given to AI:**
> "Show me how to connect socket.io-client to a React app using a single shared socket instance and useEffect for event listeners."

**What I learned:**
- Create socket in a separate `socket.js` file with `autoConnect: false` to control timing
- Always clean up socket listeners in the `useEffect` return function to avoid memory leaks
- Call `socket.connect()` only after the user has entered their name

---

## Prompt 5 — Deployment

**Prompt given to AI:**
> "How do I deploy a Socket.io Node backend and React frontend, using a single repo?"

**What I learned:**
- In production, the Express server can serve the built React `dist/` folder
- Railway handles the backend, Vercel handles the frontend
- Set `NODE_ENV=production` on Railway so Express serves the static files

---

## Key Concepts Learned

| Concept | What it means |
|---|---|
| `socket.emit('event', data)` | Send to THIS socket only |
| `io.emit('event', data)` | Send to ALL connected sockets |
| `socket.to(room).emit(...)` | Send to all in room EXCEPT sender |
| `io.to(room).emit(...)` | Send to ALL in room including sender |
| `socket.join(room)` | Add socket to a named room |
| Debounce | Wait N ms after last event before acting |
