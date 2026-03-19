"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";
import { getProgress, type Progress } from "@/lib/progress";
import { modules } from "@/lib/lessons";
import { getLevelInfo, LEVEL_THRESHOLDS, getDailyChallengePuzzleId, hasDoneDaily } from "@/lib/xp";
import { allPuzzles } from "@/lib/puzzles";
import DailyChallenge from "@/components/DailyChallenge";

const allBadges = modules.flatMap((m) =>
  m.lessons.map((l) => ({ badge: l.badge, lesson: l.title, module: m.title, emoji: l.emoji }))
);

const levelColors: Record<string, string> = {
  beginner: "text-green-400 bg-green-500/20 border-green-500/40",
  intermediate: "text-blue-400 bg-blue-500/20 border-blue-500/40",
  advanced: "text-amber-400 bg-amber-500/20 border-amber-500/40",
};

const levelLabels: Record<string, string> = {
  beginner: "Rising Star ⭐",
  intermediate: "Skilled Player ♞",
  advanced: "Strong Player ♛",
};

export default function ProgressPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [dailyPuzzleId, setDailyPuzzleId] = useState<string | null>(null);
  const [dailyDone, setDailyDone] = useState(false);

  useEffect(() => {
    const p = getProgress();
    setProgress(p);
    setDailyPuzzleId(getDailyChallengePuzzleId());
    setDailyDone(hasDoneDaily());
  }, []);

  if (!progress) return null;

  const currentXP: number = (progress as unknown as Record<string, number>).xp ?? 0;
  const levelInfo = getLevelInfo(currentXP);
  const dailyPuzzle = dailyPuzzleId ? allPuzzles.find((p) => p.id === dailyPuzzleId) ?? null : null;

  const totalLessons = modules.flatMap((m) => m.lessons).length;
  const completedPercent = Math.round(
    (progress.completedLessons.length / totalLessons) * 100
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-400 mb-1">🏆 My Progress</h1>
        <p className="text-slate-400 mb-8">
          Keep learning every day — every puzzle solved makes you stronger!
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Level",
              value: progress.level
                ? levelLabels[progress.level]
                : "Not assessed",
              sub: progress.assessmentComplete ? `${progress.assessmentScore}/5 puzzles` : "Take assessment",
              color: progress.level ? levelColors[progress.level] : "text-slate-400",
            },
            {
              label: "Puzzles Solved",
              value: progress.totalPuzzlesSolved,
              sub: "total puzzles",
              color: "text-amber-400",
            },
            {
              label: "Lessons Done",
              value: `${progress.completedLessons.length}/${totalLessons}`,
              sub: `${completedPercent}% complete`,
              color: "text-green-400",
            },
            {
              label: "Day Streak",
              value: `${progress.streakDays} 🔥`,
              sub: "days in a row",
              color: "text-red-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 border text-center"
              style={{
                background: "#1e293b",
                borderColor: "rgba(245,158,11,0.2)",
              }}
            >
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* XP Level bar */}
        <div
          className="rounded-2xl p-5 border mb-8"
          style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.2)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl mr-2">{levelInfo.current.emoji}</span>
              <span className="text-white font-bold text-lg">{levelInfo.current.title}</span>
              <span className="text-slate-400 text-sm ml-2">Level {levelInfo.current.level}</span>
            </div>
            <span className="text-amber-400 font-bold">{currentXP} XP</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          {levelInfo.next && (
            <p className="text-slate-500 text-xs mt-1.5">
              {levelInfo.next.xp - currentXP} XP to reach {levelInfo.next.emoji} {levelInfo.next.title}
            </p>
          )}
          {/* Level milestones */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {LEVEL_THRESHOLDS.map((t) => (
              <span
                key={t.level}
                className={`text-xs px-2 py-1 rounded-full border ${
                  currentXP >= t.xp
                    ? "border-amber-500/40 bg-amber-500/20 text-amber-400"
                    : "border-slate-700 text-slate-600"
                }`}
              >
                {t.emoji} {t.title}
              </span>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyPuzzle && (
          <div className="mb-8">
            <DailyChallenge puzzle={dailyPuzzle} done={dailyDone} onComplete={() => setDailyDone(true)} />
          </div>
        )}

        {/* Assessment CTA if not done */}
        {!progress.assessmentComplete && (
          <div
            className="rounded-2xl p-6 mb-8 border flex items-center justify-between flex-wrap gap-4"
            style={{
              background: "rgba(245,158,11,0.1)",
              borderColor: "rgba(245,158,11,0.3)",
            }}
          >
            <div>
              <p className="text-amber-400 font-bold text-lg">
                📊 Take Your Assessment!
              </p>
              <p className="text-slate-300 text-sm">
                Find your chess level and get a personalized learning path
              </p>
            </div>
            <Link
              href="/assess"
              className="px-6 py-2 rounded-xl font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-all"
            >
              Start Now →
            </Link>
          </div>
        )}

        {/* Module progress */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Module Progress</h2>
          <div className="flex flex-col gap-4">
            {modules.map((mod) => {
              const done = mod.lessons.filter((l) =>
                progress.completedLessons.includes(l.id)
              ).length;
              const pct = Math.round((done / mod.lessons.length) * 100);
              return (
                <div
                  key={mod.id}
                  className="rounded-xl p-4 border"
                  style={{
                    background: "#1e293b",
                    borderColor: "rgba(245,158,11,0.15)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mod.emoji}</span>
                      <span className="font-bold text-white">{mod.title}</span>
                    </div>
                    <span className="text-sm text-slate-400">
                      {done}/{mod.lessons.length} lessons
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {mod.lessons.map((l) => (
                      <span
                        key={l.id}
                        className={`text-xs px-2 py-1 rounded-full ${
                          progress.completedLessons.includes(l.id)
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-slate-700 text-slate-500"
                        }`}
                      >
                        {l.emoji} {l.title}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Badges ({progress.badges.length}/{allBadges.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allBadges.map(({ badge, lesson, module: mod, emoji }) => {
              const earned = progress.badges.includes(badge);
              return (
                <div
                  key={badge}
                  className={`rounded-xl p-4 border text-center transition-all ${
                    earned
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-slate-700 bg-slate-800 opacity-40"
                  }`}
                >
                  <div className="text-3xl mb-2">{earned ? emoji : "🔒"}</div>
                  <p
                    className={`text-sm font-bold mb-1 ${
                      earned ? "text-amber-400" : "text-slate-500"
                    }`}
                  >
                    {badge}
                  </p>
                  <p className="text-xs text-slate-500">
                    {mod} · {lesson}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              if (confirm("Reset all progress? This cannot be undone.")) {
                import("@/lib/progress").then(({ resetProgress }) => {
                  resetProgress();
                  window.location.reload();
                });
              }
            }}
            className="text-xs text-slate-600 hover:text-red-400 transition-colors"
          >
            Reset all progress
          </button>
        </div>
      </div>
      <TutorChat context="viewing progress and badges" />
    </div>
  );
}
