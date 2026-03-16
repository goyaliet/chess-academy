"use client";

import { useState, useCallback, useRef } from "react";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";
import { getBotMove } from "@/lib/engine";
import { sounds } from "@/lib/sounds";
import { awardXP, getLevelInfo, getXP } from "@/lib/xp";

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
type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_LABELS: Record<Difficulty, { label: string; desc: string; color: string }> = {
  easy:   { label: "Easy",   desc: "Makes mistakes — great for practice",   color: "bg-green-500/20 border-green-500/40 text-green-400" },
  medium: { label: "Medium", desc: "Plays reasonably — a real challenge",   color: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
  hard:   { label: "Hard",   desc: "Plays well — test your best chess!",    color: "bg-red-500/20 border-red-500/40 text-red-400" },
};

export default function PracticePage() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(new Chess().fen());
  const [status, setStatus] = useState<GameStatus>("waiting");
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [levelUpMsg, setLevelUpMsg] = useState<string | null>(null);
  const gameRef = useRef(new Chess());

  const checkGameOver = useCallback((g: Chess): string | null => {
    if (g.isCheckmate()) {
      return g.turn() === "w" ? "You lost — checkmate! ♟️" : "You won! Checkmate! 🏆";
    }
    if (g.isDraw()) return "It's a draw! 🤝";
    if (g.isStalemate()) return "Stalemate — draw! 🤝";
    return null;
  }, []);

  const requestGameReview = useCallback(async (history: string[], result: string) => {
    setReviewLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Review this chess game. Moves: ${history.join(", ")}. Result: ${result}. Give 2–3 coaching tips about what happened, mentioning specific moves by number if possible. Keep it encouraging for a 10-year-old.`,
          fen: "",
          context: "reviewing a completed practice game",
        }),
      });
      const data = await res.json();
      setReview(data.reply ?? "Great game! Keep practicing!");
    } catch {
      setReview("Great game! Keep practicing!");
    } finally {
      setReviewLoading(false);
    }
  }, []);

  const endGame = useCallback((result: string, history: string[], isWin: boolean) => {
    setGameResult(result);
    setStatus("gameover");

    if (isWin) {
      sounds.win();
      const { xp, levelUp, newLevel } = awardXP("practice_win");
      setXpAwarded(xp);
      if (levelUp && newLevel) {
        setLevelUpMsg(`Level up! You're now a ${newLevel.emoji} ${newLevel.title}!`);
        sounds.levelUp();
      }
    } else {
      sounds.gameOver();
    }

    requestGameReview(history, result);
  }, [requestGameReview]);

  const botMove = useCallback(
    (currentGame: Chess, currentHistory: string[]) => {
      setThinking(true);
      // Run engine in a setTimeout so UI can update first
      setTimeout(() => {
        const move = getBotMove(currentGame.fen(), difficulty);
        if (!move) {
          setThinking(false);
          return;
        }
        const newGame = new Chess(currentGame.fen());
        const made = newGame.move(move);
        gameRef.current = newGame;
        setGame(newGame);
        setFen(newGame.fen());
        const newHistory = [...currentHistory, move];
        setMoveHistory(newHistory);

        // Play sound
        if (made?.flags.includes("c") || made?.flags.includes("e")) {
          sounds.capture();
        } else {
          sounds.move();
        }
        if (newGame.inCheck()) sounds.check();

        const result = checkGameOver(newGame);
        if (result) {
          const isWin = result.includes("won");
          endGame(result, newHistory, isWin);
        }
        setThinking(false);
      }, 400);
    },
    [difficulty, checkGameOver, endGame]
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

      gameRef.current = newGame;
      setGame(newGame);
      setFen(newGame.fen());
      const newHistory = [...moveHistory, move.san];
      setMoveHistory(newHistory);

      // Play sound
      if (move.flags.includes("c") || move.flags.includes("e")) {
        sounds.capture();
      } else {
        sounds.move();
      }
      if (newGame.inCheck()) sounds.check();

      const result = checkGameOver(newGame);
      if (result) {
        const isWin = result.includes("won");
        endGame(result, newHistory, isWin);
        return true;
      }

      botMove(newGame, newHistory);
      return true;
    },
    [game, status, playerColor, thinking, botMove, checkGameOver, endGame, moveHistory]
  );

  const startGame = (color: "white" | "black") => {
    const newGame = new Chess();
    gameRef.current = newGame;
    setGame(newGame);
    setFen(newGame.fen());
    setPlayerColor(color);
    setGameResult(null);
    setMoveHistory([]);
    setReview(null);
    setXpAwarded(null);
    setLevelUpMsg(null);
    setStatus("playing");

    if (color === "black") {
      setTimeout(() => botMove(newGame, []), 500);
    }
  };

  const resetGame = () => {
    setStatus("waiting");
    setGameResult(null);
    setMoveHistory([]);
    setReview(null);
    setXpAwarded(null);
    setLevelUpMsg(null);
    const newGame = new Chess();
    gameRef.current = newGame;
    setGame(newGame);
    setFen(newGame.fen());
  };

  const boardOrientation = playerColor === "white" ? "white" : "black";
  const currentXP = typeof window !== "undefined" ? getXP() : 0;
  const levelInfo = getLevelInfo(currentXP);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-400 mb-1">
            🎮 Practice Arena
          </h1>
          <p className="text-slate-400">
            Play against the Chess Bot — powered by a real minimax engine!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Board column */}
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
                <h2 className="text-xl font-bold text-white mb-4">
                  Choose Difficulty
                </h2>

                {/* Difficulty selector */}
                <div className="flex flex-col gap-2 mb-6">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2.5 rounded-xl border text-left transition-all ${
                        difficulty === d
                          ? DIFFICULTY_LABELS[d].color + " ring-1 ring-current"
                          : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="font-bold">{DIFFICULTY_LABELS[d].label}</span>
                      <span className="text-xs block opacity-70">{DIFFICULTY_LABELS[d].desc}</span>
                    </button>
                  ))}
                </div>

                <h3 className="text-sm font-semibold text-slate-400 mb-3">Choose Your Color</h3>
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
                  ? `Bot (${difficulty}) is thinking...`
                  : `Your turn — you are playing ${playerColor}`}
              </div>
            )}

            {/* Game over */}
            {status === "gameover" && gameResult && (
              <div
                className="w-full max-w-sm rounded-xl px-6 py-4 text-center border"
                style={{
                  background: "#1e293b",
                  borderColor: "rgba(245,158,11,0.3)",
                }}
              >
                <p className="text-xl font-bold text-white mb-2">{gameResult}</p>

                {xpAwarded !== null && (
                  <p className="text-amber-400 text-sm mb-1 font-semibold">
                    +{xpAwarded} XP earned!
                  </p>
                )}
                {levelUpMsg && (
                  <p className="text-green-400 text-sm font-bold mb-2 animate-bounce">
                    🎉 {levelUpMsg}
                  </p>
                )}

                <button
                  onClick={resetGame}
                  className="mt-3 px-6 py-2 rounded-lg font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-all"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col gap-4">
            {/* XP + Level bar */}
            <div
              className="rounded-2xl p-4 border"
              style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.2)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-400 font-bold text-sm">
                  {levelInfo.current.emoji} {levelInfo.current.title}
                </span>
                <span className="text-slate-400 text-xs">{currentXP} XP</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
              {levelInfo.next && (
                <p className="text-slate-500 text-xs mt-1">
                  {levelInfo.next.xp - currentXP} XP to {levelInfo.next.title}
                </p>
              )}
            </div>

            {/* Move history */}
            <div
              className="rounded-2xl p-5 border flex-1"
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
                <div className="grid grid-cols-2 gap-1 text-sm max-h-40 overflow-y-auto">
                  {Array.from({
                    length: Math.ceil(moveHistory.length / 2),
                  }).map((_, i) => (
                    <div key={i} className="contents">
                      <div className="flex gap-2">
                        <span className="text-slate-500 w-6">{i + 1}.</span>
                        <span className="text-white">{moveHistory[i * 2]}</span>
                      </div>
                      <div className="text-slate-400">
                        {moveHistory[i * 2 + 1] || ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coach review */}
              {(reviewLoading || review) && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    🧑‍🏫 Coach Claude&apos;s Review
                  </p>
                  {reviewLoading ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <span className="animate-spin">⏳</span> Analyzing your game...
                    </div>
                  ) : (
                    <p className="text-slate-300 text-sm leading-relaxed">{review}</p>
                  )}
                </div>
              )}

              {!reviewLoading && !review && (
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
              )}
            </div>
          </div>
        </div>
      </div>
      <TutorChat currentFen={fen} context="playing a practice game" />
    </div>
  );
}
