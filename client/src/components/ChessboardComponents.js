import React, { useState,useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { onPieceClick, onPieceDrop } from '../utils/MoveHandler';
import { createNewGame } from '../utils/GameState';
import { Chess } from 'chess.js';
import MoveRecapComponents from './MoveRecapComponents';

const ChessboardComponent = ({ socket, gameId, playerColor}) => {
  const [game, setGame] = useState(createNewGame());
  const [squareStyles, setSquareStyles] = useState({});
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState("En cours: Au blanc de jouer");
  const [isGameOver, setIsGameOver] = useState(false);
  const [moves,setMoves]=useState([])


  useEffect(() => {
    if (!socket|| !gameId) return; // Mode solo, aucun WebSocket actif
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
  
        if (data.type === 'move' && data.gameId === gameId) {
          const gameCopy = new Chess(game.fen());
          gameCopy.move(data.move);
          setGame(gameCopy);
          
    
          setMoves((prevMoves) => [
            ...prevMoves,
            `${data.move.piece}.${data.move.from} -> ${data.move.piece}.${data.move.to}`
          ]);
    
          setGameStatus(gameCopy.isCheckmate()
            ? 'Échec et mat'
            : gameCopy.turn() === 'w'
            ? 'En cours: Au blanc de jouer'
            : 'En cours: Au noir de jouer'
          );
        }


      if (data.type === "gameOver") {
        console.log("📩 Réception de gameOver :", data);
        setGameStatus(data.winner); // Afficher le message de victoire/défaite
        setIsGameOver(true); // Désactiver l'échiquier
      }
        
      }  catch (error) {

            return null;
        
      }
     
    };
  }, [socket, game, gameId]);
  

  

  const handleReset = (isAbandon = false) => {
    if (isAbandon) {
      const result = playerColor === "w" ? "Victoire des Noirs !" : "Victoire des Blancs !";
      setGameStatus(result);
      socket.send(JSON.stringify({ 
        type: "abandon", 
        gameId, 
        playerColor 
      }));
    } else {
      setGameStatus("En cours: Au blanc de jouer");
    }
    if (!isAbandon) {
      setGame(new Chess()); // Réinitialiser seulement en cas de reset, pas d'abandon !
    }
    setIsGameOver(isAbandon); // Si abandon => partie terminée
    setMoves([]);
  };
  



  return (
    <div className='display'>
      <div className='board_status_btn'>
    <div className={`chessboard-container ${isGameOver ? 'inactive' : ''}`}>
    
     <Chessboard 
      position = { game.fen()}

        boardWidth={500}

        customBoardStyle =
        {{ 
          borderRadius: '4px', 
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        }}
        boardWrapperStyle={{
          width: 'auto',   // Empêche l'étirement à 100%
          maxWidth: '500px',  // Force une largeur max
          margin: '0 auto'   // Centre le board
        }}
        onSquareClick={(square) => 
          !isGameOver && onPieceClick(game, square, setSquareStyles, setSelectedSquare, selectedSquare, possibleMoves, setPossibleMoves, setGame,setGameStatus,setIsGameOver,setMoves,moves,socket,gameId,playerColor)
        }
        onPieceDrop={(sourceSquare, targetSquare) => 
          !isGameOver && onPieceDrop(game, sourceSquare, targetSquare, setGame, setSquareStyles,setGameStatus,setIsGameOver,setMoves,moves,socket,gameId,playerColor)  // Appel pour le drag-and-drop
        }
        customSquareStyles={squareStyles}
        className={isGameOver ? 'chessboard-disabled' : 'chess_board'} 
      />
      
    <div className="game-status">
        <h3> {gameStatus} </h3>
    </div>
   { 
      <button onClick={() => handleReset(!socket ? false : true)} className="reset-btn">
      {!socket ? "Reset" : "Abandonner"}
      </button>

    }
    </div>
     <MoveRecapComponents move={moves} />
     </div>

    </div>  
  
   
    
  );
};

export default ChessboardComponent;
