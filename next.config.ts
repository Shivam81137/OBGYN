import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

/**
 * Serwist PWA Configuration
 *
 * Wraps the Next.js config to generate the service worker at build time.
 * Disabled in development to avoid caching issues during hot reload.
 */
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Allow Turbopack (Next.js 16 default) to coexist with
  // Serwist's webpack-based service worker generation
  turbopack: {},

  /**
   * Security headers for enterprise deployment.
   * These headers help prevent XSS, clickjacking, and data sniffing.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
