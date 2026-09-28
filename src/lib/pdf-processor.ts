/**
 * PDF Processor — Core AI Pipeline Service
 *
 * Three pure, testable functions that compose the full pipeline:
 *
 *  1. extractTextFromPdfBuffer  — pdf-parse → raw text string
 *  2. structureTextWithGroq     — raw text → GroqStructuredResponse JSON
 *  3. saveStudyMaterial         — Prisma transaction → StudyMaterial + AIGeneratedContent
 *
 * Each function throws a typed error with a `code` property so the
 * API route can map it to the correct HTTP status.
 */

// pdf-parse uses CommonJS exports with no ESM default export
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string; numpages: number }>;
import { groq } from "@/lib/groq";
import { db } from "@/lib/db";
import type {
  GroqStructuredResponse,
  CreateStudyMaterialWithAI,
} from "@/types/ai-pipeline";
import { Subject } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Typed Pipeline Errors
// ─────────────────────────────────────────────────────────────────────────────

export class PipelineError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "PipelineError";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Groq model to use — qwen/qwen3.8-27b is a powerful 27B model with large context window */
const GROQ_MODEL = "qwen/qwen3.8-27b" as const;

/**
 * Minimum characters of extracted text considered "readable".
 * Below this threshold we treat the PDF as a scanned image.
 */
const MIN_READABLE_CHARS = 100;

/**
 * System prompt that forces Groq to return ONLY a valid JSON object.
 * No markdown fences, no conversational text, no trailing commas.
 */
const GROQ_SYSTEM_PROMPT = `You are a medical data structurer. Read the provided text and output ONLY a valid JSON object matching this exact schema, with no markdown formatting or conversational text:
{
  "topicTitle": "string — concise title of the medical topic",
  "quickSummary": "string — 2-3 sentence clinical overview",
  "keyTakeaways": ["string — one high-yield exam point per item, minimum 5 items"],
  "flashcards": [
    { "question": "string — exam-style question", "answer": "string — precise clinical answer" }
  ]
}
Provide at least 10 flashcards. Return raw JSON only. Do not wrap in markdown code blocks.`;

// ─────────────────────────────────────────────────────────────────────────────
// 1. PDF Text Extraction
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts raw text from a PDF file buffer using pdf-parse.
 *
 * @param buffer  - ArrayBuffer or Buffer of the uploaded PDF file
 * @returns       - Raw extracted text string
 * @throws        - PipelineError("PDF_UNREADABLE") if text is too short (scanned PDF)
 * @throws        - PipelineError("PDF_UNREADABLE") if pdf-parse itself fails
 */
export async function extractTextFromPdfBuffer(
  buffer: Buffer,
): Promise<string> {
  let data: { text: string; numpages: number };

  try {
    data = await pdfParse(buffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown pdf-parse error";
    throw new PipelineError(
      `Failed to parse PDF: ${message}`,
      "PDF_UNREADABLE",
    );
  }

  const text = data.text?.trim() ?? "";

  if (text.length < MIN_READABLE_CHARS) {
    throw new PipelineError(
      `PDF appears to be a scanned image or empty. Extracted only ${text.length} characters (minimum: ${MIN_READABLE_CHARS}). Please provide a text-based PDF.`,
      "PDF_UNREADABLE",
    );
  }

  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Groq AI Structuring
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sends raw extracted PDF text to the Groq Llama 3 model and returns
 * a structured GroqStructuredResponse JSON object.
 *
 * @param rawText - Plain text extracted from the PDF
 * @returns       - Validated GroqStructuredResponse object
 * @throws        - PipelineError("GROQ_ERROR")        if the API call fails
 * @throws        - PipelineError("GROQ_INVALID_JSON") if the response isn't valid JSON
 */
export async function structureTextWithGroq(
  rawText: string,
): Promise<{ response: GroqStructuredResponse; tokensUsed: number | null }> {
  // Truncate to ~6,000 chars for Groq free tier (8000 TPM limit).
  // Upgrade to Dev Tier at https://console.groq.com/settings/billing to raise this to 30,000+
  const truncatedText = rawText.slice(0, 6_000);

  let completion: Awaited<ReturnType<typeof groq.chat.completions.create>>;

  try {
    completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.2, // Low temperature for deterministic, factual output
      max_tokens: 8192,
      messages: [
        {
          role: "system",
          content: GROQ_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Here is the medical textbook content to structure:\n\n${truncatedText}`,
        },
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Groq API error";
    throw new PipelineError(
      `Groq API call failed: ${message}`,
      "GROQ_ERROR",
    );
  }

  const rawContent = completion.choices[0]?.message?.content ?? "";
  const tokensUsed = completion.usage?.total_tokens ?? null;

  // Strip any accidental markdown code fences the model might add
  const cleanJson = rawContent
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanJson);
  } catch {
    throw new PipelineError(
      `Groq returned non-JSON content. Raw response (first 500 chars): ${rawContent.slice(0, 500)}`,
      "GROQ_INVALID_JSON",
    );
  }

  // Runtime validation — ensure required fields are present
  const validated = validateGroqResponse(parsed);

  return { response: validated, tokensUsed };
}

/**
 * Runtime shape guard — validates the parsed JSON matches GroqStructuredResponse.
 * Throws PipelineError("GROQ_INVALID_JSON") if any required field is missing.
 */
function validateGroqResponse(raw: unknown): GroqStructuredResponse {
  if (typeof raw !== "object" || raw === null) {
    throw new PipelineError(
      "Groq response is not a JSON object.",
      "GROQ_INVALID_JSON",
    );
  }

  const obj = raw as Record<string, unknown>;

  const missingFields: string[] = [];
  if (typeof obj.topicTitle !== "string") missingFields.push("topicTitle");
  if (typeof obj.quickSummary !== "string") missingFields.push("quickSummary");
  if (!Array.isArray(obj.keyTakeaways)) missingFields.push("keyTakeaways");
  if (!Array.isArray(obj.flashcards)) missingFields.push("flashcards");

  if (missingFields.length > 0) {
    throw new PipelineError(
      `Groq response missing required fields: ${missingFields.join(", ")}`,
      "GROQ_INVALID_JSON",
    );
  }

  // Validate flashcard structure
  const flashcards = obj.flashcards as unknown[];
  for (const [i, card] of flashcards.entries()) {
    if (
      typeof card !== "object" ||
      card === null ||
      typeof (card as Record<string, unknown>).question !== "string" ||
      typeof (card as Record<string, unknown>).answer !== "string"
    ) {
      throw new PipelineError(
        `Groq flashcard at index ${i} is missing 'question' or 'answer' string fields.`,
        "GROQ_INVALID_JSON",
      );
    }
  }

  return {
    topicTitle: obj.topicTitle as string,
    quickSummary: obj.quickSummary as string,
    keyTakeaways: (obj.keyTakeaways as unknown[]).map(String),
    flashcards: flashcards as GroqStructuredResponse["flashcards"],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Prisma Persistence (Atomic Transaction)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Persists a StudyMaterial and its linked AIGeneratedContent in a single
 * Prisma interactive transaction. Either both records are created or neither.
 *
 * @param data - Validated data from the request + Groq response
 * @returns    - The created StudyMaterial with nested aiContent
 * @throws     - PipelineError("DB_ERROR") if the transaction fails
 */
export async function saveStudyMaterial(data: CreateStudyMaterialWithAI) {
  const {
    title,
    subject,
    uploadedById,
    organizationId,
    fileSizeBytes,
    aiContent,
    modelUsed,
    tokensUsed,
  } = data;

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Create the parent StudyMaterial record
      const studyMaterial = await tx.studyMaterial.create({
        data: {
          title,
          subject: subject as Subject,
          // encryptedFileUrl is required by schema — use a placeholder until
          // cloud storage integration is added. In a real deployment this
          // would be the cloud object path after uploading the encrypted file.
          encryptedFileUrl: "pending-upload",
          fileSizeBytes,
          uploadedById,
          organizationId: organizationId ?? null,
          isPublic: false,
          version: 1,
          highYieldTags: [],
        },
      });

      // 2. Create the linked AIGeneratedContent record
      const aiContentRecord = await tx.aIGeneratedContent.create({
        data: {
          studyMaterialId: studyMaterial.id,
          topicTitle: aiContent.topicTitle,
          quickSummary: aiContent.quickSummary,
          keyTakeaways: aiContent.keyTakeaways,
          flashcards: aiContent.flashcards as unknown as import("@prisma/client").Prisma.InputJsonValue,
          modelUsed,
          tokensUsed: tokensUsed ?? null,
        },
      });

      return { studyMaterial, aiContentRecord };
    });

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    throw new PipelineError(
      `Database transaction failed: ${message}`,
      "DB_ERROR",
    );
  }
}
