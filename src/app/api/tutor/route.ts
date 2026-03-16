import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { messages, fen, context } = await req.json();

    const systemPrompt = `You are Coach Claude, a friendly and encouraging chess coach for a 10-year-old student named Aryan.

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

${fen ? `The current board position (FEN): ${fen}` : ""}
${context ? `Current learning context: ${context}` : ""}

Always end with a tip or encouraging word. Never use complex jargon without explaining it. If asked about a specific position, analyze it clearly.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Tutor API error:", error);
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Try asking me again in a moment!" },
      { status: 200 }
    );
  }
}
