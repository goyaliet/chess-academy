import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a chess coach generating practice puzzle hints for students.

Given a chess position (as FEN) and the correct move, output ONLY a JSON object with exactly these three fields:
1. "title" — a short punchy title (max 8 words) describing what this puzzle teaches
2. "hint" — one sentence that guides the student WITHOUT giving away the answer. Reference chess principles (center control, development, king safety, etc.)
3. "explanation" — 2-3 sentences shown AFTER solving, explaining WHY this is the right move and what opening principle it follows

Rules:
- NEVER reveal the actual move notation in the hint
- Keep language clear and educational
- Reference the specific opening theme from the topic context
- Output ONLY valid JSON, no markdown, no extra text

Example output:
{"title":"Develop with a Purpose","hint":"Think about which piece needs to reach an active square while controlling the center.","explanation":"This move develops the knight to its ideal square, controlling the center and eyeing important squares. Development tempo is crucial in the opening — every move should bring a new piece into the game. Knights belong in the center where they control the most squares."}`;

export interface GeneratePracticeRequest {
  fen: string;
  solution: string;
  moveNumber: number;
  playerColor: "w" | "b";
  topic: string;
  lessonName: string;
}

export interface GeneratePracticeResponse {
  title: string;
  hint: string;
  explanation: string;
}

const FALLBACK: GeneratePracticeResponse = {
  title: "Find the Best Opening Move",
  hint: "Think about the opening principles: center control, piece development, and king safety.",
  explanation:
    "This is the main line in this opening. Following the book moves ensures a solid, principled position. Every opening move should either control the center, develop a piece, or improve your king safety.",
};

export async function POST(req: NextRequest) {
  try {
    const body: GeneratePracticeRequest = await req.json();
    const { fen, solution, moveNumber, playerColor, topic, lessonName } = body;

    if (!fen || !solution) {
      return NextResponse.json(FALLBACK);
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(FALLBACK);
    }

    const sideToMove = playerColor === "w" ? "White" : "Black";
    const userPrompt = `Opening context: ${topic}
Lesson: ${lessonName}
Move number: ${moveNumber}
Side to move: ${sideToMove}
FEN: ${fen}
Correct move: ${solution}

Generate a title, hint, and explanation for this opening position. Output only JSON.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.6,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.error("Groq API error:", res.status, await res.text());
      return NextResponse.json(FALLBACK);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!raw) {
      return NextResponse.json(FALLBACK);
    }

    let parsed: GeneratePracticeResponse;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        return NextResponse.json(FALLBACK);
      }
    }

    // Validate required fields
    const result: GeneratePracticeResponse = {
      title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : FALLBACK.title,
      hint: typeof parsed.hint === "string" && parsed.hint.trim() ? parsed.hint.trim() : FALLBACK.hint,
      explanation:
        typeof parsed.explanation === "string" && parsed.explanation.trim()
          ? parsed.explanation.trim()
          : FALLBACK.explanation,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("generate-practice API error:", error);
    return NextResponse.json(FALLBACK);
  }
}
