"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { GraduationCap, Stethoscope, ArrowRight, Sparkles } from "lucide-react";

// Lazy-load the 3D canvas — never blocks initial paint
const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function HeroSection() {
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
          <Link href="/dashboard" className="block flex flex-col">
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
          </Link>

          {/* PATH 2: NEET PG */}
          <Link href="/admin/dashboard" className="block flex flex-col">
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
          </Link>
        </div>
      </div>
    </section>
  );
}
