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
