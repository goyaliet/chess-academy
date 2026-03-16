"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";
import { completeLesson } from "@/lib/progress";
import type { Module } from "@/lib/lessons";
import { tacticsPuzzles, openingsPuzzles, endgamePuzzles } from "@/lib/puzzles";
import { awardXP } from "@/lib/xp";
import { sounds } from "@/lib/sounds";

const ChessDemo = dynamic(() => import("@/components/ChessDemo"), { ssr: false });
const ChessPuzzle = dynamic(() => import("@/components/ChessPuzzle"), {
  ssr: false,
  loading: () => (
    <div className="w-80 h-80 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-4xl">♟️</span>
    </div>
  ),
});

const allPuzzles = [...tacticsPuzzles, ...openingsPuzzles, ...endgamePuzzles];

interface Props {
  module: Module;
  hideNav?: boolean;
}

export default function LessonPage({ module, hideNav }: Props) {
  const [selectedLesson, setSelectedLesson] = useState(module.lessons[0]);
  const [conceptIndex, setConceptIndex] = useState(0);
  const [phase, setPhase] = useState<"concepts" | "puzzles" | "complete">("concepts");
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null);

  const concept = selectedLesson.concepts[conceptIndex];
  const lessonPuzzles = selectedLesson.puzzleIds
    .map((id) => allPuzzles.find((p) => p.id === id))
    .filter(Boolean) as typeof allPuzzles;

  const currentPuzzle = lessonPuzzles[puzzleIndex];

  const nextConcept = () => {
    if (conceptIndex + 1 < selectedLesson.concepts.length) {
      setConceptIndex(conceptIndex + 1);
    } else if (lessonPuzzles.length > 0) {
      setPhase("puzzles");
      setPuzzleIndex(0);
    } else {
      completeLessonAndEarnBadge();
    }
  };

  const completeLessonAndEarnBadge = () => {
    completeLesson(selectedLesson.id, selectedLesson.badge);
    setEarnedBadge(selectedLesson.badge);
    setPhase("complete");
    awardXP("lesson_complete");
    sounds.badge();
  };

  const handlePuzzleSolve = (correct: boolean) => {
    if (correct) awardXP("puzzle_correct");
    else awardXP("puzzle_wrong");
    if (correct) {
      if (puzzleIndex + 1 < lessonPuzzles.length) {
        setPuzzleIndex(puzzleIndex + 1);
      } else {
        completeLessonAndEarnBadge();
      }
    }
  };

  const selectLesson = (lesson: typeof module.lessons[0]) => {
    setSelectedLesson(lesson);
    setConceptIndex(0);
    setPhase("concepts");
    setPuzzleIndex(0);
    setEarnedBadge(null);
  };

  return (
    <div style={{ minHeight: hideNav ? undefined : "100vh", background: hideNav ? undefined : "#0f172a" }}>
      {!hideNav && <Navbar />}
      <div className={hideNav ? undefined : "max-w-6xl mx-auto px-4 py-8"}>
        {/* Module header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-400 mb-1">
            {module.emoji} {module.title}
          </h1>
          <p className="text-slate-400">{module.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lesson sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">
              Lessons
            </p>
            <div className="flex flex-col gap-2">
              {module.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => selectLesson(lesson)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                    selectedLesson.id === lesson.id
                      ? "bg-amber-500 text-slate-900 font-bold border-amber-400"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700"
                  }`}
                >
                  <span className="mr-2">{lesson.emoji}</span>
                  {lesson.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {phase === "concepts" && concept && (
              <div className="animate-fade-in">
                {/* Progress within lesson */}
                <div className="flex gap-2 mb-4">
                  {selectedLesson.concepts.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i < conceptIndex
                          ? "bg-amber-500"
                          : i === conceptIndex
                          ? "bg-amber-500/60"
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                  {lessonPuzzles.length > 0 && (
                    <div className="h-1.5 flex-1 rounded-full bg-slate-700" />
                  )}
                </div>

                <div
                  className="rounded-2xl p-6 border mb-6"
                  style={{
                    background: "#1e293b",
                    borderColor: "rgba(245,158,11,0.2)",
                  }}
                >
                  <p className="text-xs text-amber-400 uppercase tracking-wider mb-2 font-semibold">
                    Concept {conceptIndex + 1} of{" "}
                    {selectedLesson.concepts.length}
                  </p>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {concept.title}
                  </h2>
                  <p className="text-slate-300 text-base leading-relaxed mb-4">
                    {concept.explanation}
                  </p>
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
                  >
                    <span className="text-xl">💡</span>
                    <p className="text-amber-200 text-sm">{concept.tip}</p>
                  </div>
                </div>

                {/* Board demo */}
                {concept.fen && (
                  <div className="flex justify-center mb-6">
                    <ChessDemo
                      fen={concept.fen}
                      moves={concept.moves}
                      size={280}
                      label="Example Position"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={nextConcept}
                    className="px-8 py-3 rounded-xl font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-all hover:scale-105"
                  >
                    {conceptIndex + 1 < selectedLesson.concepts.length
                      ? "Next →"
                      : lessonPuzzles.length > 0
                      ? "Practice Puzzles →"
                      : "Complete Lesson ✓"}
                  </button>
                </div>
              </div>
            )}

            {phase === "puzzles" && currentPuzzle && (
              <div className="animate-fade-in">
                <div className="mb-4">
                  <p className="text-amber-400 font-semibold">
                    Practice Time! Puzzle {puzzleIndex + 1} of{" "}
                    {lessonPuzzles.length}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Apply what you just learned
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <ChessPuzzle
                    key={currentPuzzle.id}
                    puzzle={currentPuzzle}
                    onSolve={handlePuzzleSolve}
                    size={360}
                  />
                </div>
              </div>
            )}

            {phase === "complete" && (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Lesson Complete!
                </h2>
                {earnedBadge && (
                  <div
                    className="inline-block px-6 py-3 rounded-2xl mb-6 border"
                    style={{
                      background: "rgba(245,158,11,0.15)",
                      borderColor: "rgba(245,158,11,0.4)",
                    }}
                  >
                    <p className="text-amber-400 font-bold text-lg">
                      🏅 Badge Earned: {earnedBadge}
                    </p>
                  </div>
                )}
                <p className="text-slate-300 mb-8 max-w-md mx-auto">
                  You&apos;ve mastered {selectedLesson.title}! Ready for the next one?
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  {/* Next lesson in module */}
                  {module.lessons.indexOf(selectedLesson) <
                    module.lessons.length - 1 && (
                    <button
                      onClick={() =>
                        selectLesson(
                          module.lessons[module.lessons.indexOf(selectedLesson) + 1]
                        )
                      }
                      className="px-8 py-3 rounded-xl font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 transition-all"
                    >
                      Next Lesson →
                    </button>
                  )}
                  <Link
                    href="/progress"
                    className="px-8 py-3 rounded-xl font-bold text-amber-400 border border-amber-500/40 hover:bg-amber-500/10 transition-all"
                  >
                    View Badges 🏆
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {!hideNav && (
        <TutorChat
          currentFen={phase === "concepts" ? concept?.fen : currentPuzzle?.fen}
          context={`studying ${module.title} — ${selectedLesson.title}`}
        />
      )}
    </div>
  );
}
