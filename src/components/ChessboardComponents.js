import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { createNewGame } from '../utils/GameState';
import { onPieceClick, onPieceDrop } from '../utils/MoveHandler';

export default function ChessboardComponent() {
    const [game, setGame] = useState(createNewGame());
    const [squareStyles, setSquareStyles] = useState({});

    return (
        <div className="chessboard-container">
            <Chessboard
                position={game.fen()}
                onSquareClick={(square) => onPieceClick(game, square, setSquareStyles)}
                onPieceDrop={(sourceSquare, targetSquare) => onPieceDrop(game, sourceSquare, targetSquare, setGame, setSquareStyles)}
                customSquareStyles={squareStyles}
            />
            <button onClick={() => setGame(createNewGame())}>Reset Game</button>
        </div>
    );
}
