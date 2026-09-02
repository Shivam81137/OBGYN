import type { Metadata } from "next";
import Navbar from "@/components/synapsis/Navbar";
import HeroSection from "@/components/synapsis/HeroSection";
import FeaturesGrid from "@/components/synapsis/FeaturesGrid";
import MobileNav from "@/components/synapsis/MobileNav";
import Footer from "@/components/synapsis/Footer";

export const metadata: Metadata = {
  title: "Conceptual OBGYN — Ready to revise",
  description:
    "Clutter-free medical education PWA for NEET PG & OBGYN aspirants. High-yield active recall, 3D visualizers, DRM notes, and clinical masterclasses.",
};

export default function SynapsisMinimalLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 font-sans antialiased selection:bg-blue-500 selection:text-white dark:selection:bg-cyan-500 dark:selection:text-slate-950 pb-16 md:pb-0">
      {/* Sterile Clinical Header with Theme Toggle */}
      <Navbar />

      {/* Main Content Stream */}
      <main className="relative">
        {/* Top Hero & Immediate Pathway Hub (NEET UG / NEET PG Cards) */}
        <HeroSection />

        {/* 3-Column Extraordinary Feature Grid */}
        <FeaturesGrid />
      </main>

      {/* Sticky Mobile Bottom Navigation (Only visible on mobile screens) */}
      <MobileNav />

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
