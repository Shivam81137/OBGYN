"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Stethoscope, CheckCircle2, User, Building2, GraduationCap, ShieldCheck, ArrowRight, LogIn } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  institution: string;
  targetExam: "NEET PG" | "NEET UG" | "INI-CET / FMGE";
  yearOfStudy: string;
  provider?: "google" | "microsoft" | "email";
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

export default function AuthModal({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "onboarding">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration & Onboarding state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [institution, setInstitution] = useState(MEDICAL_INSTITUTIONS[0]);
  const [targetExam, setTargetExam] = useState<"NEET PG" | "NEET UG" | "INI-CET / FMGE">("NEET PG");
  const [yearOfStudy, setYearOfStudy] = useState("Intern / Final Year");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode, isOpen]);

  if (!isOpen) return null;

  // Handle OAuth Provider Sign In (Simulated & Session Persistent)
  const handleOAuthLogin = (provider: "google" | "microsoft") => {
    setLoadingProvider(provider);
    setTimeout(() => {
      // Create user profile
      const user: UserProfile = {
        name: provider === "google" ? "Dr. Shivam Kumar" : "Dr. Shivam (Microsoft)",
        username: "shivam_med",
        email: provider === "google" ? "shivam.med@gmail.com" : "shivam@outlook.com",
        institution: "AIIMS New Delhi",
        targetExam: "NEET PG",
        yearOfStudy: "Intern",
        provider,
      };

      localStorage.setItem("conceptual_obgyn_user", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-state-changed"));
      setLoadingProvider(null);
      onClose();
    }, 800);
  };

  // Handle Form Submission (Sign In or Registration)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProvider("email");

    setTimeout(() => {
      if (mode === "signin") {
        const user: UserProfile = {
          name: name || "Dr. Medical Student",
          username: username || "med_aspirant",
          email: email || "doctor@conceptualobgyn.com",
          institution: institution,
          targetExam: targetExam,
          yearOfStudy: yearOfStudy,
          provider: "email",
        };
        localStorage.setItem("conceptual_obgyn_user", JSON.stringify(user));
      } else {
        // Complete Onboarding / Registration
        const user: UserProfile = {
          name: name || "Dr. Medical Student",
          username: username.startsWith("@") ? username.slice(1) : username || "med_aspirant",
          email: email || "student@medical.edu",
          institution,
          targetExam,
          yearOfStudy,
          provider: "email",
        };
        localStorage.setItem("conceptual_obgyn_user", JSON.stringify(user));
      }

      window.dispatchEvent(new Event("auth-state-changed"));
      setLoadingProvider(null);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black font-black shadow-md">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              {mode === "signin" ? "Sign In to Conceptual OBGYN" : "Create Doctor Account"}
            </h2>
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              Ready to revise • High-Yield Medical Platform
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mb-6 flex rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-lg py-2 text-xs font-extrabold transition-all ${
              mode === "signin"
                ? "bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-lg py-2 text-xs font-extrabold transition-all ${
              mode === "signup"
                ? "bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Register / Join
          </button>
        </div>

        {/* OAuth Buttons (Google & Microsoft Login) */}
        <div className="space-y-2.5 mb-6">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            disabled={loadingProvider !== null}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-100 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-[0.99] transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loadingProvider === "google" ? "Connecting Google..." : "Continue with Google"}</span>
          </button>

          {/* Microsoft Sign In */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("microsoft")}
            disabled={loadingProvider !== null}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-100 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-[0.99] transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span>{loadingProvider === "microsoft" ? "Connecting Microsoft..." : "Continue with Microsoft / Institutional SSO"}</span>
          </button>
        </div>

        {/* Or Divider */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          <span className="absolute bg-white dark:bg-zinc-950 px-3 text-[0.65rem] font-bold text-zinc-400 uppercase tracking-widest">
            or use credentials
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <>
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="Dr. Shivam Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white font-bold placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@shivam_obgyn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white font-bold placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Medical College / Institution */}
              <div>
                <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Medical College / Institution
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    {MEDICAL_INSTITUTIONS.map((inst) => (
                      <option key={inst} value={inst} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {inst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Pathway & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Target Exam Pathway
                  </label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="NEET PG">NEET PG (MBBS &amp; Interns)</option>
                    <option value="NEET UG">NEET UG (Pre-Med)</option>
                    <option value="INI-CET / FMGE">INI-CET / FMGE / Faculty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Year of Study / Status
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Intern / Final Year">Intern / Final Year</option>
                    <option value="Post-MBBS Aspirant">Post-MBBS Aspirant</option>
                    <option value="Class 11 / 12 Student">Class 11 / 12 Student</option>
                    <option value="Junior Resident / Faculty">Junior Resident / Faculty</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
              Medical Email Address
            </label>
            <input
              type="email"
              required
              placeholder="doctor@aiims.edu or name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white font-bold placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[0.68rem] font-extrabold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white font-bold placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loadingProvider !== null}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-white dark:bg-cyan-400 dark:text-black py-3 text-xs sm:text-sm font-black shadow-md hover:bg-black dark:hover:bg-cyan-300 active:scale-[0.98] transition-all mt-2"
          >
            <span>{mode === "signin" ? "Sign In to Engine" : "Complete Registration & Launch Engine"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
