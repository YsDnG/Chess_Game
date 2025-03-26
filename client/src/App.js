// src/App.js

import ChessboardComponent from './components/ChessboardComponents.js';
import './App.css';
import React, { useState,useEffect } from 'react';
import { Home, BookOpen, Users, Swords, Sword} from "lucide-react";
import { Card, CardContent } from "./components/Card.js";
import { div } from 'framer-motion/client';



const App = () => {
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState('');
  const [enteredGameId, setEnteredGameId] = useState(''); // Pour stocker l'ID saisi par l'utilisateur
  const [connectedPlayers, setConnectedPlayers] = useState(0);
  const [playerColor, setPlayerColor] = useState('w'); // Couleur du joueur (blanc/noir)
  const[multi,setmulti]= useState(false)
  
  useEffect(() => {
    const isLocal= window.location.hostname ==="localhost"
    const protocol = isLocal ? 'ws' :'wss'
    const host = isLocal ?"localhost:8080" :"5432-2a02-8434-dd20-2d01-b15e-2fcb-89fb-5aa1.ngrok-free.app"

    console.log(`${protocol}://${host}`)

    const ws = new WebSocket(`${protocol}://${host}`);
    setSocket(ws);
    
    ws.onopen = () => {
      console.log("✅ Connecté au serveur WebSocket.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
       
      
      if (data.type === "gameCreated" || data.type === "gameJoined") {
        console.log("🎲 Partie active avec ID :", data.gameId);
        setGameId(data.gameId); // Met à jour l'ID de la partie
        localStorage.setItem("gameId", data.gameId); // Sauvegarde pour recharger la page
        setPlayerColor(data.color)
       
      }

      if (data.type === "gameStart") {
        console.log("🚀 La partie commence !");
      }

      if (data.type === "gameOver") {
        console.log("📩 Réception de gameOver :", data);
        // setGameStatus(data.winner); // Afficher le message de victoire/défaite
        // setIsGameOver(true); // Désactiver l'échiquier
      }

    };
  }, []);


  const findOrCreateGame = () => {
    console.log("📤 Recherche ou création d'une partie...");
    socket.send(JSON.stringify({ type: "findOrCreateGame"}));
    setmulti(true)
  };

  const backtohomepage=()=>{

    setmulti(false);

  }
  
  return (
  
    <div className={`App ${multi ? "Multi" : ""}`}>

      <header onClick={backtohomepage}className="App-header">
      { multi && <span className="home-icon"> <Home /></span>}
      <h1> <img alt="logo" src='./ressource/img/logo.png'></img> Chess4Beginners</h1>
     
      </header>
      { 
      !multi &&
      <div className='cards-section'>
     
        {/* Section Apprendre */}
        
        <Card className="Card Learn">
          <CardContent>
            <BookOpen className="icon" size={34} />
            <h2>Apprendre</h2>
            <p>Découvrez les bases des échecs et améliorez votre stratégie.</p>
          </CardContent>
        </Card>
        

        
        <Card className="Card Train">
          <CardContent>
            <Home size={34} />
            <h2 className="text-xl font-semibold">S'entraîner</h2>
            <p className="text-[#D4D4D4] mt-2">Pratiquez contre l'ordinateur et améliorez votre niveau.</p>
          </CardContent>
        </Card>
        
        

        {/* Section Affronter */}
        <Card 
        className="Card Versus"
        onClick={findOrCreateGame}
        >
          <CardContent>
            <Users size={34} />
            <h2 className="text-xl font-semibold">Affronter</h2>
            <p className="text-[#D4D4D4] mt-2">Jouez en ligne contre d'autres débutants et mettez vos compétences à l'épreuve.</p>
          </CardContent>
        </Card>
      </div>
      }
      {
        multi && 
        <div className='What-Abt'>
        
          <Card className='Card Multi_Info'>
            <CardContent>
            <Swords size={34} />
            <h2 className="text-xl font-semibold">Vous venez de lancer un partie contre un jouer</h2>
            <p className="text-[#D4D4D4] mt-2">A vous de jouez maintenant </p>
          </CardContent>
            
          </Card>
          </div>


        
      }
     
      

      <ChessboardComponent 
      key={gameId || "solo"} 
      socket={gameId ? socket : null} 
      gameId={gameId}
      playerColor={playerColor}
       />

    
    </div>
    
      
  );
};


export default App;



