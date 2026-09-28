"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Military-Grade Content DRM",
    description: "Stream AES-256 encrypted medical PDFs rendered via HTML5 Canvas with dynamic user watermarking to prevent unauthorized redistribution.",
  },
  {
    icon: Brain,
    title: "AI Spaced Repetition",
    description: "Smart flashcard algorithms automatically calculate your memory decay curve, reinforcing high-yield concepts right before you forget them.",
  },
  {
    icon: BarChart3,
    title: "Institutional Analytics",
    description: "Real-time B2B performance monitoring for medical colleges to track student batch accuracy, weakness heatmaps, and exam readiness.",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-zinc-200/40 dark:border-zinc-800/40">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl mx-auto mb-12"
      >
        <h2 className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
          Clutter-Free Intelligence
        </h2>
        <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          Built for Peak Medical Focus.
        </p>
      </motion.div>

      {/* Glassmorphism Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card-premium p-6 transition-all hover:shadow-xl hover:border-cyan-500/30 dark:hover:border-cyan-400/20 flex flex-col justify-between"
            >
              <div>
                {/* Animated Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100/80 text-zinc-800 dark:bg-zinc-800/60 dark:text-cyan-400 mb-5 backdrop-blur-sm border border-zinc-200/40 dark:border-zinc-700/40 animate-float-slow" style={{ animationDelay: `${index * -2}s` }}>
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
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
