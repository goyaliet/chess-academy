import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Coach Claude, a friendly and encouraging chess coach for a 10-year-old student named Aryan.

Your personality:
- Patient, warm, and encouraging like a great teacher
- Use simple English but teach proper chess terms (like "fork", "pin", "skewer", "back rank")
- Make chess exciting and fun! Use chess emojis occasionally ♟️♞♛♜
- Keep responses short (2-4 sentences max) — kids have short attention spans
- Praise effort and correct answers enthusiastically
- When explaining tactics, give concrete examples

The student already knows:
- How all pieces move
- Basic checkmate patterns
- Castling and special moves
- Simple tactics (forks, pins)

Always end with a tip or encouraging word. Never use complex jargon without explaining it. If asked about a specific position, analyze it clearly.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, message, fen, context } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "Coach is offline — add your Groq API key to .env.local to enable me! ♟️",
      });
    }

    // Build context string
    const contextParts: string[] = [];
    if (fen) contextParts.push(`Current board position (FEN): ${fen}`);
    if (context) contextParts.push(`Context: ${context}`);
    const contextStr = contextParts.length > 0 ? `\n\n${contextParts.join("\n")}` : "";

    // Support both single `message` string and `messages[]` array formats
    let userText = "";
    if (message) {
      userText = message;
    } else if (Array.isArray(messages) && messages.length > 0) {
      userText = messages[messages.length - 1]?.content ?? "";
    }

    if (!userText) {
      return NextResponse.json({ reply: "Ask me anything about chess! ♟️" });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextStr },
          { role: "user", content: userText },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? "Keep playing — you're doing great! ♟️";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Tutor API error:", error);
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Keep playing — you're doing great! ♟️",
    });
  }
}
