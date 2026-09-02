import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

/**
 * Service Worker for Hallet PWA
 *
 * Powered by Serwist (modern successor to next-pwa).
 * Handles precaching of static assets and runtime caching
 * of API responses for offline-capable medical study materials.
 *
 * Caching strategy:
 * - Static assets: Precache (available offline immediately)
 * - API responses: StaleWhileRevalidate (fast + fresh)
 * - Study materials: CacheFirst (large PDFs cached aggressively)
 */

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
