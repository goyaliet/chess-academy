"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  currentFen?: string;
  context?: string; // e.g. "working on tactics puzzles"
}

export default function TutorChat({ currentFen, context }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm Coach Claude, your personal chess trainer! ♟️ Ask me anything about chess — tactics, openings, endgames, or any move you're confused about. I'm here to help you improve!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          fen: currentFen,
          context,
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "Sorry, I couldn't respond right now. Try again!" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Oops! I had a connection issue. Try asking me again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 text-2xl shadow-xl transition-all duration-200 pulse-gold flex items-center justify-center"
        title="Ask Coach Claude"
      >
        {open ? "✕" : "♟️"}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 animate-fade-in"
          style={{ background: "#1e293b" }}>
          {/* Header */}
          <div className="px-4 py-3 bg-amber-500 flex items-center gap-2">
            <span className="text-2xl">♟️</span>
            <div>
              <p className="font-bold text-slate-900 text-sm">Coach Claude</p>
              <p className="text-slate-700 text-xs">Your personal chess trainer</p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-2 text-sm max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-amber-500 text-slate-900 self-end ml-auto"
                    : "bg-slate-700 text-slate-100 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-slate-700 rounded-xl px-3 py-2 text-sm text-slate-400 self-start">
                Coach Claude is thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask Coach Claude..."
              className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
