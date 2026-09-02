"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Military-Grade Content DRM",
    description: "Stream AES-256 encrypted medical PDFs rendered via HTML5 Canvas with dynamic user watermarking to prevent unauthorized redistribution.",
    color: "blue",
  },
  {
    icon: Brain,
    title: "AI Spaced Repetition",
    description: "Smart flashcard algorithms automatically calculate your memory decay curve, reinforcing high-yield concepts right before you forget them.",
    color: "indigo",
  },
  {
    icon: BarChart3,
    title: "Institutional Analytics",
    description: "Real-time B2B performance monitoring for medical colleges to track student batch accuracy, weakness heatmaps, and exam readiness.",
    color: "cyan",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
          Clutter-Free Intelligence
        </h2>
        <p className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Built for Peak Medical Focus.
        </p>
      </div>

      {/* Clean 3-Column Grid (Stacks on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 flex flex-col justify-between"
            >
              <div>
                {/* Simple Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-cyan-400 mb-5">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                {/* Maximum 2 sentences description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
