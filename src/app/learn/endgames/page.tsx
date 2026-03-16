"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import LessonPage from "@/components/LessonPage";
import { modules } from "@/lib/lessons";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";

const EndgameDrills = dynamic(() => import("@/components/EndgameDrills"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center text-slate-500">Loading drills...</div>
  ),
});

type Tab = "lessons" | "drills";

export default function EndgamesPage() {
  const [tab, setTab] = useState<Tab>("lessons");
  const mod = modules.find((m) => m.id === "endgames")!;

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
            👑 Lessons
          </button>
          <button
            onClick={() => setTab("drills")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
              tab === "drills"
                ? "bg-amber-500 text-slate-900 border-amber-400"
                : "text-slate-300 border-slate-700 hover:border-amber-500/40"
            }`}
          >
            🏋️ Endgame Drills
          </button>
        </div>

        {tab === "lessons" ? (
          <LessonPage module={mod} hideNav />
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-amber-400 mb-1">🏋️ Endgame Drills</h1>
              <p className="text-slate-400">
                Practice K+Q vs K and K+R vs K checkmate patterns from real positions.
              </p>
            </div>
            <EndgameDrills />
          </div>
        )}
      </div>
      <TutorChat context="studying endgames" />
    </div>
  );
}
