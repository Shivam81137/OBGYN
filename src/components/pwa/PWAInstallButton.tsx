"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import IOSInstallModal from "./IOSInstallModal";

export default function PWAInstallButton() {
  const {
    isInstallable,
    isIOSModalOpen,
    setIsIOSModalOpen,
    promptInstall,
  } = usePWAInstall();

  return (
    <>
      <AnimatePresence>
        {isInstallable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="inline-flex items-center"
          >
            <button
              onClick={promptInstall}
              title="Install Conceptual OBGYN App"
              className="inline-flex items-center gap-1.5 rounded-full backdrop-blur-md bg-white/10 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 px-3 py-1.5 text-xs font-black text-zinc-900 dark:text-cyan-400 shadow-sm hover:bg-white/20 dark:hover:bg-slate-800/70 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 transition-all active:scale-95 group cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline tracking-tight">Install App</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Instructions Popover/Modal */}
      <IOSInstallModal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
      />
    </>
  );
}
