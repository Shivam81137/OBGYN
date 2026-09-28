/**
 * Live end-to-end test of the Groq AI pipeline
 * Tests PDF extraction + Groq structuring with the real TORCH PDF
 * Run: node scripts/test-groq-pipeline.mjs
 */

import { readFileSync } from "fs";
import { join } from "path";
import { createRequire } from "module";
import Groq from "groq-sdk";

const require = createRequire(import.meta.url);
// pdf-parse is CJS-only, must be imported via require
const pdfParseModule = require("pdf-parse");
// Handle both module.exports = fn and module.exports = { default: fn }
const pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule.default;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("❌ Error: GROQ_API_KEY environment variable is missing.");
  process.exit(1);
}
const GROQ_MODEL = "qwen/qwen3.8-27b";

const SYSTEM_PROMPT = `You are a medical data structurer. Read the provided text and output ONLY a valid JSON object matching this exact schema, with no markdown formatting or conversational text:
{
  "topicTitle": "string - concise title of the medical topic",
  "quickSummary": "string - 2-3 sentence clinical overview",
  "keyTakeaways": ["string - one high-yield exam point per item, minimum 5 items"],
  "flashcards": [
    { "question": "string - exam-style question", "answer": "string - precise clinical answer" }
  ]
}
Provide at least 10 flashcards. Return raw JSON only. Do not wrap in markdown code blocks.`;

async function main() {
  console.log("🔬 Synapsis Groq Pipeline — Live Test\n");

  // ── 1. Load the real TORCH PDF ────────────────────────────────────────────
  const pdfPath = join(process.cwd(), "public", "pdf", "TORCH_Infections.pdf");
  console.log(`📄 Loading PDF: ${pdfPath}`);
  const pdfBuffer = readFileSync(pdfPath);
  console.log(`   Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);

  // ── 2. Extract text with pdf-parse ───────────────────────────────────────
  console.log("\n📝 Extracting text with pdf-parse...");
  const pdfData = await pdfParse(pdfBuffer);
  const rawText = pdfData.text.trim();
  console.log(`   Extracted: ${rawText.length} characters, ${pdfData.numpages} pages`);
  console.log(`   Preview: "${rawText.slice(0, 120).replace(/\n/g, " ")}..."`);

  // ── 3. Send to Groq ──────────────────────────────────────────────────────
  console.log("\n🤖 Sending to Groq (qwen/qwen3.8-27b)...");
  const groq = new Groq({ apiKey: GROQ_API_KEY });
  const truncated = rawText.slice(0, 6_000);

  const start = Date.now();
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.2,
    max_tokens: 8192,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Here is the medical textbook content to structure:\n\n${truncated}` },
    ],
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  const rawContent = completion.choices[0]?.message?.content ?? "";
  const tokensUsed = completion.usage?.total_tokens ?? 0;
  console.log(`   Done in ${elapsed}s | Tokens used: ${tokensUsed}`);

  // ── 4. Clean & Parse JSON ────────────────────────────────────────────────
  console.log("\n🧹 Parsing structured JSON response...");
  const cleanJson = rawContent
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch {
    console.error("❌ JSON parse failed. Raw output (first 500 chars):");
    console.error(rawContent.slice(0, 500));
    process.exit(1);
  }

  // ── 5. Display results ───────────────────────────────────────────────────
  console.log("\n✅ Pipeline SUCCESS — Structured Output:\n");
  console.log(`📌 Topic Title:   ${parsed.topicTitle}`);
  console.log(`📋 Quick Summary: ${parsed.quickSummary?.slice(0, 120)}...`);
  console.log(`\n🔑 Key Takeaways (${parsed.keyTakeaways?.length}):`);
  (parsed.keyTakeaways ?? []).slice(0, 5).forEach((t, i) => {
    console.log(`   ${i + 1}. ${t}`);
  });
  if (parsed.keyTakeaways?.length > 5) {
    console.log(`   ... and ${parsed.keyTakeaways.length - 5} more`);
  }
  console.log(`\n🎴 Flashcards Generated: ${parsed.flashcards?.length}`);
  const first = parsed.flashcards?.[0];
  if (first) {
    console.log(`   Q1: ${first.question}`);
    console.log(`   A1: ${first.answer?.slice(0, 100)}...`);
  }
  console.log(`\n📊 Tokens used: ${tokensUsed}`);
  console.log("\n🎉 End-to-end pipeline test COMPLETE. Ready for database migration.\n");
}

main().catch((err) => {
  console.error("\n❌ Pipeline test failed:", err.message);
  process.exit(1);
});
