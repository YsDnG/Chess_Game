const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const { Chess } = require("chess.js"); // Assurez-vous que Chess.js est installé avec `npm install chess.js`

const wss = new WebSocket.Server({ port: 8080 });

let games = {}; // Stocke les parties en cours

wss.on("connection", (ws) => {
  console.log("✅ Nouveau joueur connecté");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("📩 Message reçu :", data);

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
            JSON.stringify({ type: "gameStart", gameId: existingGameId })
          )
        );

        console.log(`👥 Un deuxième joueur a rejoint la partie ${existingGameId}`);
      } else {
        // Aucune partie disponible, création d'une nouvelle partie
        const gameId = uuidv4(); // Générer un ID unique
        games[gameId] = {
          players: [{ ws, color: "w" }], // Le créateur joue les blancs
          state: new Chess(), // État du jeu
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
