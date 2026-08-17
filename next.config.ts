import type { NextConfig } from "next";

/**
 * Security and PWA headers.
 *
 * The service worker is served with no-store so an update is picked up on the
 * next visit rather than whenever a stale copy happens to expire, and it is
 * scoped to the site root explicitly. The three global headers are the
 * standard hardening set for an authenticated dashboard.
 */
const nextConfig: NextConfig = {
  // Emitted for the Docker image; harmless on Vercel, which ignores it.
  output: process.env.NEXT_OUTPUT_STANDALONE === "true" ? "standalone" : undefined,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/api/mosh/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
