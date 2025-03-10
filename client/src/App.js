// src/App.js

import ChessboardComponent from './components/ChessboardComponents.js';
import './App.css';
import React, { useState,useEffect } from 'react';
import { Home, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "./components/Card.js";



const App = () => {
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState('');
  const [enteredGameId, setEnteredGameId] = useState(''); // Pour stocker l'ID saisi par l'utilisateur
  const [connectedPlayers, setConnectedPlayers] = useState(0);
  const [playerColor, setPlayerColor] = useState('w'); // Couleur du joueur (blanc/noir)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'gameCreated') {
        console.log('Partie créée avec l\'ID :', data.gameId);
        setGameId(data.gameId); // Stocke l'ID dans l'état
      }
    };
    

    return () => ws.close();
  }, []);

  const createGame = () => {
    socket.send(JSON.stringify({ type: 'createGame' }));
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
    <div className="App">

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
        <Card className="Card">
          <CardContent>
            <BookOpen className="text-[#007AFF] mb-2" size={32} />
            <h2 className="text-xl font-semibold">Apprendre</h2>
            <p className="text-[#D4D4D4] mt-2">Découvrez les bases des échecs et améliorez votre stratégie.</p>
          </CardContent>
        </Card>

        {/* Section S'entraîner */}
        <Card className="Card">
          <CardContent>
            <Home className="text-[#00C853] mb-2" size={32} />
            <h2 className="text-xl font-semibold">S'entraîner</h2>
            <p className="text-[#D4D4D4] mt-2">Pratiquez contre l'ordinateur et améliorez votre niveau.</p>
          </CardContent>
        </Card>

        {/* Section Affronter */}
        <Card className="Card">
          <CardContent>
            <Users className="text-[#FF5252] mb-2" size={32} />
            <h2 className="text-xl font-semibold">Affronter</h2>
            <p className="text-[#D4D4D4] mt-2">Jouez en ligne contre d'autres débutants et mettez vos compétences à l'épreuve.</p>
          </CardContent>
        </Card>
      

      </div>
          


   
      
      <ChessboardComponent
        socket={socket}
        gameId={gameId}
      />
      

    
    </div>
    
      
  );
};


export default App;



