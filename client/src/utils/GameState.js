import { Chess } from 'chess.js';

export function createNewGame() {
    return new Chess();
}

// Adaptation pour prendre explicitement des arguments `from` et `to`
export function handleMove(game, from, to,setGameStatus) {
   
    try
    {
       const gameCopy = new Chess(game.fen());  // Créer une copie du jeu
       
      const move = gameCopy.move({
        from,
        to,
        promotion: 'q'  // Promotion automatique pour simplifier
      });
      
      if (gameCopy.turn() === 'b') {
        setGameStatus('En cours : Au noir de jouer');
      } else {
        setGameStatus('En cours : Au blanc de jouer');
      }

     
    
      if (move) {
        // Détection de l'état de la partie après le mouvement
        let status;
        if (gameCopy.isCheckmate()) {
          if(move.color ==='w')
            setGameStatus('Échec et mat : Victoire des blancs');
          else
          setGameStatus ("Échec et mat : Vctoire des noirs")
        } else if (gameCopy.isStalemate()) {
          setGameStatus('Patte (Égalité');
        } else if (gameCopy.isCheck()) {
          if(move.color ==='w')
            setGameStatus ("Roi noir en échec : Déplacement limités, contrer de l'échec");
          else
          setGameStatus ("Roi blanc en échec : Déplacement limités, contrer de l'échec");
            
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
  
