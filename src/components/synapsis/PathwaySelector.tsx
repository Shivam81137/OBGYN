"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Stethoscope, Award, Flame, CheckCircle, Zap, Shield, ChevronRight } from "lucide-react";

export default function PathwaySelector() {
  const [hoveredPath, setHoveredPath] = useState<"ug" | "pg" | null>(null);
  const [selectedPath, setSelectedPath] = useState<"ug" | "pg" | null>(null);

  const handleSelectPath = (path: "ug" | "pg") => {
    setSelectedPath(path);
  };

  return (
    <section id="pathway" className="relative py-28 overflow-hidden bg-obsidian-950">
      {/* Background Ambient Glow */}
      <div
        className={`pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full transition-opacity duration-700 blur-[180px] ${
          hoveredPath === "ug" ? "opacity-40 bg-cyan-500" : "opacity-15 bg-cyan-500/20"
        }`}
      />
      <div
        className={`pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full transition-opacity duration-700 blur-[180px] ${
          hoveredPath === "pg" ? "opacity-40 bg-purple-600" : "opacity-15 bg-purple-600/20"
        }`}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-cyan-300 uppercase backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>EXAM PATHWAY SELECTOR</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Choose Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Destiny Pathway.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-xl text-slate-300 font-normal"
          >
            Tailored neural engines built exclusively for your target medical examination.
          </motion.p>
        </div>

        {/* MASSIVE SPLIT SECTION — NEET UG vs NEET PG */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ================= PATHWAY 1: NEET UG ================= */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredPath("ug")}
            onHoverEnd={() => setHoveredPath(null)}
            className={`group relative flex flex-col justify-between rounded-4xl border p-8 sm:p-12 transition-all duration-500 ${
              hoveredPath === "ug"
                ? "border-cyan-400 bg-obsidian-900/90 shadow-glow-ug scale-[1.02]"
                : "border-slate-800 bg-obsidian-900/50 hover:border-cyan-500/60"
            }`}
          >
            {/* Top Badge */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 shadow-glow-cyan">
                  <BookOpen className="h-8 w-8" />
                </div>
                <span className="rounded-full bg-cyan-500/20 px-4 py-1.5 text-xs font-black tracking-wider text-cyan-300 border border-cyan-400/40 uppercase">
                  CLASS 11, 12 & DROPPERS
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-8 text-3xl sm:text-5xl font-black text-white group-hover:text-cyan-300 transition-colors">
                NEET UG
              </h3>
              <p className="mt-2 text-sm sm:text-base font-semibold text-cyan-400/90">
                Undergraduate Pre-Medical Entrance Engine
              </p>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Complete 720/720 targeted prep with NCERT line-by-line active recall, 3D anatomical cell visualizations, formula synapses, and real-time mock test rankings.
              </p>

              {/* Feature Highlights List */}
              <div className="mt-8 space-y-3 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span>Biology, Physics & Chemistry NCERT Extraction</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span>15,000+ NCERT-Based High-Yield Questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span>Real-time All-India Mock Test Percentile Predictor</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-12">
              <button
                onClick={() => handleSelectPath("ug")}
                className={`w-full group/btn relative flex items-center justify-center gap-3 rounded-2xl py-5 px-8 text-lg font-extrabold transition-all duration-300 ${
                  hoveredPath === "ug"
                    ? "bg-cyan-400 text-obsidian-950 shadow-glow-cyan"
                    : "bg-slate-800 text-white hover:bg-cyan-500 hover:text-obsidian-950"
                }`}
              >
                <span>Launch NEET UG Pathway</span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover/btn:translate-x-2" />
              </button>
            </div>
          </motion.div>

          {/* ================= PATHWAY 2: NEET PG ================= */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredPath("pg")}
            onHoverEnd={() => setHoveredPath(null)}
            className={`group relative flex flex-col justify-between rounded-4xl border p-8 sm:p-12 transition-all duration-500 ${
              hoveredPath === "pg"
                ? "border-purple-400 bg-obsidian-900/90 shadow-glow-pg scale-[1.02]"
                : "border-slate-800 bg-obsidian-900/50 hover:border-purple-500/60"
            }`}
          >
            {/* Top Badge */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-500/10 border border-purple-400/40 text-purple-400 shadow-glow-violet">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <span className="rounded-full bg-purple-500/20 px-4 py-1.5 text-xs font-black tracking-wider text-purple-300 border border-purple-400/40 uppercase">
                  MBBS GRADUATES & INTERNS
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-8 text-3xl sm:text-5xl font-black text-white group-hover:text-purple-300 transition-colors">
                NEET PG
              </h3>
              <p className="mt-2 text-sm sm:text-base font-semibold text-purple-400/90">
                Postgraduate Medical & INI-CET Mastery Engine
              </p>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Master all 19 medical subjects with NBE clinical vignette QBanks, high-resolution Image-Based Questions (IBQs), and automated spaced repetition flashcards.
              </p>

              {/* Feature Highlights List */}
              <div className="mt-8 space-y-3 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span>All 19 Subjects Covered (Pre, Para & Clinical)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span>NBE Clinical Vignette & Image-Based Questions (IBQs)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <span>AES-256 Encrypted High-Yield Clinical PDF Modules</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-12">
              <button
                onClick={() => handleSelectPath("pg")}
                className={`w-full group/btn relative flex items-center justify-center gap-3 rounded-2xl py-5 px-8 text-lg font-extrabold transition-all duration-300 ${
                  hoveredPath === "pg"
                    ? "bg-purple-500 text-white shadow-glow-violet"
                    : "bg-slate-800 text-white hover:bg-purple-600"
                }`}
              >
                <span>Launch NEET PG Pathway</span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover/btn:translate-x-2" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Interactive Selection Confirmation Modal */}
      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/90 p-4 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`max-w-md w-full rounded-3xl border p-8 text-center shadow-2xl ${
                selectedPath === "ug"
                  ? "border-cyan-400 bg-obsidian-900 shadow-glow-ug"
                  : "border-purple-400 bg-obsidian-900 shadow-glow-pg"
              }`}
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white ${
                  selectedPath === "ug" ? "bg-cyan-500 shadow-glow-cyan" : "bg-purple-600 shadow-glow-violet"
                }`}
              >
                {selectedPath === "ug" ? <BookOpen className="h-8 w-8" /> : <Stethoscope className="h-8 w-8" />}
              </div>

              <h3 className="mt-6 text-2xl font-black text-white">
                {selectedPath === "ug" ? "NEET UG Pathway Selected" : "NEET PG Pathway Selected"}
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Initializing your Synaptic Learning Engine for{" "}
                <span className="font-bold text-white uppercase">
                  {selectedPath === "ug" ? "Pre-Medical 720 Prep" : "Postgraduate Medical 19 Subjects"}
                </span>.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-obsidian-950 border border-slate-800 text-xs text-slate-400">
                ⚡ Neural adaptive models loading • DRM keys validated
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setSelectedPath(null)}
                  className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-300 hover:text-white"
                >
                  Change Path
                </button>
                <a
                  href={selectedPath === "ug" ? "/dashboard" : "/admin/dashboard"}
                  className={`flex-1 rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-1 ${
                    selectedPath === "ug" ? "bg-cyan-500 text-obsidian-950 font-extrabold" : "bg-purple-600"
                  }`}
                >
                  Proceed Now
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
