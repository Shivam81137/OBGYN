/**
 * POST /api/study-materials/process-pdf
 *
 * Accepts a multipart/form-data PDF upload, runs it through the
 * Groq AI pipeline, and persists the structured output to PostgreSQL.
 *
 * Guards:
 *  - NextAuth JWT session required (401 if not authenticated)
 *  - ADMIN or DOCTOR role required (403 if wrong role)
 *
 * Form fields:
 *  - file     (required) — PDF file, max 10MB
 *  - subject  (required) — must be a valid Subject enum value
 *  - title    (optional) — defaults to Groq's extracted topicTitle
 *  - organizationId (optional) — ties the material to a specific org
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  extractTextFromPdfBuffer,
  structureTextWithGroq,
  saveStudyMaterial,
  PipelineError,
} from "@/lib/pdf-processor";
import { Subject } from "@prisma/client";
import type {
  ProcessPdfSuccessResponse,
  ProcessPdfErrorResponse,
} from "@/types/ai-pipeline";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Roles permitted to upload and process study materials */
const ALLOWED_ROLES = ["ADMIN", "DOCTOR"] as const;

/** Maximum PDF size: 10 MB */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Valid Subject enum values — derived at runtime from the Prisma enum object */
const VALID_SUBJECTS = new Set(Object.values(Subject));

// ─────────────────────────────────────────────────────────────────────────────
// Route segment config — disable Next.js body parsing for multipart uploads
// ─────────────────────────────────────────────────────────────────────────────
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// Helper — typed error response factory
// ─────────────────────────────────────────────────────────────────────────────

function errorResponse(
  status: number,
  code: ProcessPdfErrorResponse["code"],
  error: string,
): NextResponse<ProcessPdfErrorResponse> {
  return NextResponse.json({ success: false, code, error }, { status });
}

// ─────────────────────────────────────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ProcessPdfSuccessResponse | ProcessPdfErrorResponse>> {
  // ── 1. Authentication ──────────────────────────────────────────────────────
  const session = await auth();

  if (!session?.user?.id) {
    return errorResponse(
      401,
      "UNAUTHENTICATED",
      "You must be signed in to process study materials.",
    );
  }

  // ── 2. Authorisation — ADMIN or DOCTOR only ────────────────────────────────
  const userRole = session.user.role as string;
  if (!ALLOWED_ROLES.includes(userRole as (typeof ALLOWED_ROLES)[number])) {
    return errorResponse(
      403,
      "FORBIDDEN",
      `Access denied. Required roles: ${ALLOWED_ROLES.join(", ")}. Your role: ${userRole}.`,
    );
  }

  // ── 3. Parse multipart form data ───────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse(
      400,
      "MISSING_FILE",
      "Request body must be multipart/form-data.",
    );
  }

  const file = formData.get("file");
  const subjectField = formData.get("subject");
  const titleField = formData.get("title");
  const organizationIdField = formData.get("organizationId");

  // ── 4. Validate — file presence ────────────────────────────────────────────
  if (!file || !(file instanceof File)) {
    return errorResponse(
      400,
      "MISSING_FILE",
      "A PDF file is required. Send it as a form field named 'file'.",
    );
  }

  // ── 5. Validate — MIME type ────────────────────────────────────────────────
  if (file.type !== "application/pdf") {
    return errorResponse(
      400,
      "INVALID_MIME_TYPE",
      `Only PDF files are accepted. Received: '${file.type}'.`,
    );
  }

  // ── 6. Validate — file size ────────────────────────────────────────────────
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return errorResponse(
      400,
      "FILE_TOO_LARGE",
      `File too large: ${sizeMB} MB. Maximum allowed size is 10 MB.`,
    );
  }

  // ── 7. Validate — subject field ────────────────────────────────────────────
  const subject = typeof subjectField === "string" ? subjectField.trim() : "";

  if (!subject || !VALID_SUBJECTS.has(subject as Subject)) {
    return errorResponse(
      400,
      "INVALID_SUBJECT",
      `Invalid or missing 'subject' field. Must be one of: ${[...VALID_SUBJECTS].join(", ")}.`,
    );
  }

  // ── 8. Convert File to Node Buffer ─────────────────────────────────────────
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // ── 9. Extract text from PDF ───────────────────────────────────────────────
  let rawText: string;
  try {
    rawText = await extractTextFromPdfBuffer(buffer);
  } catch (err) {
    if (err instanceof PipelineError && err.code === "PDF_UNREADABLE") {
      return errorResponse(422, "PDF_UNREADABLE", err.message);
    }
    return errorResponse(500, "INTERNAL_ERROR", "Unexpected error during PDF extraction.");
  }

  // ── 10. Send to Groq for AI structuring ────────────────────────────────────
  let groqResponse: Awaited<ReturnType<typeof structureTextWithGroq>>;
  try {
    groqResponse = await structureTextWithGroq(rawText);
  } catch (err) {
    if (err instanceof PipelineError) {
      if (err.code === "GROQ_ERROR") {
        return errorResponse(502, "GROQ_ERROR", err.message);
      }
      if (err.code === "GROQ_INVALID_JSON") {
        return errorResponse(502, "GROQ_INVALID_JSON", err.message);
      }
    }
    return errorResponse(500, "INTERNAL_ERROR", "Unexpected error during AI processing.");
  }

  const { response: aiContent, tokensUsed } = groqResponse;

  // ── 11. Persist to database ────────────────────────────────────────────────
  const title =
    typeof titleField === "string" && titleField.trim()
      ? titleField.trim()
      : aiContent.topicTitle;

  const organizationId =
    typeof organizationIdField === "string" && organizationIdField.trim()
      ? organizationIdField.trim()
      : (session.user.organizationId ?? null);

  let saved: Awaited<ReturnType<typeof saveStudyMaterial>>;
  try {
    saved = await saveStudyMaterial({
      title,
      subject,
      uploadedById: session.user.id,
      organizationId,
      fileSizeBytes: file.size,
      aiContent,
      modelUsed: "qwen/qwen3.8-27b",
      tokensUsed,
    });
  } catch (err) {
    if (err instanceof PipelineError && err.code === "DB_ERROR") {
      return errorResponse(500, "DB_ERROR", err.message);
    }
    return errorResponse(500, "INTERNAL_ERROR", "Unexpected error saving to database.");
  }

  // ── 12. Return 201 success ─────────────────────────────────────────────────
  const successPayload: ProcessPdfSuccessResponse = {
    success: true,
    studyMaterialId: saved.studyMaterial.id,
    aiContentId: saved.aiContentRecord.id,
    topicTitle: aiContent.topicTitle,
    quickSummary: aiContent.quickSummary,
    keyTakeawaysCount: aiContent.keyTakeaways.length,
    flashcardsCount: aiContent.flashcards.length,
    tokensUsed,
  };

  return NextResponse.json(successPayload, { status: 201 });
}
