"use client";

import { Suspense, lazy, useState, useEffect } from "react";

const Scene = lazy(() => import("./HeroBrainScene").then((mod) => ({ default: mod.default })));

// Dynamic import of Canvas to avoid SSR issues
let R3FCanvas: any = null;

/**
 * Gradient Fallback — shown while the 3D scene loads,
 * or permanently on low-end devices.
 */
function GradientFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-50 to-cyan-50/30 dark:from-black dark:via-zinc-950 dark:to-cyan-950/20" />

      {/* Floating ambient orbs */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-cyan-500/8 dark:bg-cyan-500/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/3 h-48 w-48 rounded-full bg-purple-500/6 dark:bg-purple-500/8 blur-3xl animate-float-slow" style={{ animationDelay: "-3s" }} />
      <div className="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-amber-500/5 dark:bg-amber-500/6 blur-2xl animate-pulse-soft" />
    </div>
  );
}

/**
 * HeroCanvas — Lazy-loaded React Three Fiber canvas with
 * automatic fallback for low-end devices and SSR.
 */
export default function HeroCanvas() {
  const [canRender3D, setCanRender3D] = useState(false);
  const [CanvasComponent, setCanvasComponent] = useState<any>(null);

  useEffect(() => {
    // Check device capability
    const isLowEnd =
      typeof navigator !== "undefined" &&
      (navigator.hardwareConcurrency <= 2 || window.innerWidth < 500);

    if (isLowEnd) {
      setCanRender3D(false);
      return;
    }

    // Dynamically import R3F Canvas (avoids SSR)
    import("@react-three/fiber").then((mod) => {
      setCanvasComponent(() => mod.Canvas);
      setCanRender3D(true);
    }).catch(() => {
      setCanRender3D(false);
    });
  }, []);

  if (!canRender3D || !CanvasComponent) {
    return <GradientFallback />;
  }

  const DynamicCanvas = CanvasComponent;

  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={<GradientFallback />}>
        <DynamicCanvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.5, 10], fov: 42 }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <Scene />
        </DynamicCanvas>
      </Suspense>

      {/* Gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/60 via-transparent to-zinc-50/80 dark:from-black/50 dark:via-transparent dark:to-black/70 pointer-events-none" />
    </div>
  );
}
