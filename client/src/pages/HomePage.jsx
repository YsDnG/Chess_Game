// src/App.js
import '../App.css';

import ChessboardComponent from '../components/ChessboardComponents';
import React, { useState, useEffect, useContext } from 'react';
import { Home, BookOpen, Users, Swords, Sword } from "lucide-react";
import { Card, CardContent } from "../components/Card.jsx";
import { Link } from 'react-router-dom';
import { WebSocketContext } from '../context/WebSocketContext';
import CardsSection from '../components/CardsSections';
import Header from '../components/Header';

const App = () => {
  const { socket, gameId, playerColor, findOrCreateGame, errorPopup, setErrorPopup,quitGame } = useContext(WebSocketContext);

  const [mediawidth, setMediawidth] = useState(window.innerWidth);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [boardSizePx,setboardSizePx]=useState(300)
  

  const calculateWidth =(width) =>{
    const percent = Math.floor(width*0.3333)
    const clamped = Math.max(350,Math.min(percent,500));
    return clamped;
  }

       /* Maj de la size du board responsiv 50% du screen  */
       useEffect(()=>{
        
        const updateWidth =()=>{
          const widthScreen = window.innerWidth
          setboardSizePx(calculateWidth(widthScreen));
          /**************/
        };
    
        updateWidth(); // initial init
    
        window.addEventListener("resize", updateWidth);
    
        return () => window.removeEventListener("resize", updateWidth);
  },[]);

  return (
    <>
      {errorPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{errorPopup}</p>
            <button onClick={() => setErrorPopup(null)}>Fermer</button>
          </div>
        </div>
      )}

      <div className="App">
        <Header />

        <div className={mediawidth < 950 ? "small-media-display" : "desktop-display"}>
          <CardsSection findOrCreateGame={findOrCreateGame} 
          quitData={{quitGame,gameId,playerColor}}
          />

          <ChessboardComponent 
            key={gameId || "solo"}
            socket={gameId ? socket : null}
            gameId={gameId}
            playerColor={playerColor}
            boardSizePx={boardSizePx} // ATTENTION sizePercent doit être utilisé dans ton ChessboardComponent
            
          />
        </div>
      </div>
    </>
  );
};

export default App;
