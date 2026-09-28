import Groq from "groq-sdk";

/**
 * Groq Client Singleton
 *
 * Mirrors the pattern of src/lib/db.ts to avoid instantiating
 * multiple SDK clients during Next.js hot-reloads in development.
 *
 * Requires GROQ_API_KEY in environment variables.
 * Obtain a free key at: https://console.groq.com
 */

const globalForGroq = globalThis as unknown as {
  groq: Groq | undefined;
};

export const groq =
  globalForGroq.groq ??
  new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

if (process.env.NODE_ENV !== "production") globalForGroq.groq = groq;
