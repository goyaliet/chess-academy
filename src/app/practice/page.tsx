"use client";

import { useState, useCallback, useEffect } from "react";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";

const PracticeBoard = dynamic(() => import("@/components/PracticeBoard"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-slate-800 rounded-xl"
      style={{ width: 400, height: 400 }}
    >
      <span className="text-4xl">♟️</span>
    </div>
  ),
});

type GameStatus = "waiting" | "playing" | "gameover";

function randomMove(game: Chess): string | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  // Slightly prefer captures and checks for more interesting play
  const captures = moves.filter((m) => m.flags.includes("c") || m.flags.includes("e"));
  const checks = moves.filter((m) => {
    const g = new Chess(game.fen());
    g.move(m.san);
    return g.inCheck();
  });
  const interesting = [...captures, ...checks];
  const pool = interesting.length > 0 && Math.random() > 0.5 ? interesting : moves;
  return pool[Math.floor(Math.random() * pool.length)].san;
}

export default function PracticePage() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(new Chess().fen());
  const [status, setStatus] = useState<GameStatus>("waiting");
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);

  const checkGameOver = useCallback((g: Chess): string | null => {
    if (g.isCheckmate()) {
      return g.turn() === "w" ? "You lost — checkmate! ♟️" : "You won! Checkmate! 🏆";
    }
    if (g.isDraw()) return "It's a draw! 🤝";
    if (g.isStalemate()) return "Stalemate — draw! 🤝";
    return null;
  }, []);

  const botMove = useCallback(
    (currentGame: Chess) => {
      setThinking(true);
      setTimeout(() => {
        const move = randomMove(currentGame);
        if (!move) {
          setThinking(false);
          return;
        }
        const newGame = new Chess(currentGame.fen());
        newGame.move(move);
        setGame(newGame);
        setFen(newGame.fen());
        setMoveHistory((h) => [...h, move]);

        const result = checkGameOver(newGame);
        if (result) {
          setGameResult(result);
          setStatus("gameover");
        }
        setThinking(false);
      }, 600);
    },
    [checkGameOver]
  );

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
      if (status !== "playing" || thinking || !targetSquare) return false;
      if (playerColor === "white" && game.turn() !== "w") return false;
      if (playerColor === "black" && game.turn() !== "b") return false;

      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (!move) return false;

      setGame(newGame);
      setFen(newGame.fen());
      setMoveHistory((h) => [...h, move.san]);

      const result = checkGameOver(newGame);
      if (result) {
        setGameResult(result);
        setStatus("gameover");
        return true;
      }

      botMove(newGame);
      return true;
    },
    [game, status, playerColor, thinking, botMove, checkGameOver]
  );

  const startGame = (color: "white" | "black") => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setPlayerColor(color);
    setGameResult(null);
    setMoveHistory([]);
    setStatus("playing");

    if (color === "black") {
      // Bot plays first as white
      setTimeout(() => botMove(newGame), 500);
    }
  };

  const resetGame = () => {
    setStatus("waiting");
    setGameResult(null);
    setMoveHistory([]);
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
  };

  // Handle black's first move if needed
  useEffect(() => {
    if (
      status === "playing" &&
      ((playerColor === "white" && game.turn() === "b") ||
        (playerColor === "black" && game.turn() === "w")) &&
      !thinking &&
      game.history().length % 2 !== 0
    ) {
      // This is handled by botMove after player move
    }
  }, [status, playerColor, game, thinking]);

  const boardOrientation = playerColor === "white" ? "white" : "black";

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-400 mb-1">
            🎮 Practice Arena
          </h1>
          <p className="text-slate-400">
            Play a game against the Chess Bot — it makes random moves, so you
            can practice your tactics!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Board */}
          <div className="flex flex-col items-center gap-4">
            {status === "waiting" ? (
              <div
                className="rounded-2xl p-8 text-center border"
                style={{
                  background: "#1e293b",
                  borderColor: "rgba(245,158,11,0.2)",
                  width: 400,
                }}
              >
                <div className="text-5xl mb-4">♟️</div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Choose Your Color
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  You play against a random-move bot — great for practicing
                  tactics!
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => startGame("white")}
                    className="px-6 py-3 rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    ♙ Play White
                  </button>
                  <button
                    onClick={() => startGame("black")}
                    className="px-6 py-3 rounded-xl font-bold bg-slate-700 text-white hover:bg-slate-600 transition-all"
                  >
                    ♟ Play Black
                  </button>
                </div>
              </div>
            ) : (
              <div className="chess-container rounded-xl overflow-hidden">
                <PracticeBoard
                  fen={fen}
                  onDrop={onDrop}
                  orientation={boardOrientation}
                  draggable={!thinking && status === "playing"}
                />
              </div>
            )}

            {/* Status bar */}
            {status === "playing" && (
              <div
                className="w-full max-w-sm rounded-xl px-4 py-2 text-center border text-sm"
                style={{
                  background: thinking
                    ? "rgba(245,158,11,0.1)"
                    : "rgba(34,197,94,0.1)",
                  borderColor: thinking
                    ? "rgba(245,158,11,0.3)"
                    : "rgba(34,197,94,0.3)",
                  color: thinking ? "#f59e0b" : "#22c55e",
                }}
              >
                {thinking
                  ? "Bot is thinking..."
                  : `Your turn — you are playing ${playerColor}`}
              </div>
            )}

            {/* Game over */}
            {status === "gameover" && gameResult && (
              <div
                className="w-full max-w-sm rounded-xl px-6 py-4 text-center border animate-fade-in"
                style={{
                  background: "#1e293b",
                  borderColor: "rgba(245,158,11,0.3)",
                }}
              >
                <p className="text-xl font-bold text-white mb-3">
                  {gameResult}
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 rounded-lg font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-all"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          {/* Move history */}
          <div className="flex-1">
            <div
              className="rounded-2xl p-5 border h-full"
              style={{
                background: "#1e293b",
                borderColor: "rgba(245,158,11,0.2)",
              }}
            >
              <h3 className="text-amber-400 font-bold mb-4">Move History</h3>
              {moveHistory.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No moves yet. Start a game!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {Array.from({
                    length: Math.ceil(moveHistory.length / 2),
                  }).map((_, i) => (
                    <div key={i} className="contents">
                      <div className="flex gap-2">
                        <span className="text-slate-500 w-6">{i + 1}.</span>
                        <span className="text-white">
                          {moveHistory[i * 2]}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        {moveHistory[i * 2 + 1] || ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-700">
                <p className="text-slate-500 text-xs mb-2 font-semibold uppercase tracking-wider">
                  Tips for this game
                </p>
                <ul className="text-slate-400 text-xs space-y-1.5">
                  <li>⚔️ Look for forks — attack two pieces at once!</li>
                  <li>📌 Can you pin any of the bot&apos;s pieces?</li>
                  <li>🏰 Watch for back-rank weaknesses!</li>
                  <li>💡 Ask Coach Claude for help anytime →</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TutorChat currentFen={fen} context="playing a practice game" />
    </div>
  );
}
