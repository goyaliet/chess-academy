"use client";

import { useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };
import type { Puzzle } from "@/lib/puzzles";
import { sounds } from "@/lib/sounds";

function getHintSquare(fen: string, solutionSan: string): string | null {
  try {
    const g = new Chess(fen);
    const norm = (s: string) => s.replace(/[+#]/g, "");
    const move = g.moves({ verbose: true }).find((m) => norm(m.san) === norm(solutionSan));
    return move?.from ?? null;
  } catch {
    return null;
  }
}

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
  const [showHint, setShowHint] = useState(false);

  const hintSquare = showHint ? getHintSquare(puzzle.fen, puzzle.solution) : null;

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
        setShowHint(false);
        setGame(new Chess(game.fen()));
        setStatus("correct");
        setMessage(puzzle.explanation);
        onSolve(true);
      } else {
        sounds.wrong();
        setGame(new Chess(puzzle.fen));
        setStatus("wrong");
        if (attempts >= 1) {
          setShowHint(true);
          setMessage("Hint: " + puzzle.hint + " — Try again! Answer: " + puzzle.solution);
        } else {
          setMessage("Not quite! Think again. " + puzzle.hint);
        }
        setTimeout(() => setStatus("playing"), 1500);
        if (attempts >= 2) onSolve(false);
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
    setShowHint(false);
  };

  const statusColors = {
    playing: "border-amber-500/30 bg-slate-800",
    correct: "border-green-500 bg-green-950",
    wrong: "border-red-500 bg-red-950",
  };

  const statusIcon = { playing: "💡", correct: "✅", wrong: "❌" };

  const squareStyles: Record<string, React.CSSProperties> = hintSquare
    ? { [hintSquare]: { backgroundColor: "rgba(255, 215, 0, 0.55)", borderRadius: "4px" } }
    : {};

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {puzzle.type.replace("-", " ")}
        </span>
        <span className="text-slate-400 text-sm">White to move</span>
        {hintSquare && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            💡 Hint: highlighted square
          </span>
        )}
      </div>

      <div className="chess-container rounded-lg overflow-hidden" style={{ width: size, height: size }}>
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop: onDrop,
            allowDragging: status === "playing",
            darkSquareStyle: { backgroundColor: "#4a3728" },
            lightSquareStyle: { backgroundColor: "#f0d9b5" },
            animationDurationInMs: 200,
            boardStyle: { width: size, height: size },
            squareStyles,
          }}
        />
      </div>

      <div className={`w-full max-w-md rounded-xl p-4 border transition-all duration-300 ${statusColors[status]}`}>
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">{statusIcon[status]}</span>
          <p className="text-sm leading-relaxed text-slate-200">{message}</p>
        </div>
      </div>

      {status !== "correct" && (
        <div className="flex gap-4">
          <button onClick={reset} className="text-xs text-slate-500 hover:text-amber-400 transition-colors underline">
            Reset puzzle
          </button>
          {!showHint && attempts >= 1 && (
            <button onClick={() => setShowHint(true)} className="text-xs text-yellow-500 hover:text-yellow-300 transition-colors underline">
              Show hint
            </button>
          )}
        </div>
      )}
    </div>
  );
}
