"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GraduationCap, Sparkles, Sun, Moon, User } from "lucide-react";

export default function MobileNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToPathway = () => {
    const el = document.getElementById("pathway");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/90 px-4 py-2 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 transition-colors duration-300">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Pathway Hub button */}
        <button
          onClick={scrollToPathway}
          className="flex flex-col items-center gap-1 rounded-xl p-2 text-slate-700 active:scale-95 dark:text-slate-300"
        >
          <GraduationCap className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
          <span className="text-[0.65rem] font-semibold">Pathways</span>
        </button>

        {/* Features button */}
        <button
          onClick={scrollToFeatures}
          className="flex flex-col items-center gap-1 rounded-xl p-2 text-slate-700 active:scale-95 dark:text-slate-300"
        >
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[0.65rem] font-semibold">Features</span>
        </button>

        {/* Theme Toggle button */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex flex-col items-center gap-1 rounded-xl p-2 text-slate-700 active:scale-95 dark:text-slate-300"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
          <span className="text-[0.65rem] font-semibold">{isDark ? "Light" : "Dark"}</span>
        </button>

        {/* Sign In link */}
        <a
          href="/login"
          className="flex flex-col items-center gap-1 rounded-xl p-2 text-slate-700 active:scale-95 dark:text-slate-300"
        >
          <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <span className="text-[0.65rem] font-semibold">Sign In</span>
        </a>
      </div>
    </div>
  );
}
