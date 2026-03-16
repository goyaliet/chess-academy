"use client";

import { useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };
import type { Puzzle } from "@/lib/puzzles";
import { sounds } from "@/lib/sounds";

interface Props {
  puzzle: Puzzle;
  onSolve: (correct: boolean) => void;
  size?: number;
}

export default function ChessPuzzle({ puzzle, onSolve, size = 400 }: Props) {
  const [game, setGame] = useState(new Chess(puzzle.fen));
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
  const [message, setMessage] = useState(puzzle.hint);
  const [attempts, setAttempts] = useState(0);

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
      if (status !== "playing" || !targetSquare) return false;

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!move) return false;

      const moveSan = move.san;
      const normalizeMove = (m: string) => m.replace(/[+#]/g, "");
      const isCorrect =
        normalizeMove(moveSan) === normalizeMove(puzzle.solution);

      setAttempts((a) => a + 1);

      if (isCorrect) {
        sounds.correct();
        setGame(new Chess(game.fen()));
        setStatus("correct");
        setMessage(puzzle.explanation);
        onSolve(true);
      } else {
        sounds.wrong();
        setGame(new Chess(puzzle.fen));
        setStatus("wrong");
        setMessage(
          attempts >= 1
            ? `Hint: ${puzzle.hint} — Try again! The answer is ${puzzle.solution}`
            : "Not quite! Think again. " + puzzle.hint
        );
        setTimeout(() => {
          setStatus("playing");
        }, 2000);
        if (attempts >= 2) {
          onSolve(false);
        }
      }

      return true;
    },
    [game, puzzle, status, attempts, onSolve]
  );

  const reset = () => {
    setGame(new Chess(puzzle.fen));
    setStatus("playing");
    setMessage(puzzle.hint);
    setAttempts(0);
  };

  const statusColors = {
    playing: "border-amber-500/30 bg-slate-800",
    correct: "border-green-500 bg-green-950",
    wrong: "border-red-500 bg-red-950",
  };

  const statusIcon = {
    playing: "💡",
    correct: "✅",
    wrong: "❌",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {puzzle.type.replace("-", " ")}
        </span>
        <span className="text-slate-400 text-sm">White to move</span>
      </div>

      <div
        className="chess-container rounded-lg overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop: onDrop,
            allowDragging: status === "playing",
            darkSquareStyle: { backgroundColor: "#4a3728" },
            lightSquareStyle: { backgroundColor: "#f0d9b5" },
            animationDurationInMs: 200,
            boardStyle: { width: size, height: size },
          }}
        />
      </div>

      <div
        className={`w-full max-w-md rounded-xl p-4 border transition-all duration-300 ${statusColors[status]}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">{statusIcon[status]}</span>
          <p className="text-sm leading-relaxed text-slate-200">{message}</p>
        </div>
      </div>

      {status !== "correct" && (
        <button
          onClick={reset}
          className="text-xs text-slate-500 hover:text-amber-400 transition-colors underline"
        >
          Reset puzzle
        </button>
      )}
    </div>
  );
}
