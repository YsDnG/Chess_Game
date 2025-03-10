import { Chess } from 'chess.js';

export function createNewGame() {
    return new Chess();
}

// Adaptation pour prendre explicitement des arguments `from` et `to`
export function handleMove(game, from, to,gameStatus) {
   
    try
    {
       const gameCopy = new Chess(game.fen());  // Créer une copie du jeu
       
      const move = gameCopy.move({
        from,
        to,
        promotion: 'q'  // Promotion automatique pour simplifier
      });
      // Utilisation de la condition ternaire pour mettre à jour le statut du jeu
      if (gameCopy.turn() === 'b') {
        gameStatus('En cours : Au noir de jouer');
      } else {
        gameStatus('En cours : Au blanc de jouer');
      }

     
    
      if (move) {
        // Détection de l'état de la partie après le mouvement
        let status;
        if (gameCopy.isCheckmate()) {
          if(move.color ==='w')
            gameStatus('Échec et mat : Victoire des blancs');
          else
          gameStatus ("Échec et mat : Vctoire des noirs")
        } else if (gameCopy.isStalemate()) {
          gameStatus('Patte (Égalité');
        } else if (gameCopy.isCheck()) {
          if(move.color ==='w')
            gameStatus ("Roi noir en échec : Déplacement limités, contrer de l'échec");
          else
          gameStatus ("Roi blanc en échec : Déplacement limités, contrer de l'échec");
            
        } 
        
        // Retourner à la fois le mouvement et le statut
        const valueMove = move ? gameCopy: null
        return { game: gameCopy, valueMove, status ,move};
    }
       
    }
    catch(error)
    {
      console.error('Erreur lors du déplacement:', error);
      return null;
    }
  }
  
