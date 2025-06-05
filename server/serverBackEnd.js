
import express from 'express';
import http from 'http';               // Pas https ici : Render fournit HTTPS
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

import openingsRouter from './route/opening.js';      // API REST
import setupGameSocket  from './ws/ws-server.js'; // WebSocket

// Charger les variables d’environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes API REST
app.use('/api/openings', openingsRouter); // Exemple : GET /api/openings

// Création du serveur HTTP
const server = http.createServer(app);

// Serveur WebSocket attaché au même serveur HTTP
const wss = new WebSocketServer({ server });

// Initialisation logique WebSocket (game manager)
setupGameSocket(wss);

// Démarrage
server.listen(PORT, () => {
  console.log(`🚀 Serveur HTTP/WS en ligne sur le port ${PORT}`);
});
