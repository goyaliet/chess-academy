"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { Puzzle } from "@/lib/puzzles";
import { openingLines, getQuizPuzzle, type QuizPosition } from "@/lib/openingLines";

const ChessPuzzle = dynamic(() => import("@/components/ChessPuzzle"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl bg-slate-800 border border-slate-700 animate-pulse"
      style={{ width: 400, height: 400 }}
    />
  ),
});

interface Props {
  lessonId: string;
  lessonName: string;
}

interface SessionPuzzle extends QuizPosition {
  index: number;
}

let puzzleCounter = 0;
function nextPuzzleId(): string {
  return `ai-practice-${++puzzleCounter}-${Date.now()}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getSideToMove(fen: string): "w" | "b" {
  const parts = fen.split(" ");
  return parts[1] === "b" ? "b" : "w";
}

export default function AIBoardPractice({ lessonId, lessonName }: Props) {
  const [sessionPuzzles, setSessionPuzzles] = useState<SessionPuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [justSolved, setJustSolved] = useState(false);
  const loadingRef = useRef(false);

  // Build session puzzles on mount
  useEffect(() => {
    const lines = openingLines.filter((l) => l.lessonId === lessonId);
    const positions: SessionPuzzle[] = [];

    for (const line of lines) {
      for (let qi = 0; qi < line.quizMoves.length; qi++) {
        const pos = getQuizPuzzle(line, qi);
        if (pos) {
          positions.push({ ...pos, index: positions.length });
        }
      }
    }

    const shuffled = shuffle(positions).map((p, i) => ({ ...p, index: i }));
    setSessionPuzzles(shuffled);
    setCurrentIndex(0);
  }, [lessonId]);

  const loadPuzzle = useCallback(
    async (quizPos: QuizPosition) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setCurrentPuzzle(null);

      try {
        const res = await fetch("/api/generate-practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fen: quizPos.fen,
            solution: quizPos.solution,
            moveNumber: quizPos.moveNumber,
            playerColor: quizPos.playerColor,
            topic: openingLines.find((l) => l.id === quizPos.lineId)?.topic ?? lessonName,
            lessonName,
          }),
        });

        const data = await res.json();

        setCurrentPuzzle({
          id: nextPuzzleId(),
          title: data.title ?? "Find the Best Opening Move",
          fen: quizPos.fen,
          solution: quizPos.solution,
          hint: data.hint ?? "Think about the opening principles.",
          explanation: data.explanation ?? "This is the main line in this opening.",
          type: "opening",
          difficulty: "beginner",
        });
      } catch {
        // Fallback puzzle
        setCurrentPuzzle({
          id: nextPuzzleId(),
          title: "Find the Best Opening Move",
          fen: quizPos.fen,
          solution: quizPos.solution,
          hint: "Think about the opening principles: center control, piece development, and king safety.",
          explanation:
            "This is the main line in this opening. Following the book moves ensures a solid, principled position.",
          type: "opening",
          difficulty: "beginner",
        });
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [lessonName]
  );

  // Load first puzzle once session is ready
  useEffect(() => {
    if (sessionPuzzles.length > 0 && currentIndex === 0 && !currentPuzzle && !loadingRef.current) {
      loadPuzzle(sessionPuzzles[0]);
    }
  }, [sessionPuzzles, currentIndex, currentPuzzle, loadPuzzle]);

  const goToNext = useCallback(
    (skipDelay = false) => {
      if (sessionPuzzles.length === 0) return;
      const next = (currentIndex + 1) % sessionPuzzles.length;

      const doLoad = () => {
        setCurrentIndex(next);
        setJustSolved(false);
        loadPuzzle(sessionPuzzles[next]);
      };

      if (skipDelay) {
        doLoad();
      } else {
        setTimeout(doLoad, 1500);
      }
    },
    [currentIndex, sessionPuzzles, loadPuzzle]
  );

  const onSolve = useCallback(
    (correct: boolean) => {
      setScore((s) => ({
        correct: s.correct + (correct ? 1 : 0),
        total: s.total + 1,
      }));
      setJustSolved(true);
      goToNext(false);
    },
    [goToNext]
  );

  const totalDisplay = Math.min(sessionPuzzles.length, 20);
  const progressDisplay = Math.min(currentIndex, totalDisplay);
  const progressPct = totalDisplay > 0 ? (progressDisplay / totalDisplay) * 100 : 0;

  const sideToMove = currentPuzzle ? getSideToMove(currentPuzzle.fen) : null;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Header */}
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-bold text-amber-400 text-sm">AI Practice</span>
            <span className="text-slate-400 text-sm">—</span>
            <span className="text-slate-300 text-sm font-medium">{lessonName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-green-400 font-bold text-sm">{score.correct}</span>
            <span className="text-slate-500 text-sm">/</span>
            <span className="text-slate-400 text-sm">{score.total}</span>
            <span className="text-slate-500 text-xs ml-1">score</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {progressDisplay} of {totalDisplay}
          </span>
        </div>
      </div>

      {/* Board area */}
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          {/* Title skeleton */}
          <div className="h-7 w-64 rounded-lg bg-slate-700 animate-pulse" />

          {/* Board skeleton */}
          <div
            className="rounded-xl bg-slate-800 border border-slate-700 animate-pulse flex items-center justify-center"
            style={{ width: 400, height: 400 }}
          >
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <div className="w-10 h-10 border-4 border-amber-500/40 border-t-amber-400 rounded-full animate-spin" />
              <span className="text-sm font-medium">Coach is thinking...</span>
            </div>
          </div>

          {/* Hint skeleton */}
          <div className="w-full max-w-md space-y-2">
            <div className="h-4 w-full rounded bg-slate-700 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-slate-700 animate-pulse" />
          </div>
        </div>
      ) : currentPuzzle ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-lg">
          {/* Puzzle title */}
          <h2 className="text-xl font-bold text-white text-center">{currentPuzzle.title}</h2>

          {/* Side to move indicator */}
          {sideToMove && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
              <span className="text-base">{sideToMove === "w" ? "⬜" : "⬛"}</span>
              <span className="text-sm font-medium text-slate-300">
                {sideToMove === "w" ? "White" : "Black"} to move
              </span>
            </div>
          )}

          {/* Chess board */}
          <ChessPuzzle
            key={currentPuzzle.id}
            puzzle={currentPuzzle}
            onSolve={onSolve}
            size={400}
          />

          {/* Line name badge */}
          {sessionPuzzles[currentIndex] && (
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="px-2.5 py-1 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                {sessionPuzzles[currentIndex].lineName}
              </span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-500">
                Move {sessionPuzzles[currentIndex].moveNumber}
              </span>
            </div>
          )}

          {/* Skip button */}
          <button
            onClick={() => goToNext(true)}
            disabled={justSolved}
            className="text-xs text-slate-500 hover:text-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Skip
            <span className="text-base">→</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-slate-500 py-16">
          <span className="text-4xl">♟️</span>
          <p>No puzzles available for this lesson yet.</p>
        </div>
      )}

      {/* Empty session guard */}
      {!loading && sessionPuzzles.length === 0 && (
        <p className="text-slate-500 text-sm">
          No opening lines found for lesson: {lessonId}
        </p>
      )}
    </div>
  );
}
