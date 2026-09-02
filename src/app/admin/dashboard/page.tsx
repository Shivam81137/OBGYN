import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage organizations, users, content, and analytics.",
};

/**
 * Admin Dashboard Page
 *
 * Overview page for platform administrators.
 * Will display:
 * - Platform-wide metrics (total users, organizations, revenue)
 * - Recent signups and activity
 * - Content upload pipeline status
 * - Subscription tier distribution
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          Platform Overview
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          Monitor your institutions and content pipeline.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Students",
            value: "2,847",
            change: "+12%",
            trend: "up",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            ),
          },
          {
            label: "Organizations",
            value: "23",
            change: "+3",
            trend: "up",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21V6.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75V21m7.5 0V10.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75V21" />
              </svg>
            ),
          },
          {
            label: "Study Materials",
            value: "1,234",
            change: "+89",
            trend: "up",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            ),
          },
          {
            label: "Monthly Revenue",
            value: "₹4.2L",
            change: "+18%",
            trend: "up",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ),
          },
        ].map((metric) => (
          <div key={metric.label} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 border border-blue-500/20">
                {metric.icon}
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {metric.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{metric.value}</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="glass-card p-5">
          <h2 className="mb-4 text-base font-extrabold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { action: "New organization registered", detail: "AIIMS Patna", time: "2 hours ago" },
              { action: "Content uploaded", detail: "Pharmacology — CNS Drugs.pdf", time: "4 hours ago" },
              { action: "Bulk student import", detail: "142 students from JIPMER", time: "1 day ago" },
              { action: "Subscription upgraded", detail: "MAMC → Premium", time: "2 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-cyan-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{activity.detail}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-5">
          <h2 className="mb-4 text-base font-extrabold text-slate-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Organization", icon: "🏥" },
              { label: "Upload Content", icon: "📄" },
              { label: "Import Students", icon: "👥" },
              { label: "View Reports", icon: "📊" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 p-4 text-center transition-all duration-200 hover:border-blue-500 dark:hover:border-cyan-400 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
