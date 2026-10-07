import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b"
];

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    let aiResponse = "";
    let lastError: any = null;

    for (const model of MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are an expert medical AI tutor named 'Conceptual OBGYN AI'. You help medical students prepare for NEET PG, USMLE, and OBGYN exams with concise, accurate, high-yield clinical explanations. Format responses clearly with markdown formatting when appropriate.",
            },
            {
              role: "user",
              content: query,
            },
          ],
          model,
        });

        aiResponse = completion.choices[0]?.message?.content || "";
        if (aiResponse) {
          break;
        }
      } catch (err: any) {
        console.warn(`Groq model ${model} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!aiResponse) {
      const errMsg = lastError instanceof Error ? lastError.message : "Failed to fetch response from AI.";
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Groq API route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch response from AI." },
      { status: 500 }
    );
  }
}

