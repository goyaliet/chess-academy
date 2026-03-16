"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import LessonPage from "@/components/LessonPage";
import { modules } from "@/lib/lessons";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";

const OpeningTrainer = dynamic(() => import("@/components/OpeningTrainer"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center text-slate-500">
      Loading trainer...
    </div>
  ),
});

type Tab = "lessons" | "trainer";

export default function OpeningsPage() {
  const [tab, setTab] = useState<Tab>("lessons");
  const mod = modules.find((m) => m.id === "openings")!;

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("lessons")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
              tab === "lessons"
                ? "bg-amber-500 text-slate-900 border-amber-400"
                : "text-slate-300 border-slate-700 hover:border-amber-500/40"
            }`}
          >
            📖 Lessons
          </button>
          <button
            onClick={() => setTab("trainer")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
              tab === "trainer"
                ? "bg-amber-500 text-slate-900 border-amber-400"
                : "text-slate-300 border-slate-700 hover:border-amber-500/40"
            }`}
          >
            🎯 Opening Trainer
          </button>
        </div>

        {tab === "lessons" ? (
          // Render LessonPage without its own Navbar/outer div
          <LessonPage module={mod} hideNav />
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-amber-400 mb-1">🎯 Opening Trainer</h1>
              <p className="text-slate-400">
                Play through real opening lines move by move. Make the correct moves to master each opening!
              </p>
            </div>
            <OpeningTrainer size={360} />
          </div>
        )}
      </div>
      <TutorChat context="studying chess openings" />
    </div>
  );
}
