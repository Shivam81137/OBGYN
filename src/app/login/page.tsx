"use client";

import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";
import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-4">
      {/* Top Header Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 text-xs font-extrabold text-zinc-800 dark:text-zinc-200 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <AuthModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          window.location.href = "/";
        }}
        defaultMode="signin"
      />
    </div>
  );
}
