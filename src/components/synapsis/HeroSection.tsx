"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Stethoscope, ArrowRight, Activity, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative px-4 pt-8 pb-14 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Headline Area */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-zinc-100/90 px-3.5 py-1 text-xs font-bold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-cyan-400 shadow-sm">
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
      </div>

      {/* =========================================================================
         IMMEDIATE ONE-CLICK PATHWAY HUB (NEET UG / NEET PG) — NO SCROLL REQUIRED
         ========================================================================= */}
      <div id="pathway" className="mt-10 max-w-4xl mx-auto">
        {/* Two Massive Elegantly Simple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          
          {/* PATH 1: NEET UG — Direct 1-Click Launch to /dashboard */}
          <Link href="/dashboard" className="block flex flex-col">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full group cursor-pointer rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:border-cyan-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-cyan-400 dark:hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 dark:bg-cyan-950/60 dark:text-cyan-400 border border-zinc-200 dark:border-cyan-900/50">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[0.7rem] font-black uppercase text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
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

                {/* Quick Feature Chips */}
                <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem] text-zinc-600 dark:text-zinc-400 font-bold">
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">Biology</span>
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">Chemistry</span>
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">Physics</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* PATH 2: NEET PG — Direct 1-Click Launch to /admin/dashboard */}
          <Link href="/admin/dashboard" className="block flex flex-col">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full group cursor-pointer rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:border-cyan-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-cyan-400 dark:hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 dark:bg-cyan-950/60 dark:text-cyan-400 border border-zinc-200 dark:border-cyan-900/50">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[0.7rem] font-black uppercase text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
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

                {/* Quick Feature Chips */}
                <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem] text-zinc-600 dark:text-zinc-400 font-bold">
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">19 Subjects</span>
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">NBE Clinical</span>
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">IBQs</span>
                </div>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>
    </section>
  );
}
