"use client";

import { useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };
import { getBotMove } from "@/lib/engine";
import { sounds } from "@/lib/sounds";
import { awardXP } from "@/lib/xp";

interface Drill {
  id: string;
  name: string;
  icon: string;
  description: string;
  tip: string;
  positions: { fen: string; label: string }[];
}

const DRILLS: Drill[] = [
  {
    id: "kq-vs-k",
    name: "King + Queen vs King",
    icon: "♛",
    description: "Drive the enemy king to the edge, then deliver checkmate with queen + king support.",
    tip: "Use your queen to create a 'box' around the enemy king, then shrink it. Your king must come help at the end!",
    positions: [
      { fen: "8/8/8/4k3/8/8/8/KQ6 w - - 0 1", label: "Position 1" },
      { fen: "8/8/8/8/3k4/8/8/KQ6 w - - 0 1", label: "Position 2" },
      { fen: "8/8/8/8/8/2k5/8/KQ6 w - - 0 1", label: "Position 3" },
    ],
  },
  {
    id: "kr-vs-k",
    name: "King + Rook vs King",
    icon: "♜",
    description: "Cut off the enemy king rank by rank, then push it to the edge for checkmate.",
    tip: "The rook cuts off the king — use it to push the enemy king toward the edge. Your king must escort the rook!",
    positions: [
      { fen: "8/8/8/4k3/8/8/8/KR6 w - - 0 1", label: "Position 1" },
      { fen: "8/8/8/8/3k4/8/8/KR6 w - - 0 1", label: "Position 2" },
      { fen: "8/8/3k4/8/8/8/8/KR6 w - - 0 1", label: "Position 3" },
    ],
  },
  {
    id: "pawn-endgame",
    name: "Pawn Endgames",
    icon: "♙",
    description: "Use king + pawn coordination to promote. The key is opposition!",
    tip: "In pawn endgames, the king is a fighting piece! Use 'opposition' — put your king directly in front of the enemy king with one square between you.",
    positions: [
      { fen: "8/8/8/4k3/4P3/4K3/8/8 w - - 0 1", label: "King + Pawn vs King" },
      { fen: "8/8/8/8/8/2k5/2p5/2K5 b - - 0 1", label: "Defend vs Pawn" },
      { fen: "8/8/8/3k4/8/3K4/3P4/8 w - - 0 1", label: "Race to Promote" },
    ],
  },
];

export default function EndgameDrills() {
  const [selectedDrill, setSelectedDrill] = useState(DRILLS[0]);
  const [posIndex, setPosIndex] = useState(0);
  const [game, setGame] = useState(new Chess(DRILLS[0].positions[0].fen));
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState<"playing" | "won" | "drawn">("playing");
  const [moveCount, setMoveCount] = useState(0);
  const [xpMsg, setXpMsg] = useState<string | null>(null);

  const resetDrill = useCallback((drill: Drill, idx: number) => {
    setSelectedDrill(drill);
    setPosIndex(idx);
    setGame(new Chess(drill.positions[idx].fen));
    setStatus("playing");
    setMoveCount(0);
    setThinking(false);
    setXpMsg(null);
  }, []);

  const botRespond = useCallback((currentGame: Chess, count: number) => {
    setThinking(true);
    setTimeout(() => {
      if (currentGame.isGameOver()) { setThinking(false); return; }
      const move = getBotMove(currentGame.fen(), "easy");
      if (!move) { setThinking(false); return; }
      const newGame = new Chess(currentGame.fen());
      const made = newGame.move(move);
      setGame(newGame);
      setMoveCount(count + 1);
      if (made?.flags.includes("c")) sounds.capture();
      else sounds.move();
      if (newGame.inCheck()) sounds.check();
      if (newGame.isCheckmate()) {
        setStatus("won");
        sounds.win();
        const { xp } = awardXP("practice_win");
        setXpMsg(`+${xp} XP`);
      } else if (newGame.isDraw() || newGame.isStalemate()) {
        setStatus("drawn");
        sounds.gameOver();
      }
      setThinking(false);
    }, 500);
  }, []);

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
      if (status !== "playing" || thinking || !targetSquare) return false;
      const newGame = new Chess(game.fen());
      const move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (!move) return false;

      const newCount = moveCount + 1;
      setGame(newGame);
      setMoveCount(newCount);
      if (move.flags.includes("c")) sounds.capture();
      else sounds.move();
      if (newGame.inCheck()) sounds.check();

      if (newGame.isCheckmate()) {
        setStatus("won");
        sounds.win();
        const { xp } = awardXP("practice_win");
        setXpMsg(`+${xp} XP`);
      } else if (newGame.isDraw() || newGame.isStalemate()) {
        setStatus("drawn");
        sounds.gameOver();
      } else {
        botRespond(newGame, newCount);
      }
      return true;
    },
    [game, status, thinking, moveCount, botRespond]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Drill selector */}
      <div className="flex flex-wrap gap-2">
        {DRILLS.map((drill) => (
          <button
            key={drill.id}
            onClick={() => resetDrill(drill, 0)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              selectedDrill.id === drill.id
                ? "bg-amber-500 text-slate-900 border-amber-400"
                : "bg-slate-700 text-slate-300 border-slate-600 hover:border-amber-500/40"
            }`}
          >
            {drill.icon} {drill.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Board */}
        <div className="flex flex-col items-center gap-3">
          <div className="chess-container rounded-xl overflow-hidden" style={{ width: 360, height: 360 }}>
            <Chessboard
              options={{
                position: game.fen(),
                onPieceDrop: status === "playing" ? onDrop : undefined,
                allowDragging: status === "playing" && !thinking,
                darkSquareStyle: { backgroundColor: "#4a3728" },
                lightSquareStyle: { backgroundColor: "#f0d9b5" },
                animationDurationInMs: 200,
                boardStyle: { width: 360, height: 360 },
              }}
            />
          </div>

          {/* Status */}
          <div
            className="w-full max-w-sm text-center text-sm px-4 py-2 rounded-xl border"
            style={{
              background: status === "won" ? "rgba(34,197,94,0.1)" : status === "drawn" ? "rgba(239,68,68,0.1)" : thinking ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)",
              borderColor: status === "won" ? "rgba(34,197,94,0.4)" : status === "drawn" ? "rgba(239,68,68,0.4)" : thinking ? "rgba(245,158,11,0.4)" : "rgba(34,197,94,0.4)",
              color: status === "won" ? "#22c55e" : status === "drawn" ? "#ef4444" : thinking ? "#f59e0b" : "#22c55e",
            }}
          >
            {status === "won" && `✅ Checkmate in ${moveCount} moves! ${xpMsg ?? ""}`}
            {status === "drawn" && "⚠️ Stalemate — be careful not to give draw!"}
            {status === "playing" && (thinking ? "Enemy king is moving..." : `Your turn — move ${moveCount + 1}`)}
          </div>

          {/* Position selector */}
          <div className="flex gap-2 flex-wrap justify-center">
            {selectedDrill.positions.map((pos, i) => (
              <button
                key={i}
                onClick={() => resetDrill(selectedDrill, i)}
                className={`px-3 py-1.5 text-xs rounded-lg border font-semibold transition-all ${
                  i === posIndex
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                    : "border-slate-700 text-slate-500 hover:border-slate-500"
                }`}
              >
                {pos.label}
              </button>
            ))}
            <button
              onClick={() => resetDrill(selectedDrill, posIndex)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-500 hover:text-amber-400 hover:border-amber-500/40 transition-all"
            >
              Reset ↺
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div
            className="rounded-2xl p-5 border"
            style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.2)" }}
          >
            <h3 className="text-amber-400 font-bold text-lg mb-1">
              {selectedDrill.icon} {selectedDrill.name}
            </h3>
            <p className="text-slate-300 text-sm mb-4">{selectedDrill.description}</p>

            <div
              className="flex items-start gap-3 p-3 rounded-xl mb-4"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <span className="text-lg">💡</span>
              <p className="text-amber-200 text-sm">{selectedDrill.tip}</p>
            </div>

            <div className="text-slate-500 text-xs space-y-2">
              <p className="font-semibold text-slate-400">How it works:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>You play the winning side</li>
                <li>The bot plays the losing side (easy difficulty)</li>
                <li>Try to checkmate in as few moves as possible</li>
                <li>Avoid stalemate — don&apos;t give the enemy king no moves!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
