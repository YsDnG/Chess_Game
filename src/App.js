// src/App.js
import React from 'react';
import ChessboardComponent from './components/ChessboardComponents.js';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Jeu d'échecs</h1>
        <ChessboardComponent />
      </header>
    </div>
  );
};

export default App;
