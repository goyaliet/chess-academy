"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import LessonPage from "@/components/LessonPage";
import { modules } from "@/lib/lessons";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";
import type { Lesson } from "@/lib/lessons";

const OpeningTrainer = dynamic(() => import("@/components/OpeningTrainer"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center text-slate-500">
      Loading trainer...
    </div>
  ),
});

const AIBoardPractice = dynamic(() => import("@/components/AIBoardPractice"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center text-slate-500">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-amber-500/40 border-t-amber-400 rounded-full animate-spin" />
        <span className="text-sm">Loading AI Practice...</span>
      </div>
    </div>
  ),
});

type Tab = "lessons" | "trainer" | "ai-practice";

export default function OpeningsPage() {
  const [tab, setTab] = useState<Tab>("lessons");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const mod = modules.find((m) => m.id === "openings")!;

  const tabs: { id: Tab; label: string }[] = [
    { id: "lessons", label: "📖 Lessons" },
    { id: "trainer", label: "🎯 Opening Trainer" },
    { id: "ai-practice", label: "🤖 AI Practice" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab switcher */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                if (t.id !== "ai-practice") setSelectedLesson(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                tab === t.id
                  ? "bg-amber-500 text-slate-900 border-amber-400"
                  : "text-slate-300 border-slate-700 hover:border-amber-500/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "lessons" ? (
          <LessonPage module={mod} hideNav />
        ) : tab === "trainer" ? (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-amber-400 mb-1">🎯 Opening Trainer</h1>
              <p className="text-slate-400">
                Play through real opening lines move by move. Make the correct moves to master each opening!
              </p>
            </div>
            <OpeningTrainer size={360} />
          </div>
        ) : (
          /* AI Practice tab */
          <div>
            {selectedLesson ? (
              /* Practice mode — show board */
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 transition-all text-sm font-medium"
                  >
                    ← Back
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-amber-400">
                      {selectedLesson.emoji} {selectedLesson.title}
                    </h1>
                    <p className="text-slate-400 text-sm">{selectedLesson.description}</p>
                  </div>
                </div>
                <AIBoardPractice
                  lessonId={selectedLesson.id}
                  lessonName={selectedLesson.title}
                />
              </div>
            ) : (
              /* Lesson selector */
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-amber-400 mb-1">🤖 AI Practice</h1>
                  <p className="text-slate-400">
                    Select an opening to practice. The AI coach will guide you through real opening lines with hints and explanations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mod.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="group text-left p-5 rounded-2xl border border-slate-700 bg-slate-800/50 hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">{lesson.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm leading-snug">
                            {lesson.title}
                          </h3>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="text-amber-400/60 text-xs group-hover:text-amber-400 transition-colors">
                          Practice →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <TutorChat context="studying chess openings" />
    </div>
  );
}
