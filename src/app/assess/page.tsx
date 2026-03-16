"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";
import { assessmentPuzzles } from "@/lib/puzzles";
import { setAssessmentResult } from "@/lib/progress";

const ChessPuzzle = dynamic(() => import("@/components/ChessPuzzle"), {
  ssr: false,
  loading: () => (
    <div className="w-96 h-96 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-4xl">♟️</span>
    </div>
  ),
});

export default function AssessPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "puzzles" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState<boolean[]>([]);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    // Update streak on visit
    if (typeof window !== "undefined") {
      import("@/lib/progress").then(({ updateStreak }) => updateStreak());
    }
  }, []);

  const handleSolve = (correct: boolean) => {
    setSolved((s) => [...s, correct]);
    if (correct) setScore((s) => s + 1);
    setShowNext(true);
  };

  const nextPuzzle = () => {
    setShowNext(false);
    if (current + 1 >= assessmentPuzzles.length) {
      finishAssessment();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const finishAssessment = () => {
    const finalScore = score + (solved[solved.length - 1] ? 0 : 0);
    const level =
      score >= 4 ? "advanced" : score >= 2 ? "intermediate" : "beginner";
    setAssessmentResult(score, level);
    setPhase("result");
  };

  const levelInfo = {
    beginner: {
      title: "Rising Star ⭐",
      desc: "You're just getting started — that's great! Focus on tactics and opening principles first.",
      next: "/learn/tactics",
      color: "text-green-400",
    },
    intermediate: {
      title: "Skilled Player ♞",
      desc: "You have solid basics! Time to sharpen your tactics and learn some openings.",
      next: "/learn/openings",
      color: "text-blue-400",
    },
    advanced: {
      title: "Strong Player ♛",
      desc: "Impressive! You have a great foundation. Deep dive into strategy and endgames.",
      next: "/learn/strategy",
      color: "text-amber-400",
    },
  };

  const level =
    score >= 4 ? "advanced" : score >= 2 ? "intermediate" : "beginner";
  const info = levelInfo[level];

  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a" }}>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-4xl font-bold text-amber-400 mb-4">
            Chess Assessment
          </h1>
          <p className="text-slate-300 text-lg mb-6">
            Let&apos;s find your chess level! You&apos;ll solve{" "}
            <strong className="text-white">{assessmentPuzzles.length} puzzles</strong>{" "}
            — each one tests a different skill.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
            {assessmentPuzzles.map((p, i) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3"
              >
                <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-white text-sm font-medium">{p.title}</p>
                  <p className="text-slate-400 text-xs capitalize">
                    {p.type.replace("-", " ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase("puzzles")}
            className="px-10 py-3 rounded-xl font-bold text-slate-900 text-lg bg-amber-500 hover:bg-amber-400 transition-all hover:scale-105 pulse-gold"
          >
            Start Assessment →
          </button>
          <p className="text-slate-500 text-sm mt-4">
            No pressure! Just do your best. Coach Claude will explain every answer.
          </p>
        </div>
        <TutorChat context="about to take the chess assessment" />
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a" }}>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
          <div className="text-7xl mb-6">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Assessment Complete!
          </h1>
          <p className={`text-2xl font-bold mb-4 ${info.color}`}>
            {info.title}
          </p>
          <div className="mb-6">
            <span className="text-6xl font-bold text-amber-400">{score}</span>
            <span className="text-2xl text-slate-400">
              /{assessmentPuzzles.length}
            </span>
          </div>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">{info.desc}</p>

          {/* Puzzle results */}
          <div className="flex justify-center gap-3 mb-8">
            {assessmentPuzzles.map((p, i) => (
              <div
                key={p.id}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  solved[i]
                    ? "bg-green-500/20 text-green-400 border border-green-500"
                    : "bg-red-500/20 text-red-400 border border-red-500"
                }`}
                title={p.title}
              >
                {solved[i] ? "✓" : "✗"}
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push(info.next)}
              className="px-8 py-3 rounded-xl font-bold text-slate-900 text-lg bg-amber-500 hover:bg-amber-400 transition-all hover:scale-105"
            >
              Start Learning →
            </button>
            <button
              onClick={() => {
                setCurrent(0);
                setScore(0);
                setSolved([]);
                setShowNext(false);
                setPhase("puzzles");
              }}
              className="px-8 py-3 rounded-xl font-bold text-amber-400 text-lg border border-amber-500/40 hover:bg-amber-500/10 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
        <TutorChat context="just finished the chess assessment" />
      </div>
    );
  }

  const puzzle = assessmentPuzzles[current];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>
              Puzzle {current + 1} of {assessmentPuzzles.length}
            </span>
            <span className="text-green-400">
              ✓ {score} correct
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{
                width: `${(current / assessmentPuzzles.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{puzzle.title}</h1>
          <p className="text-slate-400 text-sm">
            Drag and drop to make your move
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <ChessPuzzle
            key={puzzle.id}
            puzzle={puzzle}
            onSolve={handleSolve}
            size={380}
          />

          {showNext && (
            <button
              onClick={nextPuzzle}
              className="px-8 py-3 rounded-xl font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-all hover:scale-105 animate-fade-in"
            >
              {current + 1 >= assessmentPuzzles.length
                ? "See Results →"
                : "Next Puzzle →"}
            </button>
          )}
        </div>
      </div>
      <TutorChat
        currentFen={puzzle.fen}
        context={`solving assessment puzzle: ${puzzle.title}`}
      />
    </div>
  );
}
