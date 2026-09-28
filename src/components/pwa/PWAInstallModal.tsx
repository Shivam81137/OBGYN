"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Monitor, CheckCircle2, Download, Share, PlusSquare } from "lucide-react";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  hasNativePrompt: boolean;
  onTriggerNativePrompt: () => void;
}

export default function PWAInstallModal({
  isOpen,
  onClose,
  isIOS,
  hasNativePrompt,
  onTriggerNativePrompt,
}: PWAInstallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <div className="min-h-full flex items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto w-full max-w-sm rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-2xl backdrop-blur-2xl text-zinc-900 dark:text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black font-extrabold shadow-sm shrink-0">
                    {isIOS ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black leading-none">Install Conceptual OBGYN</h3>
                    <p className="text-[0.68rem] font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                      {isIOS ? "iOS Safari Instructions" : "Home Screen & Desktop App"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Instructions Body */}
              <div className="py-4 space-y-3.5 text-xs font-medium">
                {hasNativePrompt ? (
                  <div className="text-center py-2 space-y-3">
                    <p className="text-zinc-600 dark:text-zinc-300 text-xs">
                      Tap below to launch Chrome / Android native 1-click app installation.
                    </p>
                    <button
                      onClick={() => {
                        onTriggerNativePrompt();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-black text-black hover:bg-cyan-300 transition-all active:scale-95 shadow-md"
                    >
                      <Download className="h-4 w-4" />
                      <span>Install App Now</span>
                    </button>
                  </div>
                ) : isIOS ? (
                  <>
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
                          Scroll down the list and select{" "}
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">
                            Add to Home Screen <PlusSquare className="inline h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 mx-0.5" />
                          </span>.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-3.5 border border-zinc-200/60 dark:border-zinc-700/40">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xs border border-cyan-500/30">
                        1
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-zinc-900 dark:text-white">
                          Click Address Bar Install Icon (⊕ / 💻)
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[0.7rem] leading-relaxed">
                          On Chrome/Edge/Brave, click the <span className="font-bold text-zinc-800 dark:text-zinc-200">Install icon</span> in your address bar (top right).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-3.5 border border-zinc-200/60 dark:border-zinc-700/40">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-xs border border-cyan-500/30">
                        2
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-zinc-900 dark:text-white">
                          Or via Browser Menu (⋮)
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[0.7rem] leading-relaxed">
                          Click 3 dots (⋮) in top right corner → Select <span className="font-bold text-zinc-800 dark:text-zinc-200">&apos;Install Conceptual OBGYN&apos;</span>.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Action */}
              <div className="pt-2">
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
        </div>
      )}
    </AnimatePresence>
  );
}
