import type { MetadataRoute } from "next";

/**
 * The web app manifest.
 *
 * `start_url` points at the MOSH dashboard rather than the site root: someone
 * who installs this to a home screen installed the self-mastery system, and
 * that is the screen they expect when they tap the icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MOSH Self-Mastery & Wealth Alignment System",
    short_name: "MOSH",
    description:
      "Align the mental, spiritual and physical planes while building a scalable business and a meaningful life.",
    start_url: "/mosh",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#faf6ee",
    theme_color: "#0f766e",
    categories: ["productivity", "lifestyle", "health"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Daily rhythm", url: "/mosh/daily" },
      { name: "The Billionaire Self", url: "/mosh/coach" },
      { name: "50-Day Eclipse", url: "/mosh/eclipse" },
    ],
  };
}
