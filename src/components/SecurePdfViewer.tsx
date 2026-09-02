"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * ============================================================
 * SecurePdfViewer — Anti-Piracy PDF Rendering Component
 * ============================================================
 *
 * This component renders encrypted PDF documents using HTML5 Canvas
 * instead of the browser's native PDF viewer. This approach prevents
 * common piracy vectors (right-click save, browser print, DevTools
 * source inspection).
 *
 * SECURITY ARCHITECTURE:
 * ─────────────────────
 * 1. Server-side PDF decryption (AES-256)
 * 2. Page-by-page streaming to client (never send full PDF)
 * 3. Canvas-based rendering (no <embed>, <iframe>, or <object>)
 * 4. Dynamic watermarking with user identity
 * 5. Screenshot/screen-recording deterrence
 *
 * IMPLEMENTATION ROADMAP:
 * ──────────────────────
 * Phase 1: Canvas rendering with pdf.js
 * Phase 2: Dynamic watermark overlay
 * Phase 3: DRM & analytics integration
 */

interface SecurePdfViewerProps {
  /** The study material ID to load */
  materialId: string;
  /** Current user ID for watermarking */
  userId: string;
  /** User's display name for visible watermark */
  userName: string;
  /** Organization name for watermark */
  organizationName?: string;
}

export default function SecurePdfViewer({
  materialId,
  userId,
  userName,
  organizationName,
}: SecurePdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const watermarkCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ──────────────────────────────────────────────────────────
  // PHASE 1: HTML5 Canvas Rendering Pipeline
  // ──────────────────────────────────────────────────────────
  //
  // TODO: Implement PDF rendering using pdf.js (pdfjs-dist)
  //
  // Steps:
  // 1. Fetch encrypted PDF data from API:
  //    GET /api/materials/${materialId}/pages/${pageNumber}
  //    The API should decrypt the PDF server-side and return
  //    individual page data (never the full document).
  //
  // 2. Initialize pdf.js with custom worker:
  //    ```
  //    import * as pdfjsLib from 'pdfjs-dist';
  //    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  //    const pdf = await pdfjsLib.getDocument({ data: decryptedData }).promise;
  //    ```
  //
  // 3. Render each page to canvas:
  //    ```
  //    const page = await pdf.getPage(pageNumber);
  //    const viewport = page.getViewport({ scale: window.devicePixelRatio });
  //    const context = canvas.getContext('2d');
  //    await page.render({ canvasContext: context, viewport }).promise;
  //    ```
  //
  // 4. CRITICAL: Render as IMAGE data to canvas, not as selectable text.
  //    Do NOT use the TextLayer — it would allow copy-paste of content.
  //    If search functionality is needed, implement it server-side.
  //
  // ──────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────
  // PHASE 2: Dynamic User Watermarking
  // ──────────────────────────────────────────────────────────
  //
  // TODO: Overlay a semi-transparent watermark on the canvas
  //
  // The watermark should contain:
  // - User's full name
  // - User's unique ID (for tracing leaked content)
  // - Organization name
  // - Current timestamp (ISO format)
  // - Session fingerprint
  //
  // Implementation approach:
  // ```
  // function renderWatermark(ctx: CanvasRenderingContext2D) {
  //   ctx.save();
  //   ctx.globalAlpha = 0.06; // Nearly invisible but detectable
  //   ctx.font = '16px Inter, sans-serif';
  //   ctx.fillStyle = '#000000';
  //   ctx.rotate(-30 * Math.PI / 180); // Diagonal watermark
  //
  //   const watermarkText = `${userName} | ${userId} | ${new Date().toISOString()}`;
  //
  //   // Tile the watermark across the entire canvas
  //   for (let y = -canvas.height; y < canvas.height * 2; y += 120) {
  //     for (let x = -canvas.width; x < canvas.width * 2; x += 400) {
  //       ctx.fillText(watermarkText, x, y);
  //     }
  //   }
  //
  //   ctx.restore();
  // }
  // ```
  //
  // IMPORTANT: The watermark must be rendered ONTO the same canvas
  // as the PDF content, not as a separate overlay div. A div overlay
  // can be removed via DevTools. Canvas compositing cannot be reversed.
  //
  // ──────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────
  // PHASE 3: Anti-Screenshot & Anti-Print Measures
  // ──────────────────────────────────────────────────────────
  //
  // CSS-based deterrence (applied via className below):
  // - Disable text selection (user-select: none)
  // - Disable touch callout (for iOS long-press)
  // - Disable drag (prevents drag-to-desktop)
  //
  // JavaScript-based deterrence:
  // - Block right-click context menu
  // - Block Ctrl+P / Cmd+P print shortcut
  // - Block Ctrl+S / Cmd+S save shortcut
  // - Block PrintScreen key
  // - Detect visibility change (tab switch → pause rendering)
  // - Detect DevTools open (heuristic-based)
  //
  // NOTE: These are DETERRENTS, not guarantees. Determined users
  // can always capture screen content. The watermark is the real
  // protection — it makes leaked content traceable.
  //
  // ──────────────────────────────────────────────────────────

  /**
   * Keyboard shortcut blocker
   * Prevents common save/print/screenshot shortcuts
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Block Ctrl+P (Print), Ctrl+S (Save), Ctrl+Shift+I (DevTools)
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "p" || e.key === "s" || (e.shiftKey && e.key === "I"))
    ) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Block PrintScreen
    if (e.key === "PrintScreen") {
      e.preventDefault();
      // TODO: Flash a warning overlay or blank the canvas briefly
    }
  }, []);

  /**
   * Context menu (right-click) blocker
   */
  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  /**
   * Visibility change handler
   * When user switches tabs or minimizes, pause sensitive rendering
   */
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // TODO: Pause canvas rendering or show a placeholder
      // This prevents screen-recording tools from capturing content
      // when the user has switched away
    } else {
      // TODO: Resume rendering
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleKeyDown, handleContextMenu, handleVisibilityChange]);

  // ──────────────────────────────────────────────────────────
  // TODO: Initialize PDF loading and rendering here
  //
  // useEffect(() => {
  //   async function loadAndRender() {
  //     const response = await fetch(`/api/materials/${materialId}/render`, {
  //       credentials: 'include',
  //       headers: { 'X-Session-Fingerprint': getFingerprint() }
  //     });
  //     const encryptedData = await response.arrayBuffer();
  //     // ... decrypt and render to canvas
  //   }
  //   loadAndRender();
  // }, [materialId]);
  //
  // ──────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="no-select relative flex h-full w-full flex-col items-center justify-center bg-surface-900"
      style={{
        // Additional CSS-based anti-screenshot measures
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {/* ── Main PDF Canvas ── */}
      {/* This canvas will render the PDF page content */}
      <canvas
        ref={canvasRef}
        id="secure-pdf-canvas"
        className="max-h-full max-w-full"
        style={{
          // Prevent image dragging
          WebkitUserDrag: "none",
          pointerEvents: "none",
        } as React.CSSProperties}
      />

      {/* ── Watermark Canvas (Composite Layer) ── */}
      {/* 
        This canvas overlays the PDF canvas with the user watermark.
        In production, merge this directly onto the PDF canvas context
        so the watermark cannot be removed by hiding this element.
      */}
      <canvas
        ref={watermarkCanvasRef}
        id="secure-watermark-canvas"
        className="pointer-events-none absolute inset-0"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* ── Placeholder UI ── */}
      {/* Remove this once PDF rendering is implemented */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600/20">
          <svg
            className="h-8 w-8 text-primary-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Secure PDF Viewer
          </h3>
          <p className="mt-1 text-sm text-surface-400">
            Canvas-based rendering with dynamic watermarking
          </p>
          <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-xs text-surface-500">
            Material: {materialId} • User: {userName}
            {organizationName && ` • Org: ${organizationName}`}
          </p>
        </div>
      </div>

      {/* ── Print blocking CSS ── */}
      <style jsx>{`
        @media print {
          div {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
