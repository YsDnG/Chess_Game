import { Chess } from "chess.js";
import React from "react";
import { useState,useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { handleMove } from "../utils/GameState";
import { getPossibleMoveStyles } from "../utils/SquareStyles";
import { Proportions } from "lucide-react";

const OpeningBoardV2 = ({moveList,delay,autoPlayProps,boardSizePx,indexProps}) => {
  const { autoPlay, setAutoPlay } = autoPlayProps;
  const {index,setIndex} = indexProps;

    const [game,setGame]=useState(new Chess)
  
   
   const [squareStyles,setSquareStyles]=useState({})
   const [possibleMoves,setPossibleMoves]=useState([])
   const [selectedSquare, setSelectedSquare] = useState(null);
    const [moves,setMoves]=useState([])
    const [gameStatus, setGameStatus] = useState("En cours: Au blanc de jouer");
    const [isGameOver, setIsGameOver] = useState(false);
    const [isReady, setIsReady] = useState(false);
    
    
    let autoPlayId = null
  

useEffect(()=>{
    if (!isReady) return; //

    if (!moveList || moveList.length === 0 || index >= moveList.length ) return;


    
    if(autoPlay)
    {
      autoPlayId = startAutoplay();
      
    }
    else
    {
      const gameCopy = new Chess();
      for (let i = 0; i < index; i++) 
      {
      gameCopy.move(moveList[i]);
      }
      setGame(gameCopy);
    }

    return () =>{
      clearTimeout(autoPlayId)
  }
    
   

},[index,moveList,isReady])

useEffect(() => {
    if (!moveList || moveList.length === 0) return;
    setIndex(0);
    setGame(new Chess());  
    setAutoPlay(true);     
    setIsReady(true);
    setSquareStyles({})
    
  }, [moveList]);

  useEffect(()=>{
    
        
        autoPlay ? startAutoplay() : clearInterval(autoPlayId)

  },[autoPlay])


const startAutoplay =() => {
  if (!isReady) return; //
  if (!Array.isArray(moveList) || moveList.length === 0 || index >= moveList.length) return;
  const id = setTimeout(() => {
    const gameCopy = new Chess(game.fen());
    gameCopy.move(moveList[index])
    setGame(gameCopy)
    setIndex(index +1)
},delay)
  return id;
}



  const handleMoveAction = (game, move, setGame, setSquareStyles, setGameStatus, setIsGameOver, setMoves, historicmoves, ) => {

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
  };

 const onPieceClick = (
  game,
  square, 
  setSquareStyles, 
  setSelectedSquare, 
  selectedSquare, 
  possibleMoves, 
  setPossibleMoves, 
  setGame, 
  setGameStatus, 
  setIsGameOver, 
  setMoves, 
  historicmoves) => {

    setAutoPlay(false);
    
    if (possibleMoves.includes(square)) {
      const move = { from: selectedSquare, to: square, promotion: "q" };
  
      if (handleMoveAction(game, move, setGame, setSquareStyles, setGameStatus, setIsGameOver, setMoves, historicmoves)) {
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

  const onPieceDrop = (game, sourceSquare, targetSquare, setGame, setSquareStyles, setGameStatus, setIsGameOver, setMoves, historicmoves) => {
    const move = { from: sourceSquare, to: targetSquare, promotion: "q" };
   
    return handleMoveAction(game, move, setGame, setSquareStyles, setGameStatus, setIsGameOver, setMoves, historicmoves);
  };
  


    return(
    <Chessboard 
    key={boardSizePx}
    position={game.fen()}
    boardWidth={boardSizePx}
    onSquareClick={(square)=> 
      onPieceClick(game, 
        square, 
        setSquareStyles, 
        setSelectedSquare, 
        selectedSquare, 
        possibleMoves, 
        setPossibleMoves, 
        setGame,
        setGameStatus,
        setIsGameOver,
        setMoves,
        moves
      )}
    onPieceDrop={(sourceSquare, targetSquare)=> 
      onPieceDrop(
        game, 
        sourceSquare, 
        targetSquare, 
        setGame, 
        setSquareStyles,
        setGameStatus,
        setIsGameOver,
        setMoves,
        moves
      )}
    customBoardStyle =
    {{ 
      borderRadius: '4px', 
      boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
    }} 

    customSquareStyles={squareStyles}
    />
    
    )


    

}

export default OpeningBoardV2