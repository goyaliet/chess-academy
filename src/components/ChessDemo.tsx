"use client";

import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

interface Props {
  fen: string;
  moves?: string[];
  size?: number;
  label?: string;
}

export default function ChessDemo({ fen, moves, size = 300, label }: Props) {
  const [game] = useState(new Chess(fen));
  const [currentFen, setCurrentFen] = useState(fen);
  const [moveIndex, setMoveIndex] = useState(0);

  useEffect(() => {
    setCurrentFen(fen);
    setMoveIndex(0);
  }, [fen]);

  const applyMove = () => {
    if (!moves || moveIndex >= moves.length) return;
    const g = new Chess(currentFen);
    const move = g.move(moves[moveIndex]);
    if (move) {
      setCurrentFen(g.fen());
      setMoveIndex((i) => i + 1);
    }
  };

  const resetDemo = () => {
    setCurrentFen(fen);
    setMoveIndex(0);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
          {label}
        </p>
      )}
      <div
        className="rounded-lg overflow-hidden shadow-lg"
        style={{ width: size, height: size }}
      >
        <Chessboard
          options={{
            position: currentFen,
            allowDragging: false,
            darkSquareStyle: { backgroundColor: "#4a3728" },
            lightSquareStyle: { backgroundColor: "#f0d9b5" },
            animationDurationInMs: 400,
            boardStyle: { width: size, height: size },
          }}
        />
      </div>
      {moves && moves.length > 0 && (
        <div className="flex gap-2">
          {moveIndex < moves.length ? (
            <button
              onClick={applyMove}
              className="px-4 py-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-colors"
            >
              Show move →
            </button>
          ) : (
            <button
              onClick={resetDemo}
              className="px-4 py-1.5 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
