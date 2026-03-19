"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Puzzle } from "@/lib/puzzles";
import { awardXP, getLevelInfo, getXP } from "@/lib/xp";
import { markDailyDone } from "@/lib/xp";
import { sounds } from "@/lib/sounds";

const ChessPuzzle = dynamic(() => import("@/components/ChessPuzzle"), {
  ssr: false,
  loading: () => (
    <div className="h-48 flex items-center justify-center text-slate-500">Loading puzzle...</div>
  ),
});

interface Props {
  puzzle: Puzzle;
  done: boolean;
  onComplete: () => void;
}

export default function DailyChallenge({ puzzle, done, onComplete }: Props) {
  const [solved, setSolved] = useState(done);
  const [xpMsg, setXpMsg] = useState<string | null>(null);

  const handleSolve = (correct: boolean) => {
    if (!correct || solved) return;
    setSolved(true);
    markDailyDone();

    const oldXP = getXP();
    const { xp, levelUp, newLevel } = awardXP("daily_challenge");
    sounds.badge();

    const newXP = oldXP + xp;
    const info = getLevelInfo(newXP);
    if (levelUp && newLevel) {
      setXpMsg(`🎉 +${xp} XP — Level up! You're now a ${newLevel.emoji} ${newLevel.title}!`);
      sounds.levelUp();
    } else {
      setXpMsg(`+${xp} XP — ${info.current.emoji} ${info.current.title} (${newXP} total)`);
    }
    onComplete();
  };

  return (
    <div
      className="rounded-2xl p-6 border"
      style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.3)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-amber-400 font-bold text-lg">⭐ Daily Challenge</h2>
          <p className="text-slate-400 text-sm">Solve today&apos;s puzzle to earn bonus XP!</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          +75 XP
        </span>
      </div>

      {solved ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-green-400 font-bold text-lg">Challenge Complete!</p>
          {xpMsg && <p className="text-amber-400 text-sm mt-1">{xpMsg}</p>}
          <p className="text-slate-400 text-sm mt-2">Come back tomorrow for a new puzzle!</p>
        </div>
      ) : (
        <ChessPuzzle puzzle={puzzle} onSolve={handleSolve} size={320} />
      )}
    </div>
  );
}
