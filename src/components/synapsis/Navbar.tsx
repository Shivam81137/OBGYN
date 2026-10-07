"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Activity, LogOut, GraduationCap, ChevronDown, Sparkles, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import PWAInstallButton from "@/components/pwa/PWAInstallButton";
import AuthModal from "@/components/auth/AuthModal";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = session?.user;
  const role = user?.role as string | undefined;
  const isLoading = status === "loading";

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  const openSignIn = () => {
    setAuthMode("signin");
    setIsAuthOpen(true);
  };

  const openSignUp = () => {
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  const dashboardHref = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
  const dashboardLabel = role === "ADMIN" ? "Admin Dashboard" : "Student Dashboard";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/90 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-black/90 transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-cyan-400 dark:text-black font-extrabold">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                Conceptual OBGYN
              </span>
              <span className="text-[0.62rem] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Ready to revise
              </span>
            </div>
          </a>

          {/* Right Section */}
          <div className="flex items-center gap-2.5">
            <PWAInstallButton />
            <ThemeToggle />

            {/* Loading skeleton */}
            {isLoading && (
              <div className="h-8 w-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
            )}

            {/* Signed In User Dropdown */}
            {!isLoading && user && (
              <div className="relative">
                <button
                  id="user-dropdown-toggle"
                  onClick={() => setIsDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full font-black text-[0.68rem] text-white ${
                      role === "ADMIN" ? "bg-violet-500" : "bg-cyan-500"
                    }`}
                  >
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-extrabold leading-none truncate max-w-[100px]">
                      {user.name || user.email}
                    </span>
                    <span
                      className={`text-[0.58rem] font-bold uppercase ${
                        role === "ADMIN"
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-cyan-600 dark:text-cyan-400"
                      }`}
                    >
                      {role === "ADMIN" ? "Admin" : "Student"}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl z-50">
                    <div className="p-2 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
                      <p className="text-xs font-black text-zinc-900 dark:text-white truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-[0.65rem] text-zinc-500 truncate">{user.email}</p>
                      <div
                        className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.62rem] font-bold border ${
                          role === "ADMIN"
                            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30"
                            : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30"
                        }`}
                      >
                        {role === "ADMIN" ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <GraduationCap className="h-3 w-3" />
                        )}
                        <span>{role === "ADMIN" ? "Administrator" : "Student"}</span>
                      </div>
                    </div>

                    <a
                      href={dashboardHref}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                      <span>{dashboardLabel}</span>
                    </a>

                    <button
                      id="signout-btn"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/10 transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Signed Out Buttons */}
            {!isLoading && !user && (
              <>
                <button
                  id="navbar-signin-btn"
                  onClick={openSignIn}
                  className="hidden sm:block text-xs sm:text-sm font-bold text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Sign In
                </button>

                <button
                  id="navbar-signup-btn"
                  onClick={openSignUp}
                  className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-black dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 active:scale-95"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
}
