"use client";

import { Activity } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/90 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-black/90 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-cyan-400 dark:text-black font-extrabold">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
              Conceptual OBGYN
            </span>
            <span className="text-[0.62rem] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Ready to revise
            </span>
          </div>
        </a>

        {/* Right Section: Theme Toggle & Sign In */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <a
            href="/login"
            className="hidden text-xs sm:text-sm font-bold text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white sm:block"
          >
            Sign In
          </a>

          <a
            href="#pathway"
            className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-black dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 active:scale-95"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
