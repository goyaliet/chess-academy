"use client";

import { useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };
type PieceHandlerArgs = { isSparePiece: boolean; piece: { pieceType: string }; square: string | null };
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

function getSideToMove(fen: string): "w" | "b" {
  return fen.split(" ")[1] === "b" ? "b" : "w";
}

const typeHints: Record<string, string> = {
  "fork": "Look for a piece that attacks TWO enemy pieces at once.",
  "pin": "Find the piece that can't move because it's shielding something more valuable.",
  "skewer": "Attack the king first — the piece behind it will be exposed.",
  "back-rank": "The king is trapped by its own pawns — use your rook or queen on the back rank.",
  "mate-in-1": "One move ends the game — find the check that leaves no escape.",
  "tactic": "Look for the strongest forcing move: check, capture, or unstoppable threat.",
  "opening": "Follow opening principles: control the center, develop pieces, keep your king safe.",
  "endgame": "Activate your king and think about pawn promotion and key squares.",
};

export default function ChessPuzzle({ puzzle, onSolve, size = 400 }: Props) {
  const sideToMove = getSideToMove(puzzle.fen);
  const [game, setGame] = useState(new Chess(puzzle.fen));
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
  const [message, setMessage] = useState(puzzle.hint);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Click-to-move state
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  const hintSquare = showHint ? getHintSquare(puzzle.fen, puzzle.solution) : null;

  // Build square styles: hint highlight + selected + legal move dots/rings
  const buildSquareStyles = useCallback((): Record<string, React.CSSProperties> => {
    const styles: Record<string, React.CSSProperties> = {};

    // Hint highlight
    if (hintSquare) {
      styles[hintSquare] = { backgroundColor: "rgba(255, 215, 0, 0.55)", borderRadius: "4px" };
    }

    // Selected piece highlight
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "rgba(100, 200, 100, 0.45)",
        borderRadius: "4px",
      };
    }

    // Legal move indicators
    for (const sq of legalMoves) {
      const occupied = !!game.get(sq as Parameters<Chess["get"]>[0]);
      if (occupied) {
        // Capture: green ring inset
        styles[sq] = {
          ...styles[sq],
          boxShadow: "inset 0 0 0 4px rgba(100,200,100,0.75)",
          borderRadius: "2px",
        };
      } else {
        // Empty: radial dot
        const existing = (styles[sq] as { backgroundColor?: string } | undefined)?.backgroundColor;
        styles[sq] = {
          ...styles[sq],
          background: existing
            ? `radial-gradient(circle, rgba(100,200,100,0.65) 26%, transparent 27%), ${existing}`
            : "radial-gradient(circle, rgba(100,200,100,0.65) 26%, transparent 27%)",
        };
      }
    }

    return styles;
  }, [hintSquare, selectedSquare, legalMoves, game]);

  const tryMove = useCallback(
    (from: string, to: string) => {
      if (status !== "playing") return false;

      const move = game.move({ from, to, promotion: "q" });
      if (!move) return false;

      const moveSan = move.san;
      const normalizeMove = (m: string) => m.replace(/[+#]/g, "");
      const isCorrect = normalizeMove(moveSan) === normalizeMove(puzzle.solution);

      setAttempts((a) => a + 1);
      setSelectedSquare(null);
      setLegalMoves([]);

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

        const currentAttempts = attempts; // snapshot before setState
        const typeHint = typeHints[puzzle.type] ?? puzzle.hint;

        if (currentAttempts === 0) {
          setMessage(`❌ ${moveSan} doesn't solve it. ${typeHint}`);
        } else if (currentAttempts === 1) {
          setShowHint(true);
          setMessage(`Still searching? ${puzzle.hint} (The piece to move is highlighted in gold.)`);
        } else {
          setShowHint(true);
          setMessage(`The answer is ${puzzle.solution}. ${puzzle.explanation}`);
        }

        setTimeout(() => setStatus("playing"), 1800);
        if (currentAttempts >= 2) onSolve(false);
      }

      return true;
    },
    [game, puzzle, status, attempts, onSolve]
  );

  // Drag-and-drop handler
  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
      if (status !== "playing" || !targetSquare) return false;
      return tryMove(sourceSquare, targetSquare);
    },
    [status, tryMove]
  );

  // Click-to-move: clicking a piece selects it (or re-selects), clicking a legal square moves
  const onSquareClick = useCallback(
    (square: string | null) => {
      if (status !== "playing" || !square) return;

      // If a piece is already selected, try to move to this square
      if (selectedSquare) {
        if (legalMoves.includes(square)) {
          tryMove(selectedSquare, square);
          return;
        }

        // Clicked own piece — switch selection
        const piece = game.get(square as Parameters<Chess["get"]>[0]);
        if (piece && piece.color === sideToMove) {
          setSelectedSquare(square);
          const moves = game.moves({ square: square as Parameters<Chess["moves"]>[0]["square"], verbose: true }) as Array<{ to: string }>;
          setLegalMoves(moves.map((m) => m.to));
          return;
        }

        // Clicked non-legal empty square — deselect
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // No piece selected yet — select if own piece
      const piece = game.get(square as Parameters<Chess["get"]>[0]);
      if (piece && piece.color === sideToMove) {
        setSelectedSquare(square);
        const moves = game.moves({ square: square as Parameters<Chess["moves"]>[0]["square"], verbose: true }) as Array<{ to: string }>;
        setLegalMoves(moves.map((m) => m.to));
      }
    },
    [status, selectedSquare, legalMoves, game, sideToMove, tryMove]
  );

  const reset = () => {
    setGame(new Chess(puzzle.fen));
    setStatus("playing");
    setMessage(puzzle.hint);
    setAttempts(0);
    setShowHint(false);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const statusColors = {
    playing: "border-amber-500/30 bg-slate-800",
    correct: "border-green-500 bg-green-950",
    wrong: "border-red-500 bg-red-950",
  };

  const statusIcon = { playing: "💡", correct: "✅", wrong: "❌" };

  // Board flash overlay color
  const boardFlashClass =
    status === "correct"
      ? "ring-4 ring-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
      : status === "wrong"
      ? "ring-4 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]"
      : "";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {puzzle.type.replace("-", " ")}
        </span>
        <span className="text-slate-400 text-sm">
          {sideToMove === "w" ? "⬜ White" : "⬛ Black"} to move
        </span>
        {/* Attempt counter */}
        {attempts > 0 && status !== "correct" && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-400 border border-slate-600">
            Attempt {attempts + 1}
          </span>
        )}
        {hintSquare && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            💡 Hint: highlighted square
          </span>
        )}
      </div>

      <div className={`chess-container rounded-lg overflow-hidden transition-all duration-300 ${boardFlashClass}`} style={{ width: size, height: size }}>
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop: onDrop,
            onPieceClick: ({ square }: PieceHandlerArgs) => onSquareClick(square),
            onPieceDrag: ({ square }: PieceHandlerArgs) => {
              if (!square) return;
              const piece = game.get(square as Parameters<Chess["get"]>[0]);
              if (piece && piece.color === sideToMove) {
                setSelectedSquare(square);
                const moves = game.moves({ square: square as Parameters<Chess["moves"]>[0]["square"], verbose: true }) as Array<{ to: string }>;
                setLegalMoves(moves.map((m) => m.to));
              }
            },
            allowDragging: status === "playing",
            boardOrientation: sideToMove === "b" ? "black" : "white",
            darkSquareStyle: { backgroundColor: "#4a3728" },
            lightSquareStyle: { backgroundColor: "#f0d9b5" },
            animationDurationInMs: 200,
            boardStyle: { width: size, height: size },
            squareStyles: buildSquareStyles(),
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
