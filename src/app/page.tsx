import Link from "next/link";
import Navbar from "@/components/Navbar";
import TutorChat from "@/components/TutorChat";
import ProgressDashboard from "@/components/ProgressDashboard";

const modules = [
  {
    title: "Assessment",
    emoji: "📊",
    description: "Find your chess level with 5 puzzles + a mini game",
    href: "/assess",
    color: "from-amber-900 to-amber-800",
    border: "border-amber-500/40",
  },
  {
    title: "Tactics",
    emoji: "⚔️",
    description: "Forks, pins, skewers, back-rank mates — the tools that win games",
    href: "/learn/tactics",
    color: "from-red-900 to-red-800",
    border: "border-red-500/40",
  },
  {
    title: "Openings",
    emoji: "♟️",
    description: "Control the center, develop your pieces, castle your king",
    href: "/learn/openings",
    color: "from-blue-900 to-blue-800",
    border: "border-blue-500/40",
  },
  {
    title: "Endgames",
    emoji: "👑",
    description: "Turn your advantage into a win — King + Queen, King + Rook, pawns",
    href: "/learn/endgames",
    color: "from-purple-900 to-purple-800",
    border: "border-purple-500/40",
  },
  {
    title: "Strategy",
    emoji: "🧠",
    description: "Think like a grandmaster — plans, piece activity, pawn structure",
    href: "/learn/strategy",
    color: "from-green-900 to-green-800",
    border: "border-green-500/40",
  },
  {
    title: "Play vs AI",
    emoji: "🤖",
    description: "Full chess game against the bot — pick Easy, Medium or Hard and play!",
    href: "/play",
    color: "from-cyan-900 to-cyan-800",
    border: "border-cyan-500/40",
  },
  {
    title: "Practice",
    emoji: "🎮",
    description: "Play a game against the chess bot and test your skills",
    href: "/practice",
    color: "from-slate-800 to-slate-700",
    border: "border-slate-500/40",
  },
  {
    title: "My Progress",
    emoji: "🏆",
    description: "See your badges, completed lessons, and puzzle stats",
    href: "/progress",
    color: "from-yellow-900 to-yellow-800",
    border: "border-yellow-500/40",
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="text-7xl mb-6">♟️</div>
          <h1
            className="text-5xl sm:text-6xl font-bold mb-4"
            style={{ color: "#f59e0b" }}
          >
            Chess Academy
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Your personal AI chess coach
          </p>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Learn tactics, openings, endgames, and strategy step by step —
            with Coach Claude explaining every concept in plain English.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/assess"
              className="px-8 py-3 rounded-xl font-bold text-slate-900 text-lg transition-all hover:scale-105 pulse-gold"
              style={{ background: "#f59e0b" }}
            >
              Start Your Journey →
            </Link>
            <Link
              href="/progress"
              className="px-8 py-3 rounded-xl font-bold text-amber-400 text-lg border border-amber-500/40 hover:bg-amber-500/10 transition-all"
            >
              View Progress 🏆
            </Link>
          </div>
        </div>

        {/* Quote */}
        <div
          className="text-center mb-12 py-4 border-y"
          style={{ borderColor: "rgba(245,158,11,0.2)" }}
        >
          <p className="text-slate-400 italic text-sm">
            &ldquo;Chess is not about moving pieces — it&apos;s about having a plan.&rdquo;
          </p>
        </div>

        {/* Progress Dashboard */}
        <ProgressDashboard />

        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`group block p-6 rounded-2xl border bg-gradient-to-br ${mod.color} ${mod.border} hover:scale-105 transition-all duration-200 hover:shadow-xl`}
            >
              <div className="text-4xl mb-3">{mod.emoji}</div>
              <h2 className="text-xl font-bold text-white mb-2">{mod.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {mod.description}
              </p>
              <div className="mt-4 text-amber-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Start learning →
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-16">
          Powered by Claude AI ♟️ Free to learn, free to play
        </p>
      </main>

      <TutorChat context="home page — student is choosing where to start" />
    </div>
  );
}
