import React, { useState, useEffect } from "react";

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
  const [language, setLanguage] = useState("en"); // لغة افتراضية

  // تحميل اللغة المخزنة في localStorage إذا كانت موجودة
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // تغيير اللغة وتخزينها
  function toggleLanguage() {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  }

  // النصوص بناءً على اللغة المختارة
  const text = {
    en: {
      enterNames: "Enter Player Names",
      player1: "Player 1 (X)",
      player2: "Player 2 (O)",
      startGame: "Start Game",
      nextPlayer: "Next player:",
      winner: "Winner:",
      restart: "Restart Game (Same Players)",
      reset: "Reset with New Players",
      changeLang: "Change Language",
      createdBy: "Created by Basil Abdullah",
    },
    ar: {
      enterNames: "أدخل أسماء اللاعبين",
      player1: "اللاعب 1 (X)",
      player2: "اللاعب 2 (O)",
      startGame: "ابدأ اللعبة",
      nextPlayer: "الدور على:",
      winner: "الفائز:",
      restart: "إعادة اللعب (نفس اللاعبين)",
      reset: "إعادة تعيين بلاعبين جدد",
      changeLang: "تغيير اللغة",
      createdBy: "تم الإنشاء بواسطة باسل عبدالله",
    },
  };

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? "X" : "O";

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function restartGameSamePlayers() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetGameWithNewPlayers() {
    setSquares(Array(9).fill(null));
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
    status = `${text[language].winner} ${winner === "X" ? player1 : player2}`;
  } else {
    status = `${text[language].nextPlayer} ${xIsNext ? player1 : player2}`;
  }

  return (
    <div className="game">
      {!gameStarted ? (
        <div className="start-screen">
          <h2>{text[language].enterNames}</h2>
          <input
            type="text"
            placeholder={text[language].player1}
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
          <input
            type="text"
            placeholder={text[language].player2}
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
          <button onClick={startGame} disabled={!player1 || !player2}>
            {text[language].startGame}
          </button>
        </div>
      ) : (
        <>
          <div className="status">{status}</div>
          <Board squares={squares} onClick={handleClick} />
          <button className="restart-btn" onClick={restartGameSamePlayers}>
            {text[language].restart}
          </button>
          <button className="reset-btn" onClick={resetGameWithNewPlayers}>
            {text[language].reset}
          </button>
        </>
      )}

    {/* زر تغيير اللغة يعرض اللغة التالية */}
<button className="toggle-lang" onClick={toggleLanguage}>
  {language === "en" ? "تغيير اللغة الى العربية " : "Change to English"}
</button>


      <footer className="footer">{text[language].createdBy}</footer>
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
