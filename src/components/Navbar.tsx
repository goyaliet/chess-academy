"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home", icon: "♟️" },
  { href: "/assess", label: "Assess", icon: "📊" },
  { href: "/learn/tactics", label: "Tactics", icon: "⚔️" },
  { href: "/learn/openings", label: "Openings", icon: "📖" },
  { href: "/learn/endgames", label: "Endgames", icon: "👑" },
  { href: "/learn/strategy", label: "Strategy", icon: "🧠" },
  { href: "/practice", label: "Practice", icon: "🎮" },
  { href: "/review", label: "Review", icon: "🔍" },
  { href: "/progress", label: "Progress", icon: "🏆" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{ background: "#1e293b", borderBottom: "1px solid rgba(245,158,11,0.2)" }}
      className="sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                active
                  ? "bg-amber-500 text-slate-900"
                  : "text-slate-300 hover:text-amber-400 hover:bg-slate-700"
              }`}
            >
              <span>{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
