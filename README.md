# ♟️ Chess Game - Online Training for Beginners

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Chess%20Engine-chess.js-green" alt="chess.js" />
  <img src="https://img.shields.io/badge/Realtime-WebSocket-blue" alt="WebSocket" />
  <!-- <img src="https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?logo=tailwindcss" alt="TailwindCSS" /> -->
  <img src="https://img.shields.io/github/last-commit/ysdng/Chess_Game" alt="Last commit" />
  <img src="https://img.shields.io/github/license/ysdng/Chess_Game" alt="License" />
  <img src="https://img.shields.io/badge/status-in%20progress-yellow" alt="Status" />
</p>

> 🔄 Switch language: [🇫🇷 Version française](README.fr.md)

---

## 🌐 Live Demo

> ⚠️ Multiplayer mode is not functional in this preview — the demo is UI-only.

🎮 [Try the UI Demo on GitHub Pages](https://ysdng.github.io/Chess_Game)

---

## 🚀 Key Features

- Modern interface with dark theme and accent colors
- Solo (local) mode and versus (online multiplayer) mode
- Move recap panel (move list)
- Automatic reconnection to ongoing games
- Game status messages: win, checkmate, resignation

---

## 🧱 Tech Stack

### Frontend
- React 18
- TailwindCSS (v4)
- react-chessboard (visual chessboard component)
- Native WebSocket for real-time communication
- Deployment via GitHub Pages

### Backend
- Node.js (custom WebSocket server)
- `ws` as WebSocket server library
- `chess.js` for game logic
- SSL certificates generated via `mkcert` (for local HTTPS testing)
- Public tunnel established with `Ngrok`

---

## 🌐 Online Mode (via GitHub Pages + Ngrok)

1. Frontend is deployed on GitHub Pages.
2. Local server (HTTPS WebSocket) is launched via:
   ```bash
   node wss-server.js
   ```
3. A secure public tunnel is created with:
   ```bash
   ngrok http https://localhost:8080
   ```
4. The URL `wss://xxxxx.ngrok-free.app` is used in the frontend to connect.

> Note: the Ngrok URL changes every session (free plan), so the frontend must be redeployed or dynamically updated.

---

## 💻 Local Setup

### Prerequisites
- Node.js 18+
- mkcert (to generate local SSL certificates)
- Ngrok (free account is sufficient)

### Start the backend server
```bash
cd server
node wss-server.js
```

### Start the frontend
```bash
cd client
npm install
npm start
```

---

## 📁 Project Structure
```
chess_game/
├── client/          # React frontend
├── server/          # WebSocket backend
│   ├── ssl/         # SSL certificates
│   └── wss-server.js
└── README.md
```

---

## 🎯 Project Goal

This project is intended to:
- Practice building secure WebSocket connections in Node.js
- Implement real-time game logic
- Build a modern, interactive user interface
- Serve as a technical and visual showcase for my CV and portfolio

---

## 📌 TODO / Future Improvements
- Dynamic Ngrok URL configuration (via input or config file)
- Game history persistence (localStorage or backend)
- Player authentication system
- Add AI difficulty levels for solo mode

---

## 👨‍💻 Author

> **@ysdng**  
> Web developer passionate about interactive UIs and real-time communication.

> Portfolio: coming soon...  
> Contact: [ysdngdev@gmail.com](mailto:ysdngdev@gmail.com)

---

Thank you for your interest! ✨

Feel free to fork, test, contribute or star the repo ⭐

