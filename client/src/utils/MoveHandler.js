// MoveHandler.js
// Ce module gère les interactions utilisateur avec l'échiquier, notamment les clics sur les pièces et les déplacements.
// Il interagit avec GameState.js pour mettre à jour l'état du jeu.


import { getPossibleMoveStyles } from './SquareStyles';

import { handleMove } from './GameState';



const handleMoveAction = (game, move, setGame, setSquareStyles, setGameStatus, setIsGameOver, setMoves, historicmoves, socket, gameId) => {
  const gameCopy = handleMove(game, move.from, move.to, setGameStatus);
  
  if (!gameCopy) {
    console.log("❌ Déplacement invalide");
    return false;
  }

  setGame(gameCopy.valueMove);
  setSquareStyles({});

  setMoves([...historicmoves, `  ${gameCopy.move.piece}.${gameCopy.move.from} -> ${gameCopy.move.piece}.${gameCopy.move.san}`]);

  if (gameCopy.status === "Échec et mat") {
    setIsGameOver(true);
  }

  if (socket && gameId) {
    socket.send(JSON.stringify({ type: "makeMove", gameId, move }));
  }

  return true;
};


export const onPieceClick = (game, square, setSquareStyles, setSelectedSquare, selectedSquare, possibleMoves, setPossibleMoves, setGame, setGameStatus, setIsGameOver, setMoves, historicmoves, socket, gameId, playerColor) => {
  

  if (socket && game.turn() !== playerColor) return;

  if (possibleMoves.includes(square)) {
    const move = { from: selectedSquare, to: square, promotion: "q" };

    if (handleMoveAction(game, move, setGame, setSquareStyles, setGameStatus, setIsGameOver, setMoves, historicmoves, socket, gameId)) {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  } else {
    setSelectedSquare(null);
    setSquareStyles({});
  }

  const moves = game.moves({ square, verbose: true });

  if (moves.length > 0) {
    setSquareStyles(getPossibleMoveStyles(moves));
    setSelectedSquare(square);
    setPossibleMoves(moves.map((move) => move.to));
  }
};



export const onPieceDrop = (game, sourceSquare, targetSquare, setGame, setSquareStyles, setGameStatus, setIsGameOver, setMoves, historicmoves, socket, gameId,playerColor) => {
  const move = { from: sourceSquare, to: targetSquare, promotion: "q" };
  if (socket && game.turn() !== playerColor) return;
  return handleMoveAction(game, move, setGame, setSquareStyles, setGameStatus, setIsGameOver, setMoves, historicmoves, socket, gameId);
};





