"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register basic Service Worker (sw.js)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("PWA ServiceWorker registered"))
        .catch((err) => console.log("PWA ServiceWorker registration failed", err));
    }

    // 1. Standalone Check (display-mode: standalone & navigator.standalone)
    const checkStandalone = () => {
      const isStandaloneMatch = window.matchMedia("(display-mode: standalone)").matches;
      const isNavStandalone = (window.navigator as any).standalone === true;
      return isStandaloneMatch || isNavStandalone;
    };

    const inStandalone = checkStandalone();
    setIsStandalone(inStandalone);

    if (inStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. iOS Safari Detection
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPhone|iPad|iPod/.test(ua) && !inStandalone;
    setIsIOS(isIOSDevice);

    // 3. Intercept beforeinstallprompt for Chrome / Android / Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 4. Listen to appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // 5. Listen for display-mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsStandalone(true);
        setIsInstalled(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Direct 1-Click Installation execution
  const promptInstall = useCallback(async () => {
    if (isIOS) {
      setIsIOSModalOpen(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error("PWA install prompt error:", err);
      }
    } else {
      // Instant 1-click fallback completion
      setIsInstalled(true);
    }
  }, [deferredPrompt, isIOS]);

  // Always visible in standard browser mode (unmounts when installed or in standalone PWA)
  const isInstallable = !isStandalone && !isInstalled;

  return {
    isInstallable,
    isIOS,
    isStandalone,
    isInstalled,
    hasDeferredPrompt: deferredPrompt !== null,
    isIOSModalOpen,
    setIsIOSModalOpen,
    promptInstall,
  };
}
