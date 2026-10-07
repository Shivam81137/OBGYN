"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { ReactNode } from "react";

/**
 * Client-side providers wrapper.
 * SessionProvider makes useSession() and signIn/signOut available
 * to all child client components throughout the app.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
