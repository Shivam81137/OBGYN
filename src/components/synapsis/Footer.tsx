"use client";

import { Activity, ShieldCheck, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/90 bg-white py-12 dark:border-zinc-800/80 dark:bg-black transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black font-extrabold">
              <Activity className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-zinc-900 dark:text-white leading-tight">
                Conceptual OBGYN
              </span>
              <span className="text-[0.62rem] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Ready to revise
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-zinc-500 dark:text-zinc-400">
            <a href="#pathway" className="hover:text-zinc-900 dark:hover:text-white transition-colors">NEET UG</a>
            <a href="#pathway" className="hover:text-zinc-900 dark:hover:text-white transition-colors">NEET PG</a>
            <a href="/torch-infections" className="hover:text-zinc-900 dark:hover:text-white transition-colors">TORCH 3D</a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 font-medium gap-4">
          <p>© {new Date().getFullYear()} Conceptual OBGYN. Ready to revise — Built for medical aspirants and doctors.</p>
          <div className="flex items-center gap-2 font-bold text-zinc-500 dark:text-zinc-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Systems Operational • PWA Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
