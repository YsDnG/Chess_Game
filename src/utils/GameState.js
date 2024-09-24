// GameState.js
// Ce module gère l'état du jeu d'échecs, y compris la création d'un nouveau jeu et le traitement des mouvements.
// Utilisé principalement pour gérer la logique métier des règles d'échecs.



import { Chess } from 'chess.js';

export function createNewGame() {
    return new Chess();
}

export function handleMove(game, move) {
    const gameCopy = new Chess(game.fen());
    return gameCopy.move(move);
}
