import Link from "next/link";

export const metadata = {
  title: "Offline · MOSH",
  description: "You are offline. MOSH will reconnect when the network returns.",
};

/**
 * The offline fallback.
 *
 * Cached by the service worker at install time, so a navigation with no
 * network lands here instead of on the browser's error page. It is a static
 * page on purpose — it must render with no server and no data.
 */
export default function OfflinePage() {
  return (
    <div className="mosh-root flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-mosh-brand">
          MOSH Self-Mastery
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-mosh-ink">
          You are offline
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-mosh-ink-muted">
          Pages you have already opened stay readable. Anything you save needs the network, so it
          will have to wait — which, on the right day, is its own kind of rhythm.
        </p>
        <Link
          href="/mosh"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-mosh-brand px-4 py-2 text-sm font-medium text-mosh-brand-ink"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
