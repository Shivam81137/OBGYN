import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized study dashboard — track progress and access materials.",
};

/**
 * Student Dashboard Page
 *
 * This is the main entry point for students after login.
 * Will display:
 * - Study progress overview
 * - Recently accessed materials
 * - Upcoming tests
 * - Subject-wise completion stats
 * - High-yield material recommendations
 */
export default function StudentDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-surface-900">
          Good Morning! 👋
        </h1>
        <p className="mt-1 text-surface-500">
          Ready to continue your NEET PG preparation?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Study Hours", value: "24.5", change: "+3.2h", color: "from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600" },
          { label: "Materials Read", value: "18", change: "+4", color: "from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500" },
          { label: "Tests Taken", value: "7", change: "+2", color: "from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500" },
          { label: "Avg. Score", value: "78%", change: "+5%", color: "from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card animate-slide-up overflow-hidden p-4 flex flex-col justify-between"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-sm`}>
              <span className="text-sm font-extrabold text-white dark:text-slate-950">{stat.value}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{stat.label}</p>
              <p className="mt-0.5 text-[0.68rem] font-bold text-emerald-600 dark:text-emerald-400">
                {stat.change} this week
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Banner */}
      <div className="mb-8">
        <div className="glass-card relative overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-purple-500/50 transition-colors duration-300 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white shadow-lg shadow-purple-500/30">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                OBGYN AI Tutor
              </h2>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[0.65rem] font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Beta
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Stuck on a topic? Upload a PDF to get an instant summary, or chat with our Gemini-powered AI tutor to clear your NEET PG doubts instantly.
            </p>
          </div>
          <div className="relative z-10 w-full sm:w-auto flex-shrink-0">
            <a 
              href="/ai-assistant"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-3 text-sm font-bold text-white transition-all shadow-md shadow-purple-600/20"
            >
              Start Chatting
              <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-base sm:text-lg font-black text-slate-900 dark:text-white">
          Continue Studying
        </h2>
        <div className="space-y-3">
          {[
            { title: "Pathology — Inflammation & Repair", subject: "Pathology", progress: 72, tags: ["High Yield"] },
            { title: "Pharmacology — ANS Drugs", subject: "Pharmacology", progress: 45, tags: ["Must Know", "Frequently Asked"] },
            { title: "Anatomy — Brachial Plexus", subject: "Anatomy", progress: 90, tags: ["Important Diagram"] },
          ].map((material) => (
            <div
              key={material.title}
              className="glass-card flex items-center gap-4 p-4 transition-all duration-200 hover:scale-[1.01] hover:border-blue-500 dark:hover:border-cyan-400 cursor-pointer"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 border border-blue-500/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {material.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="tag tag-subject">{material.subject}</span>
                  {material.tags.map((tag) => (
                    <span key={tag} className="tag tag-high-yield">{tag}</span>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                    style={{ width: `${material.progress}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-xs font-extrabold text-blue-600 dark:text-cyan-400">
                {material.progress}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
