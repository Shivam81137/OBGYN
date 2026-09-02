"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, ArrowDown, HelpCircle, RefreshCw } from "lucide-react";

interface Scenario {
  id: string;
  igm: "+" | "-";
  igg: "+" | "-";
  title: string;
  badge: string;
  badgeColor: string;
  diagnosis: string;
  details: string;
  recommendation: string;
  avidityRequired: boolean;
}

const scenarios: Scenario[] = [
  {
    id: "recent",
    igm: "+",
    igg: "-",
    title: "IgM (+), IgG (-)",
    badge: "RECENT PRIMARY INFECTION",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/30",
    diagnosis: "Acute / Recent Infection (<10 Days)",
    details: "IgM antibodies appear within 1-2 weeks. High risk of transplacental transmission to the fetus during primary maternal infection.",
    recommendation: "Immediate maternal PCR confirmation and fetal ultrasound / amniocentesis for viral DNA at 18-20 weeks.",
    avidityRequired: false,
  },
  {
    id: "past",
    igm: "-",
    igg: "+",
    title: "IgM (-), IgG (+)",
    badge: "PAST INFECTION / IMMUNE",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    diagnosis: "Past Infection / Pre-Existing Immunity",
    details: "High avidity IgG antibodies cross the placenta, providing protective maternal immunity. Infection acquired prior to pregnancy (>12-16 weeks ago).",
    recommendation: "No fetal risk. Standard routine prenatal care. No treatment or amniocentesis required.",
    avidityRequired: false,
  },
  {
    id: "both",
    igm: "+",
    igg: "+",
    title: "IgM (+), IgG (+)",
    badge: "AMBIGUOUS / PROMPT AVIDITY",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    diagnosis: "Indeterminate — Recent vs Persisting IgM",
    details: "IgM can persist for up to 12 months after infection. IgG Avidity test is essential to determine exact infection timing.",
    recommendation: "Perform IgG Avidity Test immediately on the same serum sample.",
    avidityRequired: true,
  },
  {
    id: "negative",
    igm: "-",
    igg: "-",
    title: "IgM (-), IgG (-)",
    badge: "NO IMMUNITY / SUSCEPTIBLE",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    diagnosis: "Uninfected / Susceptible",
    details: "No active or past infection. Patient is vulnerable to primary TORCH acquisition during pregnancy.",
    recommendation: "Advise strict dietary/hygiene precautions (avoid raw meat, cat litter). Retest if symptomatic.",
    avidityRequired: false,
  },
];

export default function DiagnosticAlgorithm() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[2]); // Default both positive
  const [avidityResult, setAvidityResult] = useState<"high" | "low" | null>(null);

  const handleSelectScenario = (sc: Scenario) => {
    setSelectedScenario(sc);
    setAvidityResult(null);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-obsidian-900/80 p-6 sm:p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
            <Activity className="h-3.5 w-3.5 text-purple-400" />
            <span>INTERACTIVE CLINICAL ALGORITHM</span>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-white">
            TORCH Serological Testing Logic
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Select serological test status or click decision nodes below:
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedScenario(scenarios[2]);
            setAvidityResult(null);
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-obsidian-950 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
          <span>Reset Algorithm</span>
        </button>
      </div>

      {/* Step 1: Serology Status Selection Buttons */}
      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
          Step 1: Maternal Serology Screen (IgM & IgG)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {scenarios.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-500/10 shadow-glow-cyan text-white"
                    : "border-slate-800 bg-obsidian-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span className="text-sm font-black tracking-tight">{sc.title}</span>
                <span className={`mt-1.5 rounded-full px-2 py-0.5 text-[0.65rem] font-bold border ${sc.badgeColor}`}>
                  {sc.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Flowchart Decision Node Result */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedScenario.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="mt-8 rounded-2xl border border-slate-800 bg-obsidian-950 p-6 space-y-6"
        >
          {/* Diagnostic Status Box */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-obsidian-900 border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-semibold">DIAGNOSIS</span>
              <h4 className="text-lg font-bold text-white mt-0.5">{selectedScenario.diagnosis}</h4>
              <p className="text-xs text-slate-400 mt-1">{selectedScenario.details}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold border ${selectedScenario.badgeColor}`}>
              {selectedScenario.badge}
            </span>
          </div>

          {/* Avidity Decision Tree Node (Triggered when both IgM+ and IgG+) */}
          {selectedScenario.avidityRequired && (
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>STEP 2 REQUIRED: IgG AVIDITY TESTING</span>
              </div>
              <p className="text-xs text-slate-300">
                Because IgM can persist for up to 12 months, measure IgG binding affinity to determine if primary infection occurred during early pregnancy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setAvidityResult("high")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avidityResult === "high"
                      ? "border-emerald-400 bg-emerald-500/20 text-white shadow-glow-cyan"
                      : "border-slate-800 bg-obsidian-900 text-slate-300 hover:border-emerald-500/40"
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-400">HIGH AVIDITY (&gt;60%)</div>
                  <div className="text-[0.7rem] text-slate-400 mt-1">Infection acquired &gt;3-4 months ago (pre-conception). Fetal risk negligible!</div>
                </button>

                <button
                  onClick={() => setAvidityResult("low")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avidityResult === "low"
                      ? "border-red-400 bg-red-500/20 text-white shadow-glow-violet"
                      : "border-slate-800 bg-obsidian-900 text-slate-300 hover:border-red-500/40"
                  }`}
                >
                  <div className="text-xs font-bold text-red-400">LOW AVIDITY (&lt;45%)</div>
                  <div className="text-[0.7rem] text-slate-400 mt-1">Primary infection acquired within past 3-4 months (during pregnancy). High fetal risk!</div>
                </button>
              </div>
            </div>
          )}

          {/* Clinical Action Recommendation */}
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
            <span className="font-bold text-purple-300">CLINICAL ACTION PLAN: </span>
            <span className="text-slate-200">
              {avidityResult === "high"
                ? "High IgG Avidity confirmed: Infection acquired prior to pregnancy. Reassure patient; routine prenatal care."
                : avidityResult === "low"
                ? "Low IgG Avidity confirmed: Primary maternal infection during early embryogenesis. Refer to Maternal-Fetal Medicine (MFM); initiate targeted therapy & fetal USG/Amniocentesis."
                : selectedScenario.recommendation}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
