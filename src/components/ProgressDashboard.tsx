"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProgress, updateStreak, type Progress } from "@/lib/progress";
import { getLevelInfo, getXP } from "@/lib/xp";
import { modules } from "@/lib/lessons";

export default function ProgressDashboard() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    updateStreak();
    const p = getProgress();
    setProgress(p);
    setXp(getXP());
  }, []);

  if (!progress) return null;

  const levelInfo = getLevelInfo(xp);

  // Find the last completed lesson to offer a "continue" link
  const allLessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleHref: `/learn/${m.id}` }))
  );
  const lastCompletedId = progress.completedLessons[progress.completedLessons.length - 1] ?? null;
  const lastLesson = lastCompletedId
    ? allLessons.find((l) => l.id === lastCompletedId) ?? null
    : null;

  const totalLessons = allLessons.length;
  const completedCount = progress.completedLessons.length;

  // Find first incomplete lesson as the "continue" target
  const nextLesson = allLessons.find((l) => !progress.completedLessons.includes(l.id)) ?? null;

  return (
    <div
      className="rounded-2xl p-5 border mb-10"
      style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.25)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-amber-400 font-bold text-sm uppercase tracking-widest">
          📊 Your Progress
        </h2>
        <Link
          href="/progress"
          className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          View full stats →
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="rounded-xl p-3 bg-slate-800/80 border border-slate-700 text-center">
          <p className="text-2xl font-bold text-red-400">{progress.streakDays} 🔥</p>
          <p className="text-xs text-slate-500 mt-0.5">Day streak</p>
        </div>
        <div className="rounded-xl p-3 bg-slate-800/80 border border-slate-700 text-center">
          <p className="text-2xl font-bold text-amber-400">{progress.totalPuzzlesSolved}</p>
          <p className="text-xs text-slate-500 mt-0.5">Puzzles solved</p>
        </div>
        <div className="rounded-xl p-3 bg-slate-800/80 border border-slate-700 text-center">
          <p className="text-2xl font-bold text-green-400">{completedCount}/{totalLessons}</p>
          <p className="text-xs text-slate-500 mt-0.5">Lessons done</p>
        </div>
        <div className="rounded-xl p-3 bg-slate-800/80 border border-slate-700 text-center">
          <p className="text-lg font-bold text-white">{levelInfo.current.emoji} {levelInfo.current.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{xp} XP</p>
        </div>
      </div>

      {/* XP progress bar */}
      {levelInfo.next && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{levelInfo.current.title}</span>
            <span>{levelInfo.next.xp - xp} XP to {levelInfo.next.emoji} {levelInfo.next.title}</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Continue / Resume button */}
      {(nextLesson || lastLesson) && (
        <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            {lastLesson ? (
              <>Last studied: <span className="text-slate-300 font-medium">{lastLesson.emoji} {lastLesson.title}</span></>
            ) : (
              <span>Ready to start learning?</span>
            )}
          </div>
          {nextLesson && (
            <Link
              href={nextLesson.moduleHref}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-all"
            >
              Continue → {nextLesson.emoji} {nextLesson.title}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
