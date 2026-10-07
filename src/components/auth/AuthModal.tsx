"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import {
  X,
  Stethoscope,
  User,
  Building2,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Role = "STUDENT" | "ADMIN";
type AuthMode = "signin" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}

const MEDICAL_INSTITUTIONS = [
  "AIIMS New Delhi",
  "Maulana Azad Medical College (MAMC), New Delhi",
  "King George's Medical University (KGMU), Lucknow",
  "JIPMER, Puducherry",
  "Grant Medical College & JJ Hospital, Mumbai",
  "Lady Hardinge Medical College (LHMC), New Delhi",
  "Christian Medical College (CMC), Vellore",
  "AFMC, Pune",
  "Government Medical College (GMC)",
  "Private Medical College / Other",
];

// ─────────────────────────────────────────────────────────────────────────────
// Role Selector Card
// ─────────────────────────────────────────────────────────────────────────────

function RoleCard({
  role,
  selected,
  onSelect,
}: {
  role: Role;
  selected: boolean;
  onSelect: (r: Role) => void;
}) {
  const isStudent = role === "STUDENT";
  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className={`
        flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-200 w-full
        ${
          selected
            ? isStudent
              ? "border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-950/40 shadow-md scale-[1.02]"
              : "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/40 shadow-md scale-[1.02]"
            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        }
      `}
    >
      <div
        className={`
          flex h-10 w-10 items-center justify-center rounded-xl transition-colors
          ${
            selected
              ? isStudent
                ? "bg-cyan-500 text-white"
                : "bg-violet-500 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          }
        `}
      >
        {isStudent ? (
          <GraduationCap className="h-5 w-5" />
        ) : (
          <ShieldCheck className="h-5 w-5" />
        )}
      </div>
      <span
        className={`
          text-xs font-black uppercase tracking-wide
          ${selected
            ? isStudent
              ? "text-cyan-700 dark:text-cyan-300"
              : "text-violet-700 dark:text-violet-300"
            : "text-zinc-600 dark:text-zinc-400"
          }
        `}
      >
        {isStudent ? "Student" : "Admin"}
      </span>
      <span className="text-[0.6rem] text-zinc-500 dark:text-zinc-400 text-center leading-relaxed">
        {isStudent
          ? "NEET PG / UG aspirant accessing study materials"
          : "College staff managing content & users"}
      </span>
      {selected && (
        <span
          className={`
            mt-1 rounded-full px-2.5 py-0.5 text-[0.6rem] font-extrabold uppercase
            ${isStudent
              ? "bg-cyan-500 text-white"
              : "bg-violet-500 text-white"
            }
          `}
        >
          Selected
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AuthModal
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Signup-only fields
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [institution, setInstitution] = useState(MEDICAL_INSTITUTIONS[0]);
  const [targetExam, setTargetExam] = useState<"NEET PG" | "NEET UG" | "INI-CET / FMGE">("NEET PG");
  const [yearOfStudy, setYearOfStudy] = useState("Intern / Final Year");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError(null);
      setSuccess(null);
      setLoading(false);
      setEmail("");
      setPassword("");
      setName("");
      setRole("STUDENT");
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  // ── Sign In ─────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    // Redirect based on role — page will refresh; middleware handles it.
    // We fetch the session to know where to send the user.
    try {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const userRole = session?.user?.role;

      onClose();
      if (userRole === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      onClose();
      window.location.href = "/dashboard";
    }
  };

  // ── Sign Up ─────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          institution,
          targetExam: role === "STUDENT" ? targetExam : undefined,
          yearOfStudy: role === "STUDENT" ? yearOfStudy : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      setSuccess("Account created! Signing you in…");
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setSuccess(null);
        setError("Account created but sign-in failed. Please sign in manually.");
        setLoading(false);
        setMode("signin");
        return;
      }

      // Redirect to appropriate dashboard
      onClose();
      if (role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  const accentClass =
    mode === "signup" && role === "ADMIN"
      ? "bg-violet-600 hover:bg-violet-700 text-white"
      : "bg-zinc-950 hover:bg-black text-white dark:bg-cyan-400 dark:hover:bg-cyan-300 dark:text-black";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-2xl text-zinc-900 dark:text-zinc-100 transition-colors max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all z-10"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black font-black shadow-md">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                {mode === "signin" ? "Welcome Back" : "Create Your Account"}
              </h2>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                Conceptual OBGYN · High-Yield Medical Platform
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="mb-6 flex rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                className={`flex-1 rounded-lg py-2 text-xs font-extrabold transition-all ${
                  mode === m
                    ? "bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {m === "signin" ? "Sign In" : "Register / Join"}
              </button>
            ))}
          </div>

          {/* Error / Success banners */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40 px-4 py-3 text-xs font-semibold text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {success}
            </div>
          )}

          {/* ── SIGN IN FORM ─────────────────────────────────────────────── */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  id="signin-email"
                  placeholder="doctor@aiims.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-white font-medium placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    id="signin-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-3 pr-10 py-2.5 text-sm text-zinc-900 dark:text-white font-medium placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="signin-submit"
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black shadow-md active:scale-[0.98] transition-all mt-2 ${accentClass} disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── SIGN UP FORM ─────────────────────────────────────────────── */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Role Selector — the critical piece */}
              <div>
                <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-2">
                  I am signing up as…
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <RoleCard role="STUDENT" selected={role === "STUDENT"} onSelect={setRole} />
                  <RoleCard role="ADMIN" selected={role === "ADMIN"} onSelect={setRole} />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    id="signup-name"
                    placeholder={role === "STUDENT" ? "Dr. Shivam Kumar" : "Admin User"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white font-medium placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              {/* Institution — shown to all roles */}
              <div>
                <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Medical College / Institution
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    id="signup-institution"
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white font-medium focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  >
                    {MEDICAL_INSTITUTIONS.map((inst) => (
                      <option key={inst} value={inst} className="bg-white dark:bg-zinc-900">
                        {inst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student-only extras */}
              {role === "STUDENT" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                      Target Exam
                    </label>
                    <select
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value as typeof targetExam)}
                      id="signup-target-exam"
                      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-white font-medium focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    >
                      <option value="NEET PG">NEET PG (MBBS & Interns)</option>
                      <option value="NEET UG">NEET UG (Pre-Med)</option>
                      <option value="INI-CET / FMGE">INI-CET / FMGE / Faculty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                      Year / Status
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      id="signup-year"
                      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-white font-medium focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    >
                      <option value="Intern / Final Year">Intern / Final Year</option>
                      <option value="Post-MBBS Aspirant">Post-MBBS Aspirant</option>
                      <option value="Class 11 / 12 Student">Class 11 / 12 Student</option>
                      <option value="Junior Resident / Faculty">Junior Resident / Faculty</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  id="signup-email"
                  placeholder={role === "STUDENT" ? "student@aiims.edu" : "admin@college.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-white font-medium placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Password <span className="normal-case font-medium">(min 8 chars)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    id="signup-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-3 pr-10 py-2.5 text-sm text-zinc-900 dark:text-white font-medium placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role-specific note */}
              <div className={`rounded-xl px-4 py-3 text-[0.7rem] font-semibold ${
                role === "ADMIN"
                  ? "bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300"
                  : "bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300"
              }`}>
                {role === "STUDENT"
                  ? "🎓 Your account will open the Student Dashboard — study materials, flashcards, and practice tests."
                  : "🛡️ Your account will open the Admin Dashboard — manage content, users, and organisation settings."}
              </div>

              <button
                type="submit"
                id="signup-submit"
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black shadow-md active:scale-[0.98] transition-all ${
                  role === "ADMIN"
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-zinc-950 hover:bg-black text-white dark:bg-cyan-400 dark:hover:bg-cyan-300 dark:text-black"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {role === "ADMIN"
                        ? "Create Admin Account"
                        : "Create Student Account"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
