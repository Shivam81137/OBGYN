"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Stethoscope, ArrowRight, Sparkles, Paperclip, FileText, X, BrainCircuit, FileSearch, HelpCircle } from "lucide-react";

// Lazy-load the 3D canvas — never blocks initial paint
const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function HeroSection() {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAiSubmit = async () => {
    if (!aiQuery.trim() && !attachedFile) return;
    setIsAiLoading(true);
    setAiResponse(null);
    
    try {
      let finalQuery = aiQuery;
      if (attachedFile) {
        finalQuery = `[Context: User attached a file named ${attachedFile.name}] ${aiQuery || 'Please summarize this document.'}`;
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: finalQuery }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setAiResponse(data.response);
      } else {
        setAiResponse(`Error: ${data.error || "Failed to fetch AI response."}`);
      }
    } catch (error) {
      setAiResponse("Network error. Could not connect to AI.");
    } finally {
      setIsAiLoading(false);
    }
  };
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 pt-8 pb-14 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* 3D Canvas Background — renders behind everything */}
      <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8" style={{ left: "calc(-50vw + 50%)", right: "calc(-50vw + 50%)", width: "100vw" }}>
        <HeroCanvas />
      </div>

      {/* Glassmorphism Content Overlay */}
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Hero Headline Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center space-y-4 glass rounded-3xl p-8 sm:p-12"
        >
          {/* Subtle pill badge */}
          <div className="inline-flex items-center gap-2 glass-pill rounded-full px-3.5 py-1 text-xs font-bold text-zinc-800 dark:text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Clinical Obstetrics &amp; Gynecology • High-Yield Masterclass
          </div>

          {/* Minimal Powerful Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            Conceptual <span className="text-cyan-600 dark:text-cyan-400">OBGYN</span>
          </h1>

          {/* Short, punchy tagline */}
          <p className="text-lg sm:text-2xl font-extrabold text-zinc-700 dark:text-cyan-400 max-w-2xl mx-auto tracking-wide">
            Ready to revise.
          </p>

          {/* High Yield Module Shortcut Badge */}
          <div className="pt-2">
            <Link
              href="/torch-infections"
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-black dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-cyan-300 dark:text-black" />
              <span>New High-Yield Module: TORCH Infections 3D</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Pathway Hub — Below Hero with Glassmorphism Cards */}
      <div id="pathway" className="relative z-10 mt-10 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">

          {/* PATH 1: NEET UG */}
          <div className="block flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="h-full group cursor-pointer glass-card-premium p-6 sm:p-8 transition-all hover:border-cyan-500/50 dark:hover:border-cyan-400/40 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100/80 text-zinc-900 dark:bg-cyan-950/60 dark:text-cyan-400 border border-zinc-200/60 dark:border-cyan-900/50 backdrop-blur-sm">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <span className="rounded-full glass-pill px-3 py-1 text-[0.7rem] font-black uppercase text-zinc-700 dark:text-zinc-300">
                    Pre-Med
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-black text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  NEET UG
                </h2>
                <p className="mt-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  Class 11, 12 &amp; Dropper Aspirants
                </p>
                <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  NCERT line-by-line active recall, 3D biology diagrams, and 15,000+ targeted pre-med questions.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem] text-zinc-600 dark:text-zinc-400 font-bold">
                  <span className="rounded-md glass-pill px-2 py-0.5">Biology</span>
                  <span className="rounded-md glass-pill px-2 py-0.5">Chemistry</span>
                  <span className="rounded-md glass-pill px-2 py-0.5">Physics</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* PATH 2: NEET PG */}
          <div className="block flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              whileHover={{ y: -4 }}
              className="h-full group cursor-pointer glass-card-premium p-6 sm:p-8 transition-all hover:border-cyan-500/50 dark:hover:border-cyan-400/40 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100/80 text-zinc-900 dark:bg-cyan-950/60 dark:text-cyan-400 border border-zinc-200/60 dark:border-cyan-900/50 backdrop-blur-sm">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <span className="rounded-full glass-pill px-3 py-1 text-[0.7rem] font-black uppercase text-zinc-700 dark:text-zinc-300">
                    MBBS &amp; Interns
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-black text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  NEET PG
                </h2>
                <p className="mt-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  Postgraduate &amp; INI-CET Aspirants
                </p>
                <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  All 19 medical subjects, NBE clinical vignettes, image-based questions, and DRM encrypted notes.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem] text-zinc-600 dark:text-zinc-400 font-bold">
                  <span className="rounded-md glass-pill px-2 py-0.5">19 Subjects</span>
                  <span className="rounded-md glass-pill px-2 py-0.5">NBE Clinical</span>
                  <span className="rounded-md glass-pill px-2 py-0.5">IBQs</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= AI ASK BAR (Gemini Style) ================= */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="group relative rounded-3xl border border-zinc-200/50 dark:border-cyan-900/30 glass-card-premium p-6 sm:p-8 transition-all hover:border-cyan-500/30 dark:hover:border-cyan-400/30 shadow-xl"
        >
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Ask OBGYN AI</h3>
            </div>

            <div className="relative mt-2">
              {/* Attached File Badge */}
              {attachedFile && (
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm backdrop-blur-md">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-4 w-4 shrink-0 text-cyan-500" />
                    <span className="truncate font-medium text-cyan-700 dark:text-cyan-300">
                      {attachedFile.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setAttachedFile(null)}
                    className="ml-2 rounded-full p-1 text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <textarea
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder={attachedFile ? "Ask a question about this document..." : "Ask a medical question, search for a concept, or try 'Explain the menstrual cycle'..."}
                className={`w-full min-h-[140px] resize-none rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 p-5 pb-16 text-base text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-inner backdrop-blur-md transition-all ${attachedFile ? 'pt-16' : ''}`}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setAttachedFile(e.target.files[0]);
                      }
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    accept="application/pdf"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    title="Attach PDF Document"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleAiSubmit}
                  disabled={isAiLoading || (!aiQuery.trim() && !attachedFile)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 dark:bg-cyan-500 text-white dark:text-zinc-950 shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  title="Send Question"
                >
                  {isAiLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white dark:border-zinc-950 border-t-transparent" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Action Prompts */}
            <div className="flex flex-wrap gap-2 mt-1">
              <button
                onClick={() => setAiQuery("Test my knowledge! Ask me 3 tough MCQs on OBGYN.")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <BrainCircuit className="h-3.5 w-3.5 text-blue-500" />
                Quiz Me
              </button>
              <button
                onClick={() => setAiQuery("Can you summarize the attached PDF document into key high-yield takeaways?")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <FileSearch className="h-3.5 w-3.5 text-purple-500" />
                Summarize Notes
              </button>
              <button
                onClick={() => setAiQuery("What are the most frequently asked topics in NEET PG Surgery?")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
                Exam Tips
              </button>
            </div>

            {/* AI Response Area */}
            <AnimatePresence>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-950/20 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">AI Response</span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">
                      {aiResponse}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-500 font-medium">
              This is a live demo — no login required to test the AI.
            </p>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
