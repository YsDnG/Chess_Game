const fs = require("fs");
const https = require("https");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const { Chess } = require("chess.js");

const cert = fs.readFileSync("ssl/localhost-cert.pem");
const key = fs.readFileSync("ssl/localhost-key.pem");

// ✅ Serveur HTTPS pour WSS
const server = https.createServer({
  cert,
  key,
}, (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ Serveur WebSocket HTTPS en ligne !");
});

// ✅ WebSocket Server encapsulé dans HTTPS
const wss = new WebSocket.Server({ server });

let games = {}; // Stocke les parties en cours

server.listen(8080, "0.0.0.0", () => {
  console.log("🚀 Serveur HTTPS + WebSocket sécurisé (`wss://`) en écoute sur le port 8080");
});

wss.on("connection", (ws,req) => {
  const ip = req.socket.remoteAddress;
  console.log("✅ Nouveau joueur connecté depuis", ip);


  ws.on("message", (message) => {
    let data;
  
    try {
      const allowedTypes = ["findOrCreateGame", "makeMove", "abandon"];

      data = JSON.parse(message);
  
      if (!allowedTypes.includes(data.type)){
        throw new Error("Message invalide : `type` manquant ou incorrect.");
      }
    } catch (err) {
      console.warn("🚫 Message rejeté :", err.message);
      ws.send(JSON.stringify({ type: "error", message: "Format de message invalide." }));
      ws.close(); // Fermer la connexion pour éviter les abus
      return;
    }


    if (data.type === "findOrCreateGame") {
      // Vérifier s'il existe une partie avec un seul joueur en attente
      const existingGameId = Object.keys(games).find(
        (gameId) => games[gameId].players.length === 1
      );

      if (existingGameId) {
        // Une partie existe, ajouter le deuxième joueur
        const game = games[existingGameId];
        game.players.push({ ws, color: "b" });

        // Envoyer la confirmation au joueur qui rejoint
        ws.send(JSON.stringify({ type: "gameJoined", gameId: existingGameId, color: "b" }));

        // Envoyer la confirmation aux deux joueurs que la partie démarre
        game.players.forEach((player) =>
          player.ws.send(
            JSON.stringify({ type: "gameStart", gameId: existingGameId, player:game.players.color})
          )
        );

        console.log(`👥 Un deuxième joueur a rejoint la partie ${existingGameId}`);

      } else {
        // Aucune partie disponible, création d'une nouvelle partie
        const gameId = uuidv4(); // Générer un ID unique
        games[gameId] = {
          players: [{ ws, color: "w" }], // Le créateur joue les blancs
          state: new Chess(), // État du jeu
          isGameOver: false,
        };

        ws.send(JSON.stringify({ type: "gameCreated", gameId, color: "w" }));
        console.log(`🎲 Partie créée avec l'ID: ${gameId}`);
      }
    }

    // Gestion des mouvements des pièces
    if (data.type === "makeMove") {
      const game = games[data.gameId];

      if (game) {
        try {
          const move = game.state.move(data.move);

          if (move) {
            console.log("✅ Mouvement validé :", move);
            const fen = game.state.fen();
           
            // Diffuser le mouvement aux autres joueurs
            game.players.forEach((player) => {
              player.ws.send(JSON.stringify({
                type: "move",
                gameId: data.gameId,
                move: {
                  piece :move.piece,
                  from: move.from,
                  to: move.to,
                  promotion: move.promotion || null
                },
                fen
              }));
            });
          } else {
            console.error("❌ Mouvement invalide :", data.move);
          }
        } catch (error) {
          console.error("⚠️ Erreur serveur lors de l'application du mouvement :", error.message);
        }
      }
    }

    if (data.type === "abandon") {
      const game = games[data.gameId];
    
      if (game) {
        const quittingPlayer = game.players.find(p => p.ws === ws);
        
        if (!quittingPlayer) {
          console.log("🚨 Erreur : Impossible de trouver le joueur qui abandonne.");
          return;
        }
    
        game.isGameOver = true;
    
        game.players.forEach(player => {
          player.ws.send(JSON.stringify({
            type: "gameOver",
            winner: quittingPlayer.color === "b" ? "Les Blancs gagnent" : "Les Noirs gagnent",
          }));
        });
    
        console.log(`🏆 Partie terminée ! Gagnant : ${quittingPlayer.color === "w" ? "Noirs" : "Blancs"}`);
      }
    }
    




  });

 

  // Gérer la déconnexion des joueurs
  ws.on("close", () => {
    console.log("❌ Un joueur s'est déconnecté.");
    
    // Supprimer le joueur déconnecté de toutes les parties
    Object.keys(games).forEach((gameId) => {
      games[gameId].players = games[gameId].players.filter((player) => player.ws !== ws);

      // Supprimer la partie si elle est vide
      if (games[gameId].players.length === 0) {
        delete games[gameId];
        console.log(`🗑️ Partie ${gameId} supprimée.`);
      }
    });
  });


});