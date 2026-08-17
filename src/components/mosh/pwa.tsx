"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Download, WifiOff } from "lucide-react";

/**
 * Progressive Web App wiring.
 *
 * Registers the service worker that caches the app shell, and shows the
 * offline banner when the browser loses its connection — the trackers keep
 * rendering from cache, they just cannot save until the network returns.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Registration is deliberately deferred to load so it never competes with
    // the first render on a slow connection.
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((error) => console.error("[mosh] service worker registration failed", error));
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}

/** Subscribe to the browser's connectivity, the React 19 way. */
function subscribeToConnectivity(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

export function OfflineBanner() {
  // The server snapshot is "online": the page was, by definition, served.
  const offline = useSyncExternalStore(
    subscribeToConnectivity,
    () => !navigator.onLine,
    () => false
  );

  if (!offline) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-mosh-accent-soft px-4 py-2 text-xs text-mosh-warn"
    >
      <WifiOff size={14} aria-hidden />
      <span>You are offline. Pages you have opened stay readable; saving resumes when you reconnect.</span>
    </div>
  );
}

type InstallPromptEvent = Event & { prompt: () => Promise<void> };

/**
 * The install button.
 *
 * Chromium fires `beforeinstallprompt`, so the button is real there. iOS has
 * no such event, so Safari users get the Share-sheet instruction instead —
 * which is the only honest thing to show them.
 */
export function InstallButton() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);

  // Both of these are facts about the browser, not React state, so they are
  // read through an external store rather than assigned inside an effect.
  const subscribeToDisplayMode = useCallback((onChange: () => void) => {
    const query = window.matchMedia("(display-mode: standalone)");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const installed = useSyncExternalStore(
    subscribeToDisplayMode,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false
  );

  const isIOS = useSyncExternalStore(
    () => () => {},
    () => /iPad|iPhone|iPod/.test(navigator.userAgent),
    () => false
  );

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed) return null;

  if (deferred) {
    return (
      <button
        type="button"
        onClick={async () => {
          await deferred.prompt();
          setDeferred(null);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-mosh-line-strong px-3 py-1.5 text-xs text-mosh-ink hover:border-mosh-brand hover:text-mosh-brand"
      >
        <Download size={14} aria-hidden />
        Install app
      </button>
    );
  }

  if (isIOS) {
    return (
      <p className="text-xs text-mosh-ink-subtle">
        To install: tap Share, then &ldquo;Add to Home Screen&rdquo;.
      </p>
    );
  }

  return null;
}
