const WebSocket = require('ws');
const {Chess} = require('chess.js')

const wss = new WebSocket.Server({ port: 8080 });
const games = {}; // Stockage des parties (en mémoire)

wss.on('connection', (ws) => {
  console.log('Nouveau joueur connecté');

  // Réception des messages d'un client
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'createGame') {
        const gameId = Math.random().toString(36).substring(7); // ID unique
        games[gameId] = {
          players: [{ ws, color: 'w' }] ,  // Le joueur créateur
          state: new Chess(), // État du jeu
        };
        ws.send(JSON.stringify({ type: 'gameCreated', gameId }));
        console.log(`Partie créée : ${gameId}`);
      }
      

      if (data.type === 'joinGame') {
        const game = games[data.gameId];
        if (game && game.players.length === 1) {
          game.players.push({ ws, color: 'b' });
          game.players.forEach(player =>
            ws.send(JSON.stringify({ type: 'gameStart', gameId: data.gameId }))
          );
          console.log(`Joueur rejoint la partie ${data.gameId}`);
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Partie introuvable ou déjà complète.' }));
          console.log('Rejoindre une partie a échoué pour l\'ID :', data.gameId);
        }
      }
      
      
      if (data.type === 'makeMove') {
        const game = games[data.gameId];
        if (game) {
          try {
            const move = game.state.move(data.move);
      
            if (move) {
              console.log("Mouvement validé :", move);
              const fen = game.state.fen();
      
              // Diffuser le mouvement aux autres joueurs
              game.players.forEach((player) => {
                player.ws.send(JSON.stringify({
                  type: 'move',
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
              console.error('Mouvement invalide :', data.move);
            }
          } catch (error) {
            console.error('Erreur serveur lors de l\'application du mouvement :', error.message);
          }
        }
      }
      

      
      

    

  ws.on('close', () => {
    console.log('Un joueur s\'est déconnecté.');
  });


});
});
