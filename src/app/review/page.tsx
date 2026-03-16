"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";

const ChessDemo = dynamic(() => import("@/components/ChessDemo"), { ssr: false });

const EXAMPLE_PGN = `1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Bc5 5. O-O O-O`;

export default function ReviewPage() {
  const [pgn, setPgn] = useState("");
  const [review, setReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalFen, setFinalFen] = useState<string | null>(null);
  const [moveList, setMoveList] = useState<string[]>([]);

  const analyzeGame = async () => {
    setError(null);
    setReview(null);
    setFinalFen(null);

    let moves: string[] = [];
    let fen = "";
    try {
      const game = new Chess();
      game.loadPgn(pgn.trim());
      moves = game.history();
      fen = game.fen();
      if (moves.length === 0) throw new Error("No moves found");
    } catch {
      setError("Couldn't parse that PGN. Paste a game in standard PGN format (e.g. from chess.com or lichess).");
      return;
    }

    setMoveList(moves);
    setFinalFen(fen);
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Please review this chess game (${moves.length} moves): ${moves.join(", ")}. Identify the 3 biggest mistakes or missed opportunities, numbered. Mention the move number when you reference a specific move. Be encouraging and explain each point simply for a 10-year-old player.`,
          fen,
          context: "reviewing a completed game from PGN",
        }),
      });
      const data = await res.json();
      setReview(data.reply ?? "Great game! Keep practicing.");
    } catch {
      setReview("Couldn't get AI review right now. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-400 mb-1">🔍 Game Review</h1>
        <p className="text-slate-400 mb-8">
          Paste a PGN from chess.com or lichess — Coach Claude will review your game and find your 3 biggest mistakes!
        </p>

        <div className="flex flex-col gap-6">
          {/* PGN input */}
          <div
            className="rounded-2xl p-6 border"
            style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.2)" }}
          >
            <label className="block text-sm font-semibold text-amber-400 mb-2">
              Paste your PGN here
            </label>
            <textarea
              value={pgn}
              onChange={(e) => setPgn(e.target.value)}
              placeholder={`Example:\n${EXAMPLE_PGN}`}
              rows={6}
              className="w-full bg-slate-900 text-slate-200 text-sm rounded-xl p-4 border border-slate-700 focus:border-amber-500/50 focus:outline-none font-mono resize-none"
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                onClick={analyzeGame}
                disabled={loading || pgn.trim().length === 0}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Analyzing..." : "Analyze with Coach Claude →"}
              </button>
              <button
                onClick={() => setPgn(EXAMPLE_PGN)}
                className="px-4 py-2.5 rounded-xl text-slate-400 border border-slate-600 hover:border-amber-500/40 text-sm transition-all"
              >
                Load example
              </button>
            </div>

            <p className="text-slate-600 text-xs mt-3">
              To get your PGN: chess.com → Game → Share → Copy PGN | lichess → Analysis → FEN & PGN
            </p>
          </div>

          {/* Results */}
          {(loading || review || finalFen) && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Move list */}
              {moveList.length > 0 && (
                <div
                  className="rounded-2xl p-5 border lg:w-56 flex-shrink-0"
                  style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.15)" }}
                >
                  <h3 className="text-amber-400 font-bold mb-3 text-sm">Move List ({moveList.length} moves)</h3>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs max-h-64 overflow-y-auto">
                    {Array.from({ length: Math.ceil(moveList.length / 2) }).map((_, i) => (
                      <div key={i} className="contents">
                        <span className="text-slate-400">
                          <span className="text-slate-600 mr-1">{i + 1}.</span>
                          {moveList[i * 2]}
                        </span>
                        <span className="text-slate-500">{moveList[i * 2 + 1] ?? ""}</span>
                      </div>
                    ))}
                  </div>

                  {finalFen && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-500 mb-2">Final position:</p>
                      <ChessDemo fen={finalFen} size={180} />
                    </div>
                  )}
                </div>
              )}

              {/* Coach review */}
              <div
                className="flex-1 rounded-2xl p-6 border"
                style={{ background: "#1e293b", borderColor: "rgba(245,158,11,0.2)" }}
              >
                <h3 className="text-amber-400 font-bold mb-4">
                  🧑‍🏫 Coach Claude&apos;s Review
                </h3>
                {loading ? (
                  <div className="flex flex-col gap-3">
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-full" />
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-2/3" />
                    <p className="text-slate-500 text-sm mt-2">Analyzing {moveList.length} moves...</p>
                  </div>
                ) : (
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {review}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <TutorChat currentFen={finalFen ?? undefined} context="reviewing a chess game" />
    </div>
  );
}
