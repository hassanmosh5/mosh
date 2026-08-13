"use client";

import { useEffect } from "react";
import { Button } from "@/components/cos/controls";

/**
 * Segment error boundary. Users see an actionable message; the underlying error
 * goes to the server/browser console, never onto the page.
 */
export default function CosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[m-cos] render error", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-line bg-surface p-6 text-center">
      <h1 className="text-lg font-semibold text-ink">Something went wrong on this screen</h1>
      <p className="mt-2 text-sm text-ink-muted">
        The error has been logged. You can retry, or go back to the dashboard and try again from there.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[11px] text-ink-subtle">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-4 flex justify-center gap-2">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <a
          href="/cos"
          className="inline-flex items-center rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-ink hover:bg-surface-2"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
