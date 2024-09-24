// MoveHandler.js
// Ce module gère les interactions utilisateur avec l'échiquier, notamment les clics sur les pièces et les déplacements.
// Il interagit avec GameState.js pour mettre à jour l'état du jeu.


import { getPossibleMoveStyles } from './SquareStyles';
import { Chess } from 'chess.js';


export function onPieceClick(game, square, setSquareStyles) {
    const moves = game.moves({ square, verbose: true });
    setSquareStyles(getPossibleMoveStyles(moves));
}

export function onPieceDrop(game, sourceSquare, targetSquare, setGame, setSquareStyles) {
    const result = game.move({ from: sourceSquare, to: targetSquare });
    if (result) {
        setGame(new Chess(game.fen()));
        setSquareStyles({});
    }
    return result;
}
