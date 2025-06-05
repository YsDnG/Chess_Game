import React, { useState,useEffect,useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { onPieceClick, onPieceDrop } from '../utils/MoveHandler';
import { createNewGame } from '../utils/GameState';
import { Chess } from 'chess.js';
import MoveRecapComponents from './MoveRecapComponents';
import GameStatus from './GameStatusComponents';

const ChessboardComponent = ({ 
  socket, 
  gameId, 
  playerColor,
  boardSizePx,
  
  displayRecap = true,
  displayStatus = true
}) => {
  
  const [game, setGame] = useState(createNewGame());
  const [squareStyles, setSquareStyles] = useState({});
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState("En cours: Au blanc de jouer");
  const [isGameOver, setIsGameOver] = useState(false);
  const [moves,setMoves]=useState([])

  const [screenUnder950px,setScreenUnder950px]= useState(false);
  const [showRecap,setShowRecap] = useState(false);

 
  // const resetBoardState = () => {
  //   setGame(new Chess());
  //   setMoves([]);
  //   setGameStatus("En cours: Au blanc de jouer");
  //   setIsGameOver(false);
  //   setSelectedSquare(null);
  //   setPossibleMoves([]);
  //   setSquareStyles({});
  //   setShowRecap(false);
  // };


  const currentGameIdRef = useRef(gameId);  // Permet d’accéder au gameId sans redéclencher useEffect
  const gameRef = useRef(game);             // Permet d’accéder à la game actuelle sans stale state

  useEffect(() => {
    currentGameIdRef.current = gameId;
  }, [gameId]);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 🟢 Nouveau jeu reçu du serveur
        if (data.type === 'gameStart') {
          setGame(new Chess());
          setMoves([]);
          setGameStatus("En cours: Au blanc de jouer");
          setIsGameOver(false);
          return;
        }

        // 🔄 Coup reçu
        if (data.type === 'move' && data.gameId === currentGameIdRef.current) {
          const gameCopy = new Chess(gameRef.current.fen());
          const { from, to, promotion } = data.move;
          const move = gameCopy.move({ from, to, promotion });

          if (!move) {
            console.error("❌ Coup invalide :", data.move);
            return;
          }

          setGame(gameCopy);
          setMoves((prev) => [...prev, `${move.piece}.${move.from} -> ${move.piece}.${move.to}`]);
          setGameStatus(
            gameCopy.isCheckmate()
              ? 'Échec et mat'
              : gameCopy.turn() === 'w'
                ? 'En cours: Au blanc de jouer'
                : 'En cours: Au noir de jouer'
          );
        }

        // 🚩 Fin de partie
        if (data.type === "gameOver") {
          console.log("📩 Réception de gameOver :", data);
          setGameStatus(data.winner);
          setIsGameOver(true);
          setGame(new Chess());
          setMoves([]);
        }
      } catch (error) {
        console.error("Erreur WebSocket :", error);
      }
    };

    // 🎯 Attache le listener
    socket.addEventListener("message", handleMessage);

    return () => {
      // 🧹 Nettoyage lors d’un changement de socket (ou unmount du composant)
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]); 


  const handleReset = (isAbandon = false) => {
    if (isAbandon) {
      socket.send(JSON.stringify({ 
        type: "abandon", 
        gameId, 
        playerColor 
      }));
    }
     else {
      setGameStatus("En cours: Au blanc de jouer");
    }
    if (!isAbandon) {
      setGame(new Chess()); // Réinitialiser seulement en cas de reset, pas d'abandon !
    }
    setIsGameOver(isAbandon); // Si abandon => partie terminée
    setMoves([]);
  };
  

  return (
    <>
   
    <div className='game-section'>
      <div className='board_recap-container'>
       <div className={`chessboard-container ${isGameOver ? 'inactive' : ''}`}>

          <Chessboard 
          key={game}
            position = { game.fen()}

              boardWidth={boardSizePx}
              

              customBoardStyle =
              {{ 
                borderRadius: '4px', 
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
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
            
            {<GameStatus 
                gameStatus={gameStatus}
                socket={socket}
                handleReset={handleReset}
              />
            }
  
        </div>
        { screenUnder950px ? (
            <>
              <button
                className="btn-historique-coups"
                onClick={() => setShowRecap((prev) => !prev)}
              >
                {showRecap ? "Fermer" : "🕓 Historique coups"}
              </button>

              {showRecap && <MoveRecapComponents move={moves} />}
            </>
          ) : (
            <MoveRecapComponents move={moves} />
          )}
      </div>
    </div>  
  
    </>
    
  );
};

export default ChessboardComponent;
