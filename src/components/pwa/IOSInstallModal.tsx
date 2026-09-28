"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Share, PlusSquare, Smartphone, CheckCircle2 } from "lucide-react";

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IOSInstallModal({ isOpen, onClose }: IOSInstallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Card — Perfectly Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-sm max-h-[85vh] flex flex-col rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-2xl text-zinc-900 dark:text-white overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black font-extrabold shadow-sm shrink-0">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black leading-none">Install App</h3>
                  <p className="text-[0.68rem] font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">iOS Safari Instructions</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Instruction Steps Body */}
            <div className="py-4 space-y-3.5 text-xs font-medium overflow-y-auto max-h-[55vh] pr-1">
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-3.5 border border-zinc-200/60 dark:border-zinc-700/40">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xs border border-cyan-500/30">
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-zinc-900 dark:text-white">
                    Tap the Share Button
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[0.7rem] leading-relaxed">
                    In Safari&apos;s bottom navigation bar, tap the Share icon{" "}
                    <Share className="inline h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 mx-0.5" />.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-3.5 border border-zinc-200/60 dark:border-zinc-700/40">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xs border border-cyan-500/30">
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-zinc-900 dark:text-white">
                    Select &apos;Add to Home Screen&apos;
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[0.7rem] leading-relaxed">
                    Scroll down the options list and select{" "}
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      Add to Home Screen <PlusSquare className="inline h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 mx-0.5" />
                    </span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-3.5 border border-zinc-200/60 dark:border-zinc-700/40">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xs border border-cyan-500/30">
                  3
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-zinc-900 dark:text-white">
                    Confirm Installation
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[0.7rem] leading-relaxed">
                    Tap <span className="font-bold text-zinc-800 dark:text-zinc-200">&apos;Add&apos;</span> in top right corner to add Conceptual OBGYN to your home screen.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 shrink-0 border-t border-zinc-100 dark:border-zinc-800/80">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-black text-white hover:bg-black dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 transition-all active:scale-95 shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Got It</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
