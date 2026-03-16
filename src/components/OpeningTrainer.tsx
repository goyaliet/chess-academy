"use client";

import { useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
type PieceDropHandlerArgs = { piece: unknown; sourceSquare: string; targetSquare: string | null };
import { sounds } from "@/lib/sounds";
import { awardXP } from "@/lib/xp";

export interface OpeningLine {
  id: string;
  name: string;
  eco: string;
  description: string;
  moves: string[]; // SAN — alternates white/black, user always plays white
  tips: string[];
}

export const OPENING_LINES: OpeningLine[] = [
  {
    id: "italian",
    name: "Italian Game",
    eco: "C50",
    description: "Control the center, develop knights before bishops, then the bishop eyes f7!",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "d3", "Bc5"],
    tips: [
      "1. e4 — control the center right away!",
      "1...e5 — Black mirrors you, also fighting for the center.",
      "2. Nf3 — develop a knight AND attack the e5 pawn.",
      "2...Nc6 — Black defends e5 with a knight.",
      "3. Bc4 — the 'Italian Bishop' eyes the weak f7 square!",
      "3...Nf6 — Black develops and attacks your e4 pawn.",
      "4. d3 — support your center and prepare to castle.",
      "4...Bc5 — both sides are developed. Castle next!",
    ],
  },
  {
    id: "sicilian",
    name: "Sicilian Defense",
    eco: "B20",
    description: "After 1.e4, Black plays c5 — fight for the center without copying White!",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6"],
    tips: [
      "1. e4 — claim the center.",
      "1...c5 — The Sicilian! Black fights for d4 without mirroring.",
      "2. Nf3 — develop and prepare d4.",
      "2...d6 — Black supports e5 and prepares Nf6.",
      "3. d4 — open the center while you can!",
      "3...cxd4 — Black takes the pawn, destroying White's center.",
      "4. Nxd4 — recapture with the knight to keep it active.",
      "4...Nf6 — Black develops and attacks e4. Exciting game ahead!",
    ],
  },
  {
    id: "london",
    name: "London System",
    eco: "D02",
    description: "A solid, reliable opening. Develop the bishop BEFORE playing e3!",
    moves: ["d4", "d5", "Nf3", "Nf6", "Bf4", "e6", "e3", "Be7"],
    tips: [
      "1. d4 — control the center with your d-pawn.",
      "1...d5 — Black mirrors, also claiming the center.",
      "2. Nf3 — develop a knight to a natural square.",
      "2...Nf6 — Black develops their knight.",
      "3. Bf4 — KEY MOVE: get the bishop out BEFORE playing e3!",
      "3...e6 — Black solidifies the center.",
      "4. e3 — now it's safe to play e3 since the bishop is already out.",
      "4...Be7 — Black prepares to castle. Solid London setup complete!",
    ],
  },
  {
    id: "queens-gambit",
    name: "Queen's Gambit",
    eco: "D06",
    description: "Offer a pawn to control the center. Black should decline with e6!",
    moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7"],
    tips: [
      "1. d4 — control the center.",
      "1...d5 — Black claims equal space.",
      "2. c4 — the Queen's Gambit! Offer a pawn to control the center.",
      "2...e6 — Declined! Black keeps the center and prepares Nf6.",
      "3. Nc3 — develop the knight and support d4.",
      "3...Nf6 — natural development.",
      "4. Bg5 — pin the knight to increase pressure on d5.",
      "4...Be7 — Black breaks the pin. Both sides develop well!",
    ],
  },
];

interface Props {
  size?: number;
}

export default function OpeningTrainer({ size = 360 }: Props) {
  const [selectedLine, setSelectedLine] = useState<OpeningLine>(OPENING_LINES[0]);
  const [game, setGame] = useState(new Chess());
  const [moveIndex, setMoveIndex] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [complete, setComplete] = useState(false);
  const [xpMsg, setXpMsg] = useState<string | null>(null);

  const isUserTurn = moveIndex % 2 === 0; // user always plays white (even indices)

  const resetTrainer = useCallback((line: OpeningLine) => {
    setSelectedLine(line);
    setGame(new Chess());
    setMoveIndex(0);
    setFeedback("idle");
    setComplete(false);
    setXpMsg(null);
  }, []);

  const playBotMove = useCallback((currentGame: Chess, nextIndex: number, line: OpeningLine) => {
    if (nextIndex >= line.moves.length) {
      setComplete(true);
      const { xp } = awardXP("lesson_complete");
      setXpMsg(`+${xp} XP — Opening mastered!`);
      sounds.badge();
      return;
    }
    setTimeout(() => {
      const newGame = new Chess(currentGame.fen());
      newGame.move(line.moves[nextIndex]);
      setGame(newGame);
      setMoveIndex(nextIndex + 1);
      setFeedback("idle");
      sounds.move();
    }, 600);
  }, []);

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
      if (!isUserTurn || feedback !== "idle" || complete || !targetSquare) return false;
      if (moveIndex >= selectedLine.moves.length) return false;

      const newGame = new Chess(game.fen());
      const move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (!move) return false;

      const expected = selectedLine.moves[moveIndex];
      const norm = (s: string) => s.replace(/[+#]/g, "");

      if (norm(move.san) === norm(expected)) {
        sounds.correct();
        setGame(newGame);
        setFeedback("correct");
        const nextIndex = moveIndex + 1;
        setMoveIndex(nextIndex);
        // Play bot's response
        playBotMove(newGame, nextIndex, selectedLine);
      } else {
        sounds.wrong();
        setFeedback("wrong");
        // Reset to before the wrong move
        setGame(new Chess(game.fen()));
        setTimeout(() => setFeedback("idle"), 1500);
      }
      return true;
    },
    [game, moveIndex, selectedLine, isUserTurn, feedback, complete, playBotMove]
  );

  const currentTip = selectedLine.tips[moveIndex] ?? selectedLine.tips[selectedLine.tips.length - 1];
  const progressPct = Math.round((moveIndex / selectedLine.moves.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Opening selector */}
      <div className="flex flex-wrap gap-2">
        {OPENING_LINES.map((line) => (
          <button
            key={line.id}
            onClick={() => resetTrainer(line)}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
              selectedLine.id === line.id
                ? "bg-amber-500 text-slate-900 border-amber-400"
                : "bg-slate-700 text-slate-300 border-slate-600 hover:border-amber-500/40"
            }`}
          >
            {line.eco} · {line.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Board */}
        <div className="flex flex-col items-center gap-3">
          <div className="chess-container rounded-xl overflow-hidden" style={{ width: size, height: size }}>
            <Chessboard
              options={{
                position: game.fen(),
                onPieceDrop: complete ? undefined : onDrop,
                allowDragging: isUserTurn && feedback === "idle" && !complete,
                darkSquareStyle: { backgroundColor: "#4a3728" },
                lightSquareStyle: { backgroundColor: "#f0d9b5" },
                animationDurationInMs: 250,
                boardStyle: { width: size, height: size },
              }}
            />
          </div>

          {/* Progress bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Move {moveIndex}/{selectedLine.moves.length}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 flex flex-col gap-4">
          <div
            className="rounded-2xl p-5 border"
            style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.2)" }}
          >
            <h3 className="text-amber-400 font-bold text-lg mb-1">{selectedLine.name}</h3>
            <p className="text-slate-400 text-sm mb-4">{selectedLine.description}</p>

            {complete ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-green-400 font-bold">Opening Complete!</p>
                {xpMsg && <p className="text-amber-400 text-sm mt-1">{xpMsg}</p>}
                <button
                  onClick={() => resetTrainer(selectedLine)}
                  className="mt-3 px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-bold text-sm hover:bg-amber-400 transition-all"
                >
                  Practice Again
                </button>
              </div>
            ) : (
              <>
                {/* Feedback */}
                <div
                  className={`rounded-xl p-3 border mb-4 transition-all ${
                    feedback === "correct"
                      ? "border-green-500/40 bg-green-500/10"
                      : feedback === "wrong"
                      ? "border-red-500/40 bg-red-500/10"
                      : isUserTurn
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-slate-600 bg-slate-700/30"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {feedback === "correct" && <span className="text-green-400">✅ Correct!</span>}
                    {feedback === "wrong" && <span className="text-red-400">❌ Wrong move — try again!</span>}
                    {feedback === "idle" && isUserTurn && <span className="text-amber-400">Your turn (White)</span>}
                    {feedback === "idle" && !isUserTurn && <span className="text-slate-400">Black is responding...</span>}
                  </p>
                  <p className="text-slate-300 text-xs leading-relaxed">{currentTip}</p>
                </div>

                {/* Move list */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {Array.from({ length: Math.ceil(selectedLine.moves.length / 2) }).map((_, i) => (
                    <div key={i} className="contents">
                      <span
                        className={`${i * 2 < moveIndex ? "text-amber-400 font-bold" : i * 2 === moveIndex ? "text-white" : "text-slate-600"}`}
                      >
                        {i + 1}. {selectedLine.moves[i * 2]}
                      </span>
                      <span
                        className={`${i * 2 + 1 < moveIndex ? "text-amber-400/70" : i * 2 + 1 === moveIndex ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {selectedLine.moves[i * 2 + 1] ?? ""}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
