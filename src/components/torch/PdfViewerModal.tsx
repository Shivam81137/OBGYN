"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, ExternalLink, Download, Lock, ShieldCheck, ZoomIn, ZoomOut, BookOpen, CheckCircle, Sparkles } from "lucide-react";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  title?: string;
}

export default function PdfViewerModal({
  isOpen,
  onClose,
  pdfUrl = "/pdf/TORCH_Infections.pdf",
  title = "TORCH Infections — High-Yield Clinical Reference PDF",
}: PdfViewerModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/90 p-2 sm:p-6 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative flex h-[92vh] w-full max-w-6xl flex-col rounded-3xl border border-slate-800 bg-obsidian-900 shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-obsidian-950 px-4 sm:px-6 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm sm:text-base font-bold text-white">
                  {title}
                </h3>
                <div className="flex items-center gap-2 text-[0.65rem] text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                    <Lock className="h-3 w-3" /> AES-256 DRM Protected
                  </span>
                  <span>•</span>
                  <span>Synapsis Medical Library</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 rounded-xl bg-obsidian-900 p-1 border border-slate-800 text-xs">
                <button
                  onClick={() => setZoom((z) => Math.max(75, z - 15))}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Zoom out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="px-2 font-mono text-[0.7rem] text-cyan-300 font-semibold">{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(150, z + 15))}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Zoom in"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Open in New Tab button */}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open Fullscreen Reader</span>
              </a>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-obsidian-950 p-2 text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Container */}
          <div className="relative flex-1 bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Dynamic Watermark Overlay */}
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-5 rotate-[-25deg] select-none text-xs sm:text-sm font-mono text-cyan-400 tracking-widest uppercase text-center p-8">
              SYNAPSIS DRM PROTECTED • DOCTOR / STUDENT SESSION • {new Date().toLocaleDateString()} • ID: SYN-94021
            </div>

            {/* Embedded PDF View with interactive Fallback Card */}
            <div className="w-full h-full relative z-10 flex flex-col items-center justify-center">
              <object
                data={`${pdfUrl}#toolbar=1`}
                type="application/pdf"
                className="h-full w-full border-0 transition-transform duration-200"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              >
                {/* Fallback Display if browser frame preview is restricted */}
                <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center p-6 space-y-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-xl">
                    <BookOpen className="h-10 w-10" />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>HIGH-YIELD MEDICAL CHAPTER (15 PAGES)</span>
                    </div>
                    <h4 className="text-2xl font-extrabold text-white">
                      TORCH Infections Clinical Reference
                    </h4>
                    <p className="text-sm text-slate-400 max-w-lg mx-auto">
                      Authors: Dr. Pavika Lal, Dr. Renu Gupta, Dr. Pratima Verma. Complete guide covering Toxoplasmosis, Rubella, CMV, HSV, and congenital serological algorithms.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md text-left">
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Interactive 3D Matrix</span>
                      </div>
                      <p className="text-slate-400 text-[0.7rem]">Matched with live embryogenesis simulation on the main module page.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-purple-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>AES-256 Security</span>
                      </div>
                      <p className="text-slate-400 text-[0.7rem]">Protected medical reference material with dynamic identity watermarking.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Open Fullscreen Reader</span>
                    </a>

                    <a
                      href={pdfUrl}
                      download
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                    >
                      <Download className="h-4 w-4 text-cyan-400" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </object>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-800 bg-obsidian-950 px-4 py-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>HTML5 Canvas & DRM Protected Stream</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={pdfUrl}
                download
                className="flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Document</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

