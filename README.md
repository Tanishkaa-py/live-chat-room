# 💬 Live Chat Room

A real-time chat application built with **Socket.io**, **Node.js/Express**, and **React**. Messages appear instantly across all connected browsers — no page refresh needed.

> Built as part of a fullstack internship assignment to learn WebSockets and real-time bidirectional communication.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend (Vercel) (https://live-chat-room-psi.vercel.app/)
| Backend (Render) (https://live-chat-room-y46y.onrender.com)


---

## What It Does

Standard HTTP (used by most websites) only works one way — the client asks, the server answers. This means the server can never push a message to you unless you ask first. That's why regular websites can't do live chat.

**WebSockets** solve this by keeping a persistent, two-way connection open between the browser and the server. Once connected, either side can send data to the other at any time — instantly.

This app demonstrates that by building a working chat room where:

- Messages you send appear in every other connected browser within milliseconds
- A typing indicator shows when someone else is typing, and disappears when they stop
- Users are separated into rooms — messages in "General" never appear in "Tech Support"

---

## Features

###  — Real-time Messaging
- Connect to the server via WebSocket using Socket.io
- Type a message and hit Send — it broadcasts to every connected user instantly
- Server logs every connection and disconnection

###  — Identity + Typing Indicator
- Enter your name before joining — all messages display as `[Nakul]: Hello world!`
- When you type in the input box, everyone else sees `Nakul is typing...` at the bottom
- The indicator disappears automatically 1 second after you stop typing (debounce)

###  — Chat Rooms
- Two separate rooms: **General** and **Tech Support**
- Messages sent in one room are only visible to users currently in that room
- Switch rooms at any time from the sidebar — previous messages clear on switch

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | UI and component rendering |
| Real-time | Socket.io Client | WebSocket connection from browser |
| Backend | Node.js + Express | HTTP server |
| Real-time | Socket.io Server | WebSocket event handling and rooms |
| Deployment | Vercel | Frontend hosting |
| Deployment | Render | Backend hosting |

---

## Project Structure

```
live-chat-room/
│
├── server/                     # Node.js backend
│   ├── index.js                # Express server + all Socket.io logic
│   └── package.json
│
├── client/                     # React frontend
│   ├── src/
│   │   ├── App.jsx             # Root component — switches between NameEntry and ChatRoom
│   │   ├── socket.js           # Single shared Socket.io client instance
│   │   ├── index.css           # Global styles and CSS variables
│   │   └── components/
│   │       ├── NameEntry.jsx   # Level 2: username input + room selector
│   │       └── ChatRoom.jsx    # Level 1, 2, 3: full chat UI
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── Prompts.md                  # AI prompts used during development (assignment requirement)
├── .gitignore
└── package.json                # Root: runs both server + client with one command
```

---

## How It Works — Socket.io Key Concepts

The most important thing to understand is how messages are targeted:

```
socket.emit('event', data)          → sends to YOU only
io.emit('event', data)              → sends to ALL connected users
socket.to(room).emit('event', data) → sends to everyone in a room EXCEPT you
io.to(room).emit('event', data)     → sends to EVERYONE in a room including you
```

This app uses `io.to(room).emit` for messages (so the sender also sees their own message appear) and `socket.to(room).emit` for typing indicators (so you don't see your own "is typing..." indicator).

### Typing Indicator — Debounce Pattern

```js
// Emit "typing" on every keystroke
socket.emit('typing', { room, isTyping: true });

// But wait 1 second of silence before emitting "stopped typing"
clearTimeout(timer);
timer = setTimeout(() => {
  socket.emit('typing', { room, isTyping: false });
}, 1000);
```

### Rooms — How Messages Stay Separated

```js
// Server: add socket to a named room
socket.join('General');

// Server: send only to users in that room
io.to('General').emit('receive_message', messageData);
```

Users in "Tech Support" never receive this emit because they are not in the "General" room.

---

## Running Locally

### One-time setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/live-chat-room.git
cd live-chat-room

# Install all dependencies (root + server + client)
npm run install:all
```

### Start the app

```bash
npm run dev
```

This runs both the backend and frontend simultaneously using `concurrently`.

| Service | URL |
|---|---|
| React frontend | http://localhost:5173 |
| Node backend | http://localhost:3001 |

### Test real-time sync locally

1. Open `http://localhost:5173` in a normal browser window
2. Open `http://localhost:5173` in an incognito window (Ctrl+Shift+N)
3. Enter different names in each window, pick the same room
4. Type in one — watch it appear instantly in the other

---

## Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service → connect your GitHub repo
2. Set **Root Directory** to `server`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `node index.js`
5. Copy your Render URL (e.g. `https://live-chat-room-xxxx.onrender.com`)

### Frontend → Vercel

1. Update `client/src/socket.js` — replace the production URL with your Render URL
2. Push the change: `git add . && git commit -m "fix: add render url" && git push`
3. Go to [vercel.com](https://vercel.com) → New Project → import your GitHub repo
4. Set **Root Directory** to `client`
5. Click Deploy

Every future `git push` automatically redeploys both services.



---

