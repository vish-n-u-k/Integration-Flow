"use client";

import { useState } from "react";

type Square = "X" | "O" | null;

function calculateWinner(squares: Square[]): Square {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Home() {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [xMoves, setXMoves] = useState<number[]>([]);
  const [oMoves, setOMoves] = useState<number[]>([]);

  const MAX_MARKS = 3;

  const winner = calculateWinner(board);

  // Find the square that will vanish on the current player's next move
  const vanishIndex = !winner
    ? (xIsNext ? (xMoves.length >= MAX_MARKS ? xMoves[0] : null) : (oMoves.length >= MAX_MARKS ? oMoves[0] : null))
    : null;

  function handleClick(i: number) {
    if (board[i] || winner) return;
    const next = board.slice();
    const currentMark: Square = xIsNext ? "X" : "O";
    const currentMoves = xIsNext ? [...xMoves] : [...oMoves];

    // Remove the oldest mark if player already has MAX_MARKS on the board
    if (currentMoves.length >= MAX_MARKS) {
      const oldest = currentMoves.shift()!;
      next[oldest] = null;
    }

    next[i] = currentMark;
    currentMoves.push(i);

    setBoard(next);
    if (xIsNext) {
      setXMoves(currentMoves);
    } else {
      setOMoves(currentMoves);
    }
    setXIsNext(!xIsNext);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setXMoves([]);
    setOMoves([]);
  }

  const status = winner
    ? `Winner: ${winner}`
    : `Next: ${xIsNext ? "X" : "O"}`;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Tic Tac Toe</h1>
      <p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>{status}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: "4px" }}>
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: 100,
              height: 100,
              fontSize: "2rem",
              fontWeight: "bold",
              cursor: val || winner ? "default" : "pointer",
              background: "#fff",
              border: "2px solid #333",
              borderRadius: 4,
              opacity: vanishIndex === i ? 0.35 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {val}
          </button>
        ))}
      </div>
      <button
        onClick={reset}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          borderRadius: 4,
          border: "1px solid #333",
          background: "#f0f0f0",
        }}
      >
        Reset
      </button>
      <hr style={{ margin: "2rem 0" }} />
      <p style={{ color: "#666", fontSize: "0.875rem" }}>
        Webhook endpoint active at <code>/api/webhook</code>
      </p>
    </div>
  );
}
