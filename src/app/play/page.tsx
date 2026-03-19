"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";
import { getBotMove } from "@/lib/engine";
import { sounds, toggleMute, isMuted } from "@/lib/sounds";
import { awardXP, getLevelInfo, getXP } from "@/lib/xp";

type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };
type PieceHandlerArgs = { isSparePiece: boolean; piece: { pieceType: string }; square: string | null };

const Chessboard = dynamic(
  () => import("react-chessboard").then((m) => m.Chessboard),
  {
    ssr: false,
    loading: () => (
      <div
        style={{ width: 560, height: 560 }}
        className="bg-slate-800 rounded-xl flex items-center justify-center"
      >
        <span className="text-6xl">♟️</span>
      </div>
    ),
  }
);

type GameStatus = "setup" | "playing" | "gameover";
type Difficulty = "easy" | "medium" | "hard";
type PlayerColor = "white" | "black";
type ArrowType = { startSquare: string; endSquare: string; color: string };

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; desc: string; emoji: string; cardColor: string; badgeColor: string; depth: string }
> = {
  easy: {
    label: "Easy",
    desc: "Bot makes mistakes. Perfect for beginners!",
    emoji: "😊",
    cardColor: "border-green-500 bg-green-900/20",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    depth: "Depth 1",
  },
  medium: {
    label: "Medium",
    desc: "Plays solid chess — a real challenge.",
    emoji: "🤔",
    cardColor: "border-amber-500 bg-amber-900/20",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    depth: "Depth 2",
  },
  hard: {
    label: "Hard",
    desc: "Near-perfect play. Bring your A-game!",
    emoji: "😤",
    cardColor: "border-red-500 bg-red-900/20",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    depth: "Depth 3",
  },
};

const PIECE_SYMBOLS: Record<string, string> = {
  wP: "♙", wN: "♘", wB: "♗", wR: "♖", wQ: "♕",
  bP: "♟", bN: "♞", bB: "♝", bR: "♜", bQ: "♛",
};

const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };

// ── Helpers ───────────────────────────────────────────────────

function getGameResult(g: Chess, playerColor: PlayerColor): string | null {
  if (g.isCheckmate()) {
    const playerCheckmated = g.turn() === (playerColor === "white" ? "w" : "b");
    return playerCheckmated ? "Checkmate! Bot wins. 🤖" : "Checkmate! You win! 🏆";
  }
  if (g.isStalemate()) return "Stalemate — it's a draw! 🤝";
  if (g.isDraw()) return "It's a draw! 🤝";
  return null;
}

/** Replay full move history to recompute captured piece lists */
function recomputeCaptures(
  history: string[],
  playerColor: PlayerColor
): { byPlayer: string[]; byBot: string[] } {
  const g = new Chess();
  const byPlayer: string[] = [];
  const byBot: string[] = [];
  const pChar = playerColor === "white" ? "w" : "b";
  for (const san of history) {
    const made = g.move(san);
    if (made?.captured) {
      const capColor = made.color === "w" ? "b" : "w";
      const key = `${capColor}${made.captured.toUpperCase()}`;
      if (made.color === pChar) byPlayer.push(key);
      else byBot.push(key);
    }
  }
  return { byPlayer, byBot };
}

/** Returns material advantage from white's POV (positive = white ahead) */
function getMaterialBalance(g: Chess): number {
  let score = 0;
  for (const row of g.board()) {
    for (const piece of row) {
      if (!piece) continue;
      const val = PIECE_VALUES[piece.type] ?? 0;
      score += piece.color === "w" ? val : -val;
    }
  }
  return score;
}

/** Build squareStyles for last-move highlight + legal move dots */
function buildSquareStyles(
  lastMove: { from: string; to: string } | null,
  selectedSquare: string | null,
  legalSquares: string[],
  game: Chess
): Record<string, React.CSSProperties> {
  const styles: Record<string, React.CSSProperties> = {};

  if (lastMove) {
    const tint: React.CSSProperties = { backgroundColor: "rgba(255,214,0,0.22)" };
    styles[lastMove.from] = tint;
    styles[lastMove.to] = tint;
  }

  if (selectedSquare) {
    styles[selectedSquare] = { backgroundColor: "rgba(100,200,100,0.35)" };
  }

  for (const sq of legalSquares) {
    const occupied = game.get(sq as Parameters<Chess["get"]>[0]);
    if (occupied) {
      styles[sq] = {
        ...styles[sq],
        boxShadow: "inset 0 0 0 4px rgba(100,200,100,0.75)",
        borderRadius: "2px",
      };
    } else {
      const existing = styles[sq]?.backgroundColor;
      styles[sq] = {
        ...styles[sq],
        background: existing
          ? `radial-gradient(circle, rgba(100,200,100,0.65) 26%, transparent 27%), ${existing}`
          : "radial-gradient(circle, rgba(100,200,100,0.65) 26%, transparent 27%)",
      };
    }
  }

  return styles;
}

// ── Component ─────────────────────────────────────────────────

export default function PlayPage() {
  const [fen, setFen] = useState(new Chess().fen());
  const [status, setStatus] = useState<GameStatus>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [levelUpMsg, setLevelUpMsg] = useState<string | null>(null);
  const [capturedByPlayer, setCapturedByPlayer] = useState<string[]>([]);
  const [capturedByBot, setCapturedByBot] = useState<string[]>([]);
  const [inCheck, setInCheck] = useState(false);

  // Feature 4 — promotion dialog
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);

  // Feature 1 — legal move highlights
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalSquares, setLegalSquares] = useState<string[]>([]);

  // Feature 2 — last move highlight
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Feature 6 — material score
  const [materialBalance, setMaterialBalance] = useState(0); // + = white ahead

  // Feature 7 — hint arrow
  const [hintArrows, setHintArrows] = useState<ArrowType[]>([]);
  const [hintLoading, setHintLoading] = useState(false);

  // Feature 9 — move replay
  const [allFens, setAllFens] = useState<string[]>([]);
  const [replayIndex, setReplayIndex] = useState<number | null>(null);
  const [replayLastMove, setReplayLastMove] = useState<{ from: string; to: string } | null>(null);
  const allFensRef = useRef<string[]>([]);

  // Feature 15 — sound toggle
  const [muted, setMuted] = useState(false);

  // Stable refs
  const gameRef = useRef(new Chess());
  const playerColorRef = useRef<PlayerColor>("white");
  const difficultyRef = useRef<Difficulty>("easy");
  const moveHistoryRef = useRef<string[]>([]);
  const capturedByPlayerRef = useRef<string[]>([]);
  const capturedByBotRef = useRef<string[]>([]);

  const historyScrollRef = useRef<HTMLDivElement>(null);

  const currentXP = typeof window !== "undefined" ? getXP() : 0;
  const levelInfo = getLevelInfo(currentXP);
  const cfg = DIFFICULTY_CONFIG[difficulty];

  const isMyTurn =
    status === "playing" &&
    !thinking &&
    ((playerColorRef.current === "white" && gameRef.current.turn() === "w") ||
      (playerColorRef.current === "black" && gameRef.current.turn() === "b"));

  const displayFen = replayIndex !== null && allFens.length > 0 ? allFens[replayIndex] : fen;
  const displayLastMove = replayIndex !== null ? replayLastMove : lastMove;

  const liveSquareStyles = buildSquareStyles(lastMove, selectedSquare, legalSquares, gameRef.current);
  const replaySquareStyles = buildSquareStyles(replayLastMove, null, [], gameRef.current);
  const activeSquareStyles = replayIndex !== null ? replaySquareStyles : liveSquareStyles;

  // Material display
  const playerIsWhite = playerColorRef.current === "white";
  const playerAdvantage = playerIsWhite ? materialBalance : -materialBalance;
  // botAdvantage = -playerAdvantage

  // Auto-scroll move history
  useEffect(() => {
    if (historyScrollRef.current && replayIndex === null) {
      historyScrollRef.current.scrollTop = historyScrollRef.current.scrollHeight;
    }
  }, [moveHistory, replayIndex]);

  // ── Coach Review ──────────────────────────────────────────────
  const requestReview = useCallback(async (history: string[], result: string) => {
    setReviewLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Review this chess game. Moves: ${history.join(", ")}. Result: ${result}. Give 2–3 coaching tips mentioning specific moves by number if possible. Keep it encouraging for a 10-year-old.`,
          fen: "",
          context: "reviewing a completed game vs AI bot",
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

  // ── End Game ──────────────────────────────────────────────────
  const endGame = useCallback(
    (result: string, history: string[]) => {
      setGameResult(result);
      setStatus("gameover");
      setSelectedSquare(null);
      setLegalSquares([]);
      setHintArrows([]);
      const finalFens = [...allFensRef.current];
      setAllFens(finalFens);
      setReplayIndex(finalFens.length - 1);

      const playerWon = result.includes("You win");
      if (playerWon) {
        sounds.win();
        const { xp, levelUp, newLevel } = awardXP("practice_win");
        setXpAwarded(xp);
        if (levelUp && newLevel) {
          setLevelUpMsg(`Level up! You're now ${newLevel.emoji} ${newLevel.title}!`);
          sounds.levelUp();
        }
      } else {
        sounds.gameOver();
      }
      requestReview(history, result);
    },
    [requestReview]
  );

  // ── Bot Move ──────────────────────────────────────────────────
  const botMove = useCallback(
    (afterGame: Chess, afterHistory: string[]) => {
      setThinking(true);
      setTimeout(() => {
        const move = getBotMove(afterGame.fen(), difficultyRef.current);
        if (!move) { setThinking(false); return; }

        const newGame = new Chess(afterGame.fen());
        const made = newGame.move(move);
        gameRef.current = newGame;

        const newFen = newGame.fen();
        allFensRef.current = [...allFensRef.current, newFen];
        setFen(newFen);
        setInCheck(newGame.inCheck());
        setMaterialBalance(getMaterialBalance(newGame));
        if (made) setLastMove({ from: made.from, to: made.to });

        const newHistory = [...afterHistory, move];
        moveHistoryRef.current = newHistory;
        setMoveHistory(newHistory);

        if (made?.captured) {
          const color = made.color === "w" ? "b" : "w";
          const key = `${color}${made.captured.toUpperCase()}`;
          const updated = [...capturedByBotRef.current, key];
          capturedByBotRef.current = updated;
          setCapturedByBot(updated);
        }

        if (made?.flags.includes("c") || made?.flags.includes("e")) sounds.capture();
        else sounds.move();
        if (newGame.inCheck()) sounds.check();

        const result = getGameResult(newGame, playerColorRef.current);
        if (result) endGame(result, newHistory);
        setThinking(false);
      }, 500);
    },
    [endGame]
  );

  // ── Commit Player Move (with chosen promotion) ───────────────
  const commitMove = useCallback(
    (from: string, to: string, promotion: "q" | "r" | "b" | "n" = "q") => {
      const pColor = playerColorRef.current;
      const newGame = new Chess(gameRef.current.fen());
      const move = newGame.move({ from, to, promotion });
      if (!move) return false;

      gameRef.current = newGame;
      const newFen = newGame.fen();
      allFensRef.current = [...allFensRef.current, newFen];
      setFen(newFen);
      setInCheck(newGame.inCheck());
      setMaterialBalance(getMaterialBalance(newGame));
      setLastMove({ from: move.from, to: move.to });
      setSelectedSquare(null);
      setLegalSquares([]);
      setHintArrows([]);
      setPendingPromotion(null);

      const newHistory = [...moveHistoryRef.current, move.san];
      moveHistoryRef.current = newHistory;
      setMoveHistory(newHistory);

      if (move.captured) {
        const color = move.color === "w" ? "b" : "w";
        const key = `${color}${move.captured.toUpperCase()}`;
        const updated = [...capturedByPlayerRef.current, key];
        capturedByPlayerRef.current = updated;
        setCapturedByPlayer(updated);
      }

      if (move.flags.includes("c") || move.flags.includes("e")) sounds.capture();
      else sounds.move();
      if (newGame.inCheck()) sounds.check();

      const result = getGameResult(newGame, pColor);
      if (result) { endGame(result, newHistory); return true; }

      botMove(newGame, newHistory);
      return true;
    },
    [botMove, endGame]
  );

  // ── Player Drop ───────────────────────────────────────────────
  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (status !== "playing" || thinking || !targetSquare) return false;
      const pColor = playerColorRef.current;
      if (pColor === "white" && gameRef.current.turn() !== "w") return false;
      if (pColor === "black" && gameRef.current.turn() !== "b") return false;

      // Detect pawn promotion
      const piece = gameRef.current.get(sourceSquare as Parameters<Chess["get"]>[0]);
      const isPromotion =
        piece?.type === "p" &&
        ((piece.color === "w" && targetSquare[1] === "8") ||
          (piece.color === "b" && targetSquare[1] === "1"));

      if (isPromotion) {
        // Verify the move is legal before showing dialog
        const testGame = new Chess(gameRef.current.fen());
        const testMove = testGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
        if (!testMove) return false;
        setPendingPromotion({ from: sourceSquare, to: targetSquare });
        setSelectedSquare(null);
        setLegalSquares([]);
        return true;
      }

      return commitMove(sourceSquare, targetSquare);
    },
    [status, thinking, commitMove]
  );

  // ── Legal Move Highlights ─────────────────────────────────────
  const onPieceInteract = useCallback(
    (square: string | null) => {
      if (status !== "playing" || thinking || !square) return;
      const pColor = playerColorRef.current;
      const piece = gameRef.current.get(square as Parameters<Chess["get"]>[0]);
      if (!piece || piece.color !== (pColor === "white" ? "w" : "b")) {
        setSelectedSquare(null);
        setLegalSquares([]);
        return;
      }
      setSelectedSquare(square);
      const moves = gameRef.current.moves({
        square: square as Parameters<Chess["moves"]>[0]["square"],
        verbose: true,
      }) as Array<{ to: string }>;
      setLegalSquares(moves.map((m) => m.to));
    },
    [status, thinking]
  );

  // ── Feature 7: Hint ───────────────────────────────────────────
  const showHint = useCallback(() => {
    if (!isMyTurn || hintLoading) return;
    setHintLoading(true);
    setTimeout(() => {
      const san = getBotMove(gameRef.current.fen(), "medium");
      if (san) {
        const tmp = new Chess(gameRef.current.fen());
        const made = tmp.move(san);
        if (made) {
          setHintArrows([{ startSquare: made.from, endSquare: made.to, color: "rgba(0,180,120,0.85)" }]);
          setTimeout(() => setHintArrows([]), 4000);
        }
      }
      setHintLoading(false);
    }, 50);
  }, [isMyTurn, hintLoading]);

  // ── Feature 9: Replay ─────────────────────────────────────────
  const goToReplay = useCallback(
    (idx: number) => {
      if (allFens.length === 0) return;
      const clamped = Math.max(0, Math.min(allFens.length - 1, idx));
      setReplayIndex(clamped);
      if (clamped > 0 && moveHistoryRef.current.length >= clamped) {
        const g = new Chess();
        for (let i = 0; i < clamped - 1; i++) g.move(moveHistoryRef.current[i]);
        const made = g.move(moveHistoryRef.current[clamped - 1]);
        setReplayLastMove(made ? { from: made.from, to: made.to } : null);
      } else {
        setReplayLastMove(null);
      }
    },
    [allFens]
  );

  // Keyboard arrows for replay
  useEffect(() => {
    if (status !== "gameover") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToReplay((replayIndex ?? allFens.length - 1) - 1);
      if (e.key === "ArrowRight") goToReplay((replayIndex ?? allFens.length - 1) + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status, replayIndex, allFens, goToReplay]);

  // ── Feature 3: Undo Move ──────────────────────────────────────
  const undoMove = useCallback(() => {
    if (status !== "playing" || thinking || !isMyTurn) return;
    // Need at least 2 half-moves: 1 player + 1 bot
    if (moveHistoryRef.current.length < 2) return;

    const newHistory = moveHistoryRef.current.slice(0, -2);
    const newFens = allFensRef.current.slice(0, -2);

    // Rebuild game from remaining history
    const newGame = new Chess();
    for (const san of newHistory) newGame.move(san);
    gameRef.current = newGame;
    moveHistoryRef.current = newHistory;
    allFensRef.current = newFens.length > 0 ? newFens : [new Chess().fen()];

    setFen(newGame.fen());
    setMoveHistory([...newHistory]);
    setInCheck(newGame.inCheck());
    setMaterialBalance(getMaterialBalance(newGame));
    setSelectedSquare(null);
    setLegalSquares([]);
    setHintArrows([]);

    // Recompute captures from scratch
    const { byPlayer, byBot } = recomputeCaptures(newHistory, playerColorRef.current);
    capturedByPlayerRef.current = byPlayer;
    capturedByBotRef.current = byBot;
    setCapturedByPlayer(byPlayer);
    setCapturedByBot(byBot);

    // Recompute last move highlight
    if (newHistory.length > 0) {
      const g = new Chess();
      for (let i = 0; i < newHistory.length - 1; i++) g.move(newHistory[i]);
      const made = g.move(newHistory[newHistory.length - 1]);
      setLastMove(made ? { from: made.from, to: made.to } : null);
    } else {
      setLastMove(null);
    }
  }, [status, thinking, isMyTurn]);

  // ── Start / Reset ─────────────────────────────────────────────
  const startGame = (color: PlayerColor) => {
    const newGame = new Chess();
    const initialFen = newGame.fen();
    gameRef.current = newGame;
    playerColorRef.current = color;
    difficultyRef.current = difficulty;
    moveHistoryRef.current = [];
    capturedByPlayerRef.current = [];
    capturedByBotRef.current = [];
    allFensRef.current = [initialFen];

    setFen(initialFen);
    setAllFens([initialFen]);
    setBoardOrientation(color);
    setGameResult(null);
    setMoveHistory([]);
    setReview(null);
    setXpAwarded(null);
    setLevelUpMsg(null);
    setCapturedByPlayer([]);
    setCapturedByBot([]);
    setInCheck(false);
    setLastMove(null);
    setSelectedSquare(null);
    setLegalSquares([]);
    setHintArrows([]);
    setReplayIndex(null);
    setReplayLastMove(null);
    setMaterialBalance(0);
    setStatus("playing");

    if (color === "black") setTimeout(() => botMove(newGame, []), 600);
  };

  const resetToSetup = () => {
    const newGame = new Chess();
    gameRef.current = newGame;
    moveHistoryRef.current = [];
    capturedByPlayerRef.current = [];
    capturedByBotRef.current = [];
    allFensRef.current = [];
    setFen(newGame.fen());
    setAllFens([]);
    setStatus("setup");
    setGameResult(null);
    setMoveHistory([]);
    setReview(null);
    setXpAwarded(null);
    setLevelUpMsg(null);
    setCapturedByPlayer([]);
    setCapturedByBot([]);
    setInCheck(false);
    setLastMove(null);
    setSelectedSquare(null);
    setLegalSquares([]);
    setHintArrows([]);
    setReplayIndex(null);
    setReplayLastMove(null);
    setMaterialBalance(0);
  };

  const resign = () => {
    if (status !== "playing") return;
    endGame("You resigned. Bot wins. 🤖", moveHistoryRef.current);
  };

  const handleMuteToggle = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  // Active move index for replay highlight in history table
  const activeMoveIdx = replayIndex !== null ? replayIndex - 1 : moveHistory.length - 1;

  // ── Material score label ──────────────────────────────────────
  const materialLabel = (advantage: number) => {
    if (advantage === 0) return null;
    const sign = advantage > 0 ? "+" : "";
    return `${sign}${advantage}`;
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-400 mb-1">🤖 Play vs AI</h1>
            <p className="text-slate-400">Challenge the chess bot — pick your difficulty and play!</p>
          </div>
          {/* Sound toggle — always visible */}
          <button
            onClick={handleMuteToggle}
            className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
              muted
                ? "bg-red-900/30 border-red-500/30 text-red-400 hover:bg-red-900/50"
                : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            }`}
            title={muted ? "Unmute sounds" : "Mute sounds"}
          >
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
        </div>

        {/* ── SETUP SCREEN ── */}
        {status === "setup" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-white mb-4">1. Choose Difficulty</h2>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                const c = DIFFICULTY_CONFIG[d];
                const selected = difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-150 ${
                      selected
                        ? `${c.cardColor} scale-105`
                        : "border-slate-700 bg-slate-800/60 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-3xl mb-3">{c.emoji}</div>
                    <div className="font-bold text-white text-base">{c.label}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{c.desc}</div>
                    <div className={`text-xs mt-3 px-2 py-0.5 rounded-full border inline-block font-semibold ${c.badgeColor}`}>
                      {c.depth}
                    </div>
                  </button>
                );
              })}
            </div>

            <h2 className="text-lg font-bold text-white mb-4">2. Choose Your Color</h2>
            <div className="flex gap-3">
              <button
                onClick={() => startGame("white")}
                className="flex-1 py-4 rounded-2xl font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all text-lg"
              >
                ♙ White
              </button>
              <button
                onClick={() => {
                  const c = Math.random() < 0.5 ? "white" : "black";
                  startGame(c);
                }}
                className="flex-1 py-4 rounded-2xl font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 transition-all text-lg"
              >
                🎲 Random
              </button>
              <button
                onClick={() => startGame("black")}
                className="flex-1 py-4 rounded-2xl font-bold text-white bg-slate-700 hover:bg-slate-600 border border-slate-500 transition-all text-lg"
              >
                ♟ Black
              </button>
            </div>
            <p className="text-center text-slate-600 text-xs mt-8">
              White moves first — if you play Black, the bot will move first automatically.
            </p>
          </div>
        )}

        {/* ── GAME / GAMEOVER SCREEN ── */}
        {(status === "playing" || status === "gameover") && (
          <div className="flex flex-col xl:flex-row gap-6 items-start">

            {/* Board column */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">

              {/* Bot label + material score + captured pieces */}
              <div className="flex items-center justify-between px-1" style={{ width: 560 }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <span className="font-semibold text-white text-sm">Bot</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${cfg.badgeColor}`}>
                    {cfg.label}
                  </span>
                  {thinking && (
                    <span className="text-xs text-amber-400 animate-pulse font-medium">thinking...</span>
                  )}
                  {/* Bot material advantage */}
                  {materialLabel(-playerAdvantage) && (
                    <span className="text-xs font-bold text-red-400">
                      {materialLabel(-playerAdvantage)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-0.5 justify-end" style={{ maxWidth: 200 }}>
                  {capturedByBot.map((p, i) => (
                    <span key={i} className="text-sm leading-none">{PIECE_SYMBOLS[p] ?? ""}</span>
                  ))}
                </div>
              </div>

              {/* Chess Board */}
              <div
                className={`rounded-xl overflow-hidden transition-all ${
                  inCheck && isMyTurn && replayIndex === null
                    ? "ring-4 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    : ""
                }`}
              >
                <Chessboard
                  options={{
                    position: displayFen,
                    onPieceDrop: replayIndex === null ? onDrop : () => false,
                    onPieceClick: replayIndex === null
                      ? ({ square }: PieceHandlerArgs) => onPieceInteract(square)
                      : undefined,
                    onPieceDrag: replayIndex === null
                      ? ({ square }: PieceHandlerArgs) => onPieceInteract(square)
                      : undefined,
                    boardOrientation: boardOrientation,
                    allowDragging: status === "playing" && !thinking && replayIndex === null,
                    squareStyles: activeSquareStyles,
                    arrows: hintArrows,
                    darkSquareStyle: { backgroundColor: "#4a3728" },
                    lightSquareStyle: { backgroundColor: "#f0d9b5" },
                    animationDurationInMs: replayIndex !== null ? 120 : 200,
                    boardStyle: { width: 560, height: 560 },
                  }}
                />
              </div>

              {/* Feature 4: Promotion Dialog */}
              {pendingPromotion && (
                <div
                  className="rounded-2xl p-4 border text-center"
                  style={{
                    width: 560,
                    background: "#1e293b",
                    borderColor: "rgba(245,158,11,0.5)",
                  }}
                >
                  <p className="text-amber-400 font-bold text-sm mb-3">
                    👑 Pawn Promotion! Choose your piece:
                  </p>
                  <div className="flex gap-2 justify-center">
                    {(
                      [
                        { piece: "q", symbol: playerColorRef.current === "white" ? "♕" : "♛", label: "Queen" },
                        { piece: "r", symbol: playerColorRef.current === "white" ? "♖" : "♜", label: "Rook" },
                        { piece: "b", symbol: playerColorRef.current === "white" ? "♗" : "♝", label: "Bishop" },
                        { piece: "n", symbol: playerColorRef.current === "white" ? "♘" : "♞", label: "Knight" },
                      ] as const
                    ).map(({ piece, symbol, label }) => (
                      <button
                        key={piece}
                        onClick={() => commitMove(pendingPromotion.from, pendingPromotion.to, piece)}
                        className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 transition-all"
                      >
                        <span className="text-4xl leading-none">{symbol}</span>
                        <span className="text-xs text-slate-400">{label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPendingPromotion(null)}
                    className="mt-3 text-xs text-slate-500 hover:text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Player label + material score + captured pieces */}
              <div className="flex items-center justify-between px-1" style={{ width: 560 }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎓</span>
                  <span className="font-semibold text-white text-sm">
                    You ({playerColorRef.current})
                  </span>
                  {isMyTurn && !inCheck && replayIndex === null && (
                    <span className="text-xs text-green-400 font-semibold">Your turn</span>
                  )}
                  {inCheck && isMyTurn && replayIndex === null && (
                    <span className="text-xs text-red-400 font-bold animate-pulse">⚠ CHECK!</span>
                  )}
                  {/* Player material advantage */}
                  {materialLabel(playerAdvantage) && (
                    <span className="text-xs font-bold text-green-400">
                      {materialLabel(playerAdvantage)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-0.5 justify-end" style={{ maxWidth: 200 }}>
                  {capturedByPlayer.map((p, i) => (
                    <span key={i} className="text-sm leading-none">{PIECE_SYMBOLS[p] ?? ""}</span>
                  ))}
                </div>
              </div>

              {/* Live game controls */}
              {status === "playing" && (
                <div className="grid grid-cols-3 gap-2 mt-1" style={{ width: 560 }}>
                  <button
                    onClick={() => setBoardOrientation((o) => (o === "white" ? "black" : "white"))}
                    className="py-2 rounded-xl text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
                  >
                    🔄 Flip
                  </button>
                  {/* Feature 3: Undo */}
                  <button
                    onClick={undoMove}
                    disabled={!isMyTurn || moveHistory.length < 2}
                    className="py-2 rounded-xl text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                    title="Take back your last move"
                  >
                    ↩ Undo
                  </button>
                  {/* Feature 7: Hint */}
                  <button
                    onClick={showHint}
                    disabled={!isMyTurn || hintLoading}
                    className="py-2 rounded-xl text-sm font-medium bg-blue-900/40 text-blue-300 border border-blue-500/30 hover:bg-blue-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Show a suggested move (4 seconds)"
                  >
                    {hintLoading ? "💡..." : "💡 Hint"}
                  </button>
                  <button
                    onClick={resign}
                    className="py-2 rounded-xl text-sm font-medium bg-red-900/40 text-red-400 border border-red-500/30 hover:bg-red-800/50 transition-all"
                  >
                    🏳 Resign
                  </button>
                  <button
                    onClick={resetToSetup}
                    className="col-span-2 py-2 rounded-xl text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
                  >
                    ↩ New Game
                  </button>
                </div>
              )}

              {/* ── REPLAY CONTROLS (Feature 9) ── */}
              {status === "gameover" && allFens.length > 0 && (
                <div className="mt-2" style={{ width: 560 }}>
                  <div
                    className="rounded-2xl p-3 border"
                    style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.25)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                        🎬 Game Replay
                      </span>
                      <span className="text-slate-400 text-xs">
                        {replayIndex === 0
                          ? "Start position"
                          : replayIndex !== null
                          ? `Move ${replayIndex} / ${allFens.length - 1}`
                          : `Move ${allFens.length - 1} / ${allFens.length - 1}`}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-700 rounded-full mb-3 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-150"
                        style={{
                          width: `${allFens.length <= 1 ? 100 : ((replayIndex ?? allFens.length - 1) / (allFens.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="flex gap-1.5 items-center">
                      <button
                        onClick={() => goToReplay(0)}
                        disabled={(replayIndex ?? 0) === 0}
                        className="px-2.5 py-1.5 rounded-lg text-sm bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Start"
                      >⏮</button>
                      <button
                        onClick={() => goToReplay((replayIndex ?? allFens.length - 1) - 1)}
                        disabled={(replayIndex ?? 0) === 0}
                        className="flex-1 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >← Prev</button>
                      <button
                        onClick={() => goToReplay((replayIndex ?? allFens.length - 1) + 1)}
                        disabled={(replayIndex ?? allFens.length - 1) === allFens.length - 1}
                        className="flex-1 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >Next →</button>
                      <button
                        onClick={() => goToReplay(allFens.length - 1)}
                        disabled={(replayIndex ?? allFens.length - 1) === allFens.length - 1}
                        className="px-2.5 py-1.5 rounded-lg text-sm bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="End"
                      >⏭</button>
                    </div>
                    <p className="text-slate-600 text-xs text-center mt-2">
                      Use ← → arrow keys to navigate
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col gap-4 min-w-0 w-full xl:w-auto">

              {/* Game Over Result Card */}
              {status === "gameover" && gameResult && (
                <div
                  className="rounded-2xl p-5 border text-center"
                  style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.4)" }}
                >
                  <p className="text-2xl font-bold text-white mb-2">{gameResult}</p>
                  {xpAwarded !== null && (
                    <p className="text-amber-400 font-semibold text-sm mb-1">+{xpAwarded} XP earned!</p>
                  )}
                  {levelUpMsg && (
                    <p className="text-green-400 font-bold text-sm mb-2 animate-bounce">🎉 {levelUpMsg}</p>
                  )}
                  <div className="flex gap-3 justify-center mt-4 flex-wrap">
                    <button
                      onClick={() => startGame(playerColorRef.current)}
                      className="px-5 py-2.5 rounded-xl font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-all text-sm"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={resetToSetup}
                      className="px-5 py-2.5 rounded-xl font-bold text-amber-400 border border-amber-500/40 hover:bg-amber-500/10 transition-all text-sm"
                    >
                      Change Settings
                    </button>
                    <button
                      onClick={() => {
                        const g = new Chess();
                        moveHistoryRef.current.forEach((san) => { try { g.move(san); } catch { /* skip */ } });
                        const pgn = g.pgn();
                        window.open(`/review?pgn=${encodeURIComponent(pgn)}`, "_blank");
                      }}
                      className="px-5 py-2.5 rounded-xl font-bold text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 transition-all text-sm"
                    >
                      🧑‍🏫 Deep Review
                    </button>
                  </div>
                </div>
              )}

              {/* XP / Level + game info */}
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
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700">
                  <span className="text-xs text-slate-500">{moveHistory.length} moves played</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${cfg.badgeColor}`}>
                    {cfg.emoji} {cfg.label}
                  </span>
                </div>
              </div>

              {/* Move History */}
              <div
                className="rounded-2xl p-5 border flex-1"
                style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.2)" }}
              >
                <h3 className="text-amber-400 font-bold mb-3 text-sm uppercase tracking-wider">
                  Move History
                  {status === "gameover" && (
                    <span className="text-slate-500 text-xs font-normal ml-2 normal-case">
                      (click a move to jump to it)
                    </span>
                  )}
                </h3>

                {moveHistory.length === 0 ? (
                  <p className="text-slate-500 text-sm">No moves yet.</p>
                ) : (
                  <div ref={historyScrollRef} className="overflow-y-auto max-h-64 pr-1">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-500 text-xs border-b border-slate-700">
                          <th className="text-left pb-1.5 w-8">#</th>
                          <th className="text-left pb-1.5">White</th>
                          <th className="text-left pb-1.5">Black</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
                          const wIdx = i * 2;
                          const bIdx = i * 2 + 1;
                          return (
                            <tr key={i} className="border-b border-slate-700/40 hover:bg-slate-700/20">
                              <td className="py-1 text-slate-500 text-xs">{i + 1}.</td>
                              <td
                                onClick={() => status === "gameover" && goToReplay(wIdx + 1)}
                                className={`py-1 font-mono text-xs rounded px-1 transition-colors ${
                                  activeMoveIdx === wIdx
                                    ? "bg-amber-500/30 text-amber-300 font-bold"
                                    : `text-white ${status === "gameover" ? "cursor-pointer hover:text-amber-300" : ""}`
                                }`}
                              >
                                {moveHistory[wIdx]}
                              </td>
                              <td
                                onClick={() =>
                                  status === "gameover" && moveHistory[bIdx] && goToReplay(bIdx + 1)
                                }
                                className={`py-1 font-mono text-xs rounded px-1 transition-colors ${
                                  activeMoveIdx === bIdx
                                    ? "bg-amber-500/30 text-amber-300 font-bold"
                                    : `text-slate-300 ${status === "gameover" && moveHistory[bIdx] ? "cursor-pointer hover:text-amber-300" : ""}`
                                }`}
                              >
                                {moveHistory[bIdx] || ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Coach Review */}
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

                {/* Quick tips while playing */}
                {status === "playing" && !reviewLoading && !review && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-slate-500 text-xs mb-2 font-semibold uppercase tracking-wider">
                      Quick Tips
                    </p>
                    <ul className="text-slate-400 text-xs space-y-1.5">
                      <li>⚔️ Look for forks — attack two pieces at once!</li>
                      <li>📌 Pins and skewers win material fast</li>
                      <li>🏰 Castle early to keep your king safe</li>
                      <li>👑 Activate all your pieces before attacking</li>
                      <li>💡 Stuck? Hit the Hint button for a suggestion!</li>
                      <li>💬 Ask Coach Claude anything in the chat →</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <TutorChat
        currentFen={displayFen}
        context={`playing a full game vs AI on ${difficulty} difficulty`}
      />
    </div>
  );
}
