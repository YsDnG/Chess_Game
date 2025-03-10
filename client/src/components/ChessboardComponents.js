import React, { useState,useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { onPieceClick, onPieceDrop } from '../utils/MoveHandler';
import { createNewGame } from '../utils/GameState';
import { Chess } from 'chess.js';
import MoveRecapComponents from './MoveRecapComponents';

const ChessboardComponent = ({ socket, gameId, playerColor }) => {
  const [game, setGame] = useState(createNewGame());
  const [squareStyles, setSquareStyles] = useState({});
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState("En cours: Au blanc de jouer");
  const [isGameOver, setIsGameOver] = useState(false);
  const [moves,setMoves]=useState([])


  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
  
        if (data.type === 'move' && data.gameId === gameId) {
          const gameCopy = new Chess(game.fen());
          gameCopy.move(data.move);
          setGame(gameCopy);
    
          setMoves((prevMoves) => [
            ...prevMoves,
            `${data.move.piece}.${data.move.from} -> ${data.move.piece}.${data.move.san}`
          ]);
    
          setGameStatus(gameCopy.isCheckmate()
            ? 'Échec et mat'
            : gameCopy.turn() === 'w'
            ? 'En cours: Au blanc de jouer'
            : 'En cours: Au noir de jouer'
          );
        }
        
      }  catch (error) {

        console.error('Erreur de je sais pas quoi:', error);
            return null;
        
      }
     
    };
  }, [socket, game, gameId]);
  

  

  const handleReset = () => {
    setGame(new Chess());
    setGameStatus("En cours: Au blanc de jouer");
    setIsGameOver(false);  // Réinitialiser la fin de partie
    setMoves([]);
  };



  return (
    <div className='display'>
    <div className={`chessboard-container ${isGameOver ? 'inactive' : ''}`}>
     <Chessboard
      position = { game.fen()}
        boardWidth={500}
        customBoardStyle={{ borderRadius: '4px', boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`}}
        onSquareClick={(square) => 
          !isGameOver && onPieceClick(game, square, setSquareStyles, setSelectedSquare, selectedSquare, possibleMoves, setPossibleMoves, setGame,setGameStatus,setIsGameOver,setMoves,moves,socket,gameId)
        }
        onPieceDrop={(sourceSquare, targetSquare) => 
          !isGameOver && onPieceDrop(game, sourceSquare, targetSquare, setGame, setSquareStyles,setGameStatus,setIsGameOver,setMoves,moves)  // Appel pour le drag-and-drop
        }
        customSquareStyles={squareStyles}
        className={isGameOver ? 'chessboard-disabled' : ''} 
      />
      
    <div className="game-status">
        <h3> {gameStatus} </h3>
    </div>
    <button onClick={handleReset}
              className={'reset-btn'}>
        Reset
      </button>
    </div>  
    <MoveRecapComponents move={moves} />
    </div>
    
  );
};

export default ChessboardComponent;
