# ♟️ Chess Game - Entraînement en ligne pour débutants

Bienvenue dans mon projet de jeu d'échecs en ligne pour débutants ! Ce projet vise à offrir une expérience simple, intuitive et immersive pour apprendre, s'entraîner et affronter d'autres joueurs en ligne. Il s'agit d'un projet personnel orienté démonstration technique, que je présente dans mon portfolio et CV.

---

## 🚀 Fonctionnalités principales

- Interface moderne avec palette sombre et accent dynamique
- Mode local (solo) et mode versus (multijoueur en ligne)
- Récapitulatif des coups joués (move list)
- Reconnexion automatique à une partie
- Notifications de victoire, d'échec et d'abandon

---

## 🧱 Stack Technique

### Frontend

- React 18
- TailwindCSS (v4)
- react-chessboard (composant visuel de l'échiquier)
- WebSocket natif pour les communications temps réel
- Déploiement via GitHub Pages

### Backend

- Node.js (serveur WebSocket personnalisé)
- `ws` pour le WebSocket server
- `chess.js` pour la logique de jeu
- Certificats SSL générés via `mkcert` (test local HTTPS)
- Tunnel public créé avec `Ngrok` pour exposition en ligne

---

## 🌐 Mode en ligne (via GitHub Pages + Ngrok)

1. Le front est déployé sur GitHub Pages.
2. Le serveur local (WebSocket HTTPS) est lancé sur la machine via :
   ```bash
   node wss-server.js
   ```
3. Un tunnel HTTPS est ouvert avec :
   ```bash
   ngrok http https://localhost:8080
   ```
4. L'URL `wss://xxxxx.ngrok-free.app` est utilisée dans le front pour se connecter.

> Remarque : l'URL Ngrok change à chaque session (version gratuite), donc le front doit être redéployé ou adapté dynamiquement.

---

## 🛠 Installation en local

### Prérequis

- Node.js 18+
- mkcert (pour créer les certificats SSL locaux)
- Ngrok (compte gratuit suffisant)

### Lancer le serveur

```bash
cd server
node wss-server.js
```

### Lancer le front

```bash
cd client
npm install
npm start
```

---

## 📁 Structure du projet

```
chess_game/
├── client/          # Front React
├── server/          # Serveur WebSocket
│   ├── ssl/         # Certificats SSL
│   └── wss-server.js
└── README.md
```

---

## 📚 Objectif du projet

Ce projet a pour but de :

- Pratiquer les WebSockets sécurisés en Node.js
- Gérer une logique de jeu temps réel
- Mettre en place une interface utilisateur moderne et fonctionnelle
- Créer un projet démonstratif présentable dans un contexte professionnel (CV / portfolio)

---

## 📌 TODO / Améliorations futures

- Gestion dynamique de l'URL Ngrok (via input ou config)
- Sauvegarde des parties (localStorage ou backend)
- Authentification joueur
- Ajout de niveaux d'IA (mode solo)

---

## 👨‍💻 Auteur

> **@ysdng**\
> Dev Web passionné par les interfaces interactives et la communication temps réel.

> Portfolio : en cours...\
> Contact : [ysdngdev@gmail.com](mailto\:ysdngdev@gmail.com)

---

Merci pour votre intérêt ! ✨

N'hésitez pas à cloner, tester, améliorer ou étoiler le repo ⭐

