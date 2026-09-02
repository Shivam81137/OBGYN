"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Sparkles, Activity, WifiOff, DownloadCloud, Brain, BookOpen, Layers, CheckCircle } from "lucide-react";

export default function FeatureShowcase() {
  const [activeSubject, setActiveSubject] = useState("Pharmacology");
  const [activeTab, setActiveTab] = useState<"materials" | "analytics" | "offline">("materials");

  const subjects = ["Pharmacology", "Anatomy", "Pathology", "Biochemistry", "Microbiology"];

  return (
    <section id="features" className="relative py-28 overflow-hidden bg-obsidian-950/90">
      {/* Background Glow Accents */}
      <div className="pointer-events-none absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>NEURAL ECOSYSTEM CAPABILITIES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl sm:text-5xl font-black text-white tracking-tight"
          >
            Engineered for{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Unrivaled Retention.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400"
          >
            Every feature in Synapsis is optimized for high-yield exam performance, 
            enterprise-grade content security, and seamless offline studying.
          </motion.p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: High-Yield Encrypted Study Materials (Lg: 7 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-obsidian-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/40 hover:shadow-glow-cyan"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                  AES-256 DRM Protected
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Encrypted High-Yield Study Materials
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Stream encrypted medical PDFs rendered directly via HTML5 Canvas. Dynamic user 
                watermarking prevents piracy while crisp vector rendering provides effortless zooming.
              </p>

              {/* Subject Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {subjects.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setActiveSubject(subj)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      activeSubject === subj
                        ? "bg-cyan-500 text-obsidian-950 font-bold shadow-glow-cyan"
                        : "bg-obsidian-950/80 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Canvas PDF Viewer Security Preview */}
            <div className="mt-8 rounded-2xl border border-slate-800 bg-obsidian-950 p-4 relative overflow-hidden">
              {/* Dynamic Watermark Overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15 rotate-[-25deg] select-none text-xs font-mono text-cyan-400 tracking-widest uppercase">
                SYNAPSIS DRM • DR. ALEX VANCE • ID: SYN-94021 • {new Date().toLocaleDateString()}
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-semibold text-slate-200">{activeSubject} — High Yield Summary.pdf</span>
                </div>
                <span className="text-[0.65rem] bg-slate-800 px-2 py-0.5 rounded text-cyan-300">Page 14 of 48</span>
              </div>

              <div className="mt-4 space-y-2.5 text-left text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="font-bold text-cyan-300 mb-1">Key Mechanism of Action</div>
                  <p className="text-slate-400 leading-normal">
                    Reversible competitive inhibition of HMG-CoA reductase, leading to upregulation of LDL receptors and accelerated clearance of plasma LDL cholesterol.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[0.7rem] text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>NEET PG High Yield Tag: 14 Questions asked in last 5 years</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Advanced Exam Analytics (Lg: 5 columns) */}
          <motion.div
            id="analytics"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-obsidian-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:border-purple-500/40 hover:shadow-glow-violet"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-400/30 text-purple-400">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-purple-500/10 border border-purple-400/20 px-3 py-1 text-xs font-semibold text-purple-300">
                  Neural Diagnostic Radar
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Predictive Exam Analytics
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Pinpoint weak topics before the exam with AI percentile predictors, time-per-question velocity metrics, and customized revision triggers.
              </p>
            </div>

            {/* Live Heatmap Preview */}
            <div className="mt-8 rounded-2xl border border-slate-800 bg-obsidian-950 p-5 space-y-4">
              <div className="text-xs font-bold text-slate-300 flex justify-between">
                <span>SUBJECT MASTERY DIAGNOSTIC</span>
                <span className="text-purple-400">92.4% Accuracy</span>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Pharmacology (Autonomic & CNS)</span>
                    <span className="text-emerald-400 font-semibold">96%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[96%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Pathology (Neoplasia & Hematology)</span>
                    <span className="text-cyan-400 font-semibold">88%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>General Surgery & Trauma</span>
                    <span className="text-amber-400 font-semibold">64% (Weak Spot)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[64%]" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                <span className="font-bold text-purple-300">AI Recommendation: </span>
                Solve 25 targeted IBQs in General Surgery to boost your predicted rank by ~320 positions.
              </div>
            </div>
          </motion.div>

          {/* Card 3: Zero-Latency Offline Access Engine (Lg: 5 columns) */}
          <motion.div
            id="offline"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-obsidian-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:border-blue-500/40 hover:shadow-glow-cyan"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-400">
                  <WifiOff className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-blue-500/10 border border-blue-400/20 px-3 py-1 text-xs font-semibold text-blue-300">
                  Serwist PWA Engine
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Zero-Latency Offline Access
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Study anywhere — in hospital wards, libraries, or during commutes. Pre-cache entire question banks and study modules locally with instant offline sync.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-obsidian-950 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white">PWA Offline Cache Active</div>
                  <div className="text-slate-400">3.4 GB Study Materials & 8,000 Questions Offline Ready</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Active Recall & Spaced Repetition (Lg: 7 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7 group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-obsidian-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/40 hover:shadow-glow-cyan"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                  <Brain className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                  Active Recall Algorithm
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Spaced Repetition & High-Yield QBank
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Smart flashcards automatically adapt to your memory decay curve. Difficult concepts reappear right before you forget them, solidifying long-term memory.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="p-4 rounded-2xl border border-slate-800 bg-obsidian-950">
                <div className="text-xs text-cyan-400 font-bold mb-1">NBE CLINICAL CASE</div>
                <p className="text-xs text-slate-300 leading-snug">
                  A 45-year-old male presents with sudden severe chest pain radiating to the back. CT angiogram shows aortic dissection...
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-[0.65rem] text-cyan-300 border border-cyan-500/30">Anatomy + Surgery</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-obsidian-950 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-purple-400 font-bold mb-1">IMAGE-BASED QUESTION (IBQ)</div>
                  <p className="text-xs text-slate-400">High-resolution histopathology slides with interactive zoom & pinpoint labels.</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Recall Status</span>
                  <span className="text-emerald-400 font-bold">Mastered (Interval: 14 Days)</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
