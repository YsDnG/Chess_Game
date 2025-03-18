// MoveHandler.js
// Ce module gère les interactions utilisateur avec l'échiquier, notamment les clics sur les pièces et les déplacements.
// Il interagit avec GameState.js pour mettre à jour l'état du jeu.


import { getPossibleMoveStyles } from './SquareStyles';

import { handleMove } from './GameState';


export const onPieceClick = (game,square,setSquareStyles,setSelectedSquare,selectedSquare, possibleMoves,setPossibleMoves,setGame,setGameStatus,setIsGameOver,setMoves,historicmoves,socket,gameId) => {
  console.log(selectedSquare," -> ",square)

    if (possibleMoves.includes(square)) {
      
      const gameCopy = handleMove(game, selectedSquare, square,setGameStatus);  // Déplacer la pièce
      if (gameCopy) {
        const move = {
          from: selectedSquare,
          to: square,
          promotion: 'q' // Optionnel
        }
        setGame(gameCopy.valueMove);  // Mettre à jour l'état du jeu
        setSquareStyles({});  // Réinitialiser les styles après le déplacement
        setSelectedSquare(null);  // Réinitialiser la sélection de la pièce
        setPossibleMoves([]);  // Réinitialiser les mouvements possibles
        // setGameStatus(gameCopy.status)

        if (socket && gameId) {
          socket.send(JSON.stringify({ type: 'makeMove', gameId, move }));
        }
        setMoves([...historicmoves, `  ${gameCopy.move.piece}.${gameCopy.move.from} -> ${gameCopy.move.piece}.${gameCopy.move.san}`]);
        if (gameCopy.status === "Échec et mat") {
          setIsGameOver(true);  // Marquer la fin du jeu
        }
      }
    } else {
      // Si la case cliquée n'est pas valide, réinitialiser la sélection
      setSelectedSquare(null);
      setSquareStyles({});
    }
 
    // Premier clic : Sélectionner la pièce et afficher les mouvements possibles
    const moves = game.moves({
      square: square,
      verbose: true
    });

    // Vérifier s'il y a des mouvements disponibles
    if (moves.length > 0) {
      setSquareStyles(getPossibleMoveStyles(moves));  // Appliquer les styles pour les mouvements valides
      setSelectedSquare(square);  // Stocker la case de la pièce sélectionnée
      setPossibleMoves(moves.map(move => move.to));  // Stocker les cases cibles possibles
    }
 
};
// Gérer le drag-and-drop pour déplacer les pièces
export const onPieceDrop = (game, sourceSquare, targetSquare, setGame, setSquareStyles, setGameStatus,setIsGameOver,setMoves,historicmoves,socket,gameId) => {
  
  const gameCopy = handleMove(game, sourceSquare, targetSquare,setGameStatus);  // Utiliser handleMove
  
  if (gameCopy) {  // Si le mouvement est valide
  
    setGame(gameCopy.valueMove);  // Mettre à jour l'état du jeu avec la copie
    setSquareStyles({});  // Réinitialiser les styles après le déplacement
    setGameStatus(gameCopy.status)
    
  // Définition  du mouvement avant de l'envoyer
  const move = {
    from: sourceSquare,
    to: targetSquare,
    promotion: 'q' // Optionnel pour les pions
  };


    setMoves([...historicmoves, `  ${gameCopy.move.piece}.${gameCopy.move.from} -> ${gameCopy.move.piece}.${gameCopy.move.san}`]);
    if (gameCopy.status === "Échec et mat") {
      setIsGameOver(true);  // Marquer la fin du jeu
    }
    if (socket && gameId) {
      socket.send(JSON.stringify({ type: 'makeMove', gameId, move }));
    }

  } else {
    console.log('Déplacement invalide');
  }

  return gameCopy !== null;  // Retourne true si le déplacement est valide
};





