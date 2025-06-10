import { WebSocketServer } from "ws";
import {Chess} from "chess.js"
import { v4 as uuidv4 } from 'uuid';



const setupGameSocket=(wss)=>{


let games = {}; // Stocke les parties en cours

wss.on("connection", (ws) => {
  console.log("✅ Nouveau joueur connecté depuis --> serverLocal");
  

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("❌ Erreur de parsing JSON :", err.message);
      return;
    }

    

    // Créer ou rejoindre une partie
    if (data.type === "findOrCreateGame") {
      
      const existingGameId = Object.keys(games).find(
        (gameId) => games[gameId].players.length === 1
      );

      if (existingGameId) {
        ws.color = "b";
        ws.gameId = existingGameId;

        const game = games[existingGameId];
        game.players.push({ ws, color: "b" });

        ws.send(JSON.stringify({ type: "gameJoined", gameId: existingGameId, color: "b" }));

        game.players.forEach((player) =>
          player.ws.send(
            JSON.stringify({
              type: "gameStart",
              gameId: existingGameId,
              playerColor: player.color, // ✅ correction ici
            })
          )
        );
        console.log(`👥 Un deuxième joueur a rejoint la partie ${existingGameId}`);
      } else {
      

        const gameId = uuidv4();
        ws.color = "w";
        ws.gameId = gameId;
        games[gameId] = {
          players: [{ ws, color: "w" }],
          state: new Chess(),
          isGameOver: false,
        };

        ws.send(JSON.stringify({ type: "gameCreated", gameId, color: "w" }));
        console.log(`🎲 Partie créée avec l'ID: ${gameId}`);
      }
    }

    // Mouvement de pièce
    if (data.type === "makeMove") {
      const game = games[data.gameId];
      if (game) {
        try {
          const move = game.state.move(data.move);
          if (move) {
            console.log("✅ Mouvement validé :", move);
            const fen = game.state.fen();

            game.players.forEach((player) =>
              player.ws.send(
                JSON.stringify({
                  type: "move",
                  gameId: data.gameId,
                  move: {
                    piece: move.piece,
                    from: move.from,
                    to: move.to,
                    promotion: move.promotion || null,
                  },
                  fen,
                })
              )
            );
          } else {
            console.error("❌ Mouvement invalide :", data.move);
          }
        } catch (error) {
          console.error("⚠️ Erreur lors du déplacement :", error.message);
        }
      }
    }

    // Abandon
    if (data.type === "abandon") {
      const game = games[data.gameId];
      console.log("📩 Message reçu :", data.type);
      if (game) {
        const quittingPlayer = game.players.find((p) => p.ws === ws);
        if (!quittingPlayer) {
          console.log("🚨 Impossible de trouver le joueur qui abandonne.");
          return;
        }
        game.isGameOver = true;
        game.players.forEach((player) => {
          player.ws.send(
            JSON.stringify({
              type: "gameOver",
              gameId:null,
              winner:
                quittingPlayer.color === "b"
                  ? "Les Blancs gagnent"
                  : "Les Noirs gagnent",
            })
          );
        });
        delete games[data.gameId];
        console.log(
          `🏆 Partie terminée ! Gagnant : ${
            quittingPlayer.color === "w" ? "Noirs" : "Blancs"
          } 🗑️ Partie ${data.gameId} supprimée.`);
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ Un joueur s'est déconnecté.");
    Object.keys(games).forEach((gameId) => {
      games[gameId].players = games[gameId].players.filter((player) => player.ws !== ws);

      if (games[gameId].players.length === 0) {
        delete games[gameId];
        console.log(`🗑️ Partie ${gameId} supprimée.`);
      }
    });
  });
});

}

export default setupGameSocket;
