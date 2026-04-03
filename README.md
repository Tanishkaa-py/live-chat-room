# 💬 Live Chat Room

Real-time chat app built with **Socket.io**, **Node.js/Express**, and **React**.

## Features
- ✅ Level 1 — Real-time broadcast messaging
- ✅ Level 2 — Username display + typing indicator
- ✅ Level 3 — Multiple rooms (General & Tech Support)

## Local Development

### One-time setup
```bash
npm run install:all
```

### Run both server + client with ONE command
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

> Open two browser windows side-by-side to see real-time sync!

## Project Structure

```
live-chat-room/
├── server/
│   ├── index.js          # Express + Socket.io server
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── socket.js     # Shared socket instance
│   │   └── components/
│   │       ├── NameEntry.jsx   # Level 2: username + room picker
│   │       └── ChatRoom.jsx    # Level 1,2,3: chat UI
│   └── package.json
├── Prompts.md            # AI prompts used (assignment requirement)
└── package.json          # Root: runs both with concurrently
```

## Deploy

**Backend → Railway**
1. Connect GitHub repo on railway.app
2. Set root directory: `server`
3. Start command: `node index.js`

**Frontend → Vercel**
1. Connect GitHub repo on vercel.com
2. Set root directory: `client`
3. Update `client/src/socket.js` URL to your Railway URL
