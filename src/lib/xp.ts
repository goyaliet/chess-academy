"use client";

import { getProgress, saveProgress } from "./progress";

export interface XPEvent {
  type: "puzzle_correct" | "puzzle_wrong" | "lesson_complete" | "assessment" | "practice_win" | "daily_challenge";
  xp: number;
  label: string;
}

export const XP_REWARDS: Record<XPEvent["type"], number> = {
  puzzle_correct: 20,
  puzzle_wrong: 2,       // small reward for trying
  lesson_complete: 50,
  assessment: 30,
  practice_win: 40,
  daily_challenge: 75,
};

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0,    title: "Pawn",        emoji: "♙" },
  { level: 2, xp: 100,  title: "Knight",      emoji: "♞" },
  { level: 3, xp: 300,  title: "Bishop",      emoji: "♝" },
  { level: 4, xp: 600,  title: "Rook",        emoji: "♜" },
  { level: 5, xp: 1000, title: "Queen",       emoji: "♛" },
  { level: 6, xp: 1500, title: "King",        emoji: "♚" },
  { level: 7, xp: 2500, title: "Grandmaster", emoji: "👑" },
];

export function getLevelInfo(xp: number) {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] ?? null;
      break;
    }
  }
  const progress = next
    ? ((xp - current.xp) / (next.xp - current.xp)) * 100
    : 100;
  return { current, next, progress: Math.round(progress) };
}

export function awardXP(type: XPEvent["type"]): { xp: number; levelUp: boolean; newLevel?: typeof LEVEL_THRESHOLDS[0] } {
  if (typeof window === "undefined") return { xp: 0, levelUp: false };
  const p = getProgress();
  const currentXP: number = (p as unknown as Record<string, number>).xp ?? 0;
  const earned = XP_REWARDS[type];
  const newXP = currentXP + earned;

  const oldLevel = getLevelInfo(currentXP).current;
  const newLevelInfo = getLevelInfo(newXP);
  const levelUp = newLevelInfo.current.level > oldLevel.level;

  saveProgress({ ...p, xp: newXP } as Parameters<typeof saveProgress>[0]);
  return { xp: earned, levelUp, newLevel: levelUp ? newLevelInfo.current : undefined };
}

export function getXP(): number {
  if (typeof window === "undefined") return 0;
  const p = getProgress();
  return (p as unknown as Record<string, number>).xp ?? 0;
}

// Daily challenge — one puzzle per day based on the date
export function getDailyChallengePuzzleId(): string {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  const ids = [
    "assess-1", "assess-2", "assess-3", "assess-4", "assess-5",
    "tac-fork-1", "tac-fork-2", "tac-pin-1", "tac-skewer-1", "tac-backrank-1",
    "open-1", "open-2", "end-1", "end-2",
  ];
  return ids[dayOfYear % ids.length];
}

export function hasDoneDaily(): boolean {
  if (typeof window === "undefined") return false;
  const today = new Date().toDateString();
  return localStorage.getItem("chess-daily-date") === today;
}

export function markDailyDone(): void {
  const today = new Date().toDateString();
  localStorage.setItem("chess-daily-date", today);
}
