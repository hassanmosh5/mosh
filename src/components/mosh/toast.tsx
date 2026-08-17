"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useMoshUi, type ToastTone } from "@/lib/mosh/store";
import { cx } from "./ui";

/**
 * Transient confirmations.
 *
 * Announced politely to screen readers, dismissible by hand, and never the
 * only place an outcome is reported — saved state is always visible in the
 * page itself as well.
 */

const ICONS: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastHost() {
  const { toasts, dismiss } = useMoshUi();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.tone];
        return (
          <div
            key={toast.id}
            className={cx(
              "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border bg-mosh-surface px-4 py-3 text-sm shadow-[var(--mosh-shadow)]",
              toast.tone === "error" ? "border-mosh-bad/40" : "border-mosh-line"
            )}
          >
            <Icon
              size={17}
              aria-hidden
              className={cx(
                "mt-0.5 shrink-0",
                toast.tone === "error" ? "text-mosh-bad" : "text-mosh-brand"
              )}
            />
            <p className="flex-1 text-mosh-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="text-mosh-ink-subtle hover:text-mosh-ink"
            >
              <X size={15} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
