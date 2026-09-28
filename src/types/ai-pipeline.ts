/**
 * AI Pipeline — TypeScript Interfaces
 *
 * Centralises all types used across the PDF-to-JSON processing pipeline:
 *  - Groq structured response
 *  - Prisma insert shapes
 *  - API request / response contracts
 */

// ─────────────────────────────────────────────────────────────────────────────
// Groq AI Response
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single exam-style flashcard extracted by Groq.
 */
export interface Flashcard {
  question: string;
  answer: string;
}

/**
 * The exact JSON shape that Groq must return.
 * Enforced by the system prompt in pdf-processor.ts.
 */
export interface GroqStructuredResponse {
  topicTitle: string;
  quickSummary: string;
  keyTakeaways: string[];
  flashcards: Flashcard[];
}

// ─────────────────────────────────────────────────────────────────────────────
// API Request
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parsed multipart form data received by the POST handler.
 * `subject` must be a valid value from the Prisma Subject enum.
 */
export interface ProcessPdfRequest {
  file: File;
  subject: string;
  /** Optional: caller can tag the material title; defaults to Groq's topicTitle */
  title?: string;
  /** Optional: tie to a specific organisation */
  organizationId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Prisma Insert Shape
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Data passed to the Prisma transaction that creates both
 * StudyMaterial and AIGeneratedContent in a single atomic write.
 */
export interface CreateStudyMaterialWithAI {
  title: string;
  subject: string;
  uploadedById: string;
  organizationId?: string | null;
  fileSizeBytes: number;
  aiContent: GroqStructuredResponse;
  modelUsed: string;
  tokensUsed?: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Response Contracts
// ─────────────────────────────────────────────────────────────────────────────

/** Returned on 201 Created */
export interface ProcessPdfSuccessResponse {
  success: true;
  studyMaterialId: string;
  aiContentId: string;
  topicTitle: string;
  quickSummary: string;
  keyTakeawaysCount: number;
  flashcardsCount: number;
  tokensUsed: number | null;
}

/** Returned on any error status */
export interface ProcessPdfErrorResponse {
  success: false;
  error: string;
  /** Machine-readable error code for client-side handling */
  code:
    | "UNAUTHENTICATED"
    | "FORBIDDEN"
    | "MISSING_FILE"
    | "INVALID_MIME_TYPE"
    | "FILE_TOO_LARGE"
    | "INVALID_SUBJECT"
    | "PDF_UNREADABLE"
    | "GROQ_ERROR"
    | "GROQ_INVALID_JSON"
    | "DB_ERROR"
    | "INTERNAL_ERROR";
}

export type ProcessPdfResponse =
  | ProcessPdfSuccessResponse
  | ProcessPdfErrorResponse;
