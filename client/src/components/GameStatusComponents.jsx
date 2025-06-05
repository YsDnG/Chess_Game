import React from 'react';

function GameStatus({ gameStatus, socket, handleReset }) {
  return (
    <div className="game-status">
      <h3>{gameStatus}</h3>
      
      <button 
        onClick={() => handleReset(socket ? true : false)} 
        className="reset-btn"
      >
        {socket ? "Abandonner" : "Reset"}
      </button>
    </div>
  );
}

export default GameStatus;
