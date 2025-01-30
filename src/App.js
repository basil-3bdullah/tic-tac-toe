import React, { useState } from "react";

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onClick }) {
  return (
    <div className="board">
      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div key={row} className="board-row">
            {Array(3)
              .fill(null)
              .map((_, col) => {
                const index = row * 3 + col;
                return (
                  <Square key={index} value={squares[index]} onClick={() => onClick(index)} />
                );
              })}
          </div>
        ))}
    </div>
  );
}

export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? "X" : "O";

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function restartGameSamePlayers() {
    setSquares(Array(9).fill(null)); // تصفير القيم
    setXIsNext(true);
  }

  function resetGameWithNewPlayers() {
    setSquares(Array(9).fill(null)); // تصفير القيم
    setXIsNext(true);
    setGameStarted(false);
    setPlayer1("");
    setPlayer2("");
  }

  function startGame() {
    if (player1 && player2) {
      setGameStarted(true);
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner === "X" ? player1 : player2}`;
  } else {
    status = `Next player: ${xIsNext ? player1 : player2}`;
  }

  return (
    <div className="game">
      {!gameStarted ? (
        <div className="start-screen">
          <h2>Enter Player Names</h2>
          <input type="text" placeholder="Player 1 (X)" value={player1} onChange={(e) => setPlayer1(e.target.value)} />
          <input type="text" placeholder="Player 2 (O)" value={player2} onChange={(e) => setPlayer2(e.target.value)} />
          <button onClick={startGame} disabled={!player1 || !player2}>
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="status">{status}</div>
          <Board squares={squares} onClick={handleClick} />
          <button className="restart-btn" onClick={restartGameSamePlayers}>
            Restart Game (Same Players)
          </button>
          <button className="reset-btn" onClick={resetGameWithNewPlayers}>
            Reset with New Players
          </button>
        </>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
