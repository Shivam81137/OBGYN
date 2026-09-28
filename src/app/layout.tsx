import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Conceptual OBGYN — Ready to revise",
    template: "%s | Conceptual OBGYN",
  },
  description:
    "Conceptual OBGYN — Ready to revise. High-yield medical education, active recall, 3D visualizers, and clinical masterclasses.",
  keywords: [
    "Conceptual OBGYN",
    "OBGYN",
    "Obstetrics and Gynecology",
    "NEET PG",
    "Medical Education",
    "Ready to revise",
    "Active Recall",
  ],
  authors: [{ name: "Conceptual OBGYN" }],
  creator: "Conceptual OBGYN",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Conceptual OBGYN",
    title: "Conceptual OBGYN — Ready to revise",
    description:
      "Conceptual OBGYN — Ready to revise. High-yield medical education for doctors and aspirants.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Conceptual OBGYN" />
      </head>
      <body className="font-sans antialiased bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100 selection:bg-cyan-500 selection:text-black transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
