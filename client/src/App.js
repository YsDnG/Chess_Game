// src/App.js

import ChessboardComponent from './components/ChessboardComponents.js';
import './App.css';
import React, { useState,useEffect } from 'react';
import { Home, BookOpen, Users } from "lucide-react";
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
    const ws = new WebSocket('ws://localhost:8080');
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
      }

      if (data.type === "gameStart") {
        console.log("🚀 La partie commence !");
      }
    };
  }, []);

  const findOrCreateGame = () => {
    console.log("📤 Recherche ou création d'une partie...");
    socket.send(JSON.stringify({ type: "findOrCreateGame" }));
    setmulti(true)
  };

  const joinGame = () => {
    console.log('Tentative de rejoindre la partie :', enteredGameId);
    if (enteredGameId.trim() !== '') {
    setGameId(enteredGameId.trim())

      socket.send(JSON.stringify({ type: 'joinGame', gameId: enteredGameId }));
    } else {
      alert('Veuillez entrer un ID de partie valide.');
    }
  };
  
  return (
  
    <div className={`App ${multi ? "Multi" : ""}`}>

      <header className="App-header">
      <h1>♟ Chess4Beginners</h1>
        <nav>
          <ul className="onglet">
            <li><button variant="link" className="text-[#007AFF]">Apprendre</button></li>
            <li><button variant="link" className="text-[#007AFF]">S'entraîner</button></li>
            <li><button variant="link" className="text-[#007AFF]">Affronter</button></li>
          </ul>
        </nav>
      </header>
      <div className='What-Abt'>
     
        {/* Section Apprendre */}
        {!multi &&
        <Card className="Card Learn">
          <CardContent>
            <BookOpen className="icon" size={34} />
            <h2>Apprendre</h2>
            <p>Découvrez les bases des échecs et améliorez votre stratégie.</p>
          </CardContent>
        </Card>
        }

        {!multi &&
        <Card className="Card Train">
          <CardContent>
            <Home size={34} />
            <h2 className="text-xl font-semibold">S'entraîner</h2>
            <p className="text-[#D4D4D4] mt-2">Pratiquez contre l'ordinateur et améliorez votre niveau.</p>
          </CardContent>
        </Card>
        }
        

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
       


   
      
      <ChessboardComponent 
      key={gameId || "solo"} 
      socket={gameId ? socket : null} 
      gameId={gameId} />

    
    </div>
    
      
  );
};


export default App;



