import Link from "next/link";
import type { ReactNode } from "react";

/** Tiny class-name joiner — avoids pulling in another dependency. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cx(
        "rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className
      )}
    >
      {title || actions ? (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div className="min-w-0">
            {title ? <h2 className="text-sm font-semibold text-ink">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-xs text-ink-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={padded ? "p-4" : undefined}>{children}</div>
    </section>
  );
}

export function Grid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const map = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  } as const;
  return <div className={cx("grid grid-cols-1 gap-4", map[cols])}>{children}</div>;
}

// ---------------------------------------------------------------------------
// Data display
// ---------------------------------------------------------------------------

export function Stat({
  label,
  value,
  hint,
  tone = "neutral",
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
  href?: string;
}) {
  const body = (
    <div className="rounded-xl border border-line bg-surface p-4 transition hover:border-brand/50">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <p className={cx("mt-1 text-2xl font-semibold tabular-nums", toneText(tone))}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

export type Tone = "neutral" | "good" | "warn" | "bad" | "info" | "brand";

function toneText(tone: Tone): string {
  switch (tone) {
    case "good": return "text-good";
    case "warn": return "text-warn";
    case "bad": return "text-bad";
    case "info": return "text-info";
    case "brand": return "text-brand";
    default: return "text-ink";
  }
}

export function Badge({
  children,
  tone = "neutral",
  title,
}: {
  children: ReactNode;
  tone?: Tone;
  title?: string;
}) {
  const map: Record<Tone, string> = {
    neutral: "border-line bg-surface-2 text-ink-muted",
    good: "border-good/30 bg-good/10 text-good",
    warn: "border-warn/30 bg-warn/10 text-warn",
    bad: "border-bad/30 bg-bad/10 text-bad",
    info: "border-info/30 bg-info/10 text-info",
    brand: "border-brand/30 bg-brand-soft text-brand",
  };
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium",
        map[tone]
      )}
    >
      {children}
    </span>
  );
}

export function HealthDot({ health }: { health: "GREEN" | "YELLOW" | "RED" }) {
  const map = { GREEN: "bg-good", YELLOW: "bg-warn", RED: "bg-bad" } as const;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cx("h-2 w-2 rounded-full", map[health])} aria-hidden />
      <span className="sr-only">{health.toLowerCase()}</span>
    </span>
  );
}

export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: Tone }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const map: Record<Tone, string> = {
    neutral: "bg-ink-subtle",
    good: "bg-good",
    warn: "bg-warn",
    bad: "bg-bad",
    info: "bg-info",
    brand: "bg-brand",
  };
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cx("h-full rounded-full transition-all", map[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Table({
  head,
  children,
  empty,
}: {
  head: ReactNode[];
  children: ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="cos-scroll overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {head.map((cell, i) => (
              <th
                key={i}
                className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-ink-subtle"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={empty ? undefined : "divide-y divide-line"}>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cx("px-3 py-2.5 align-middle text-ink", className)}>{children}</td>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-10 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx("animate-pulse rounded-md bg-surface-2", className)}
      aria-hidden
    />
  );
}

export function LoadingCard({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

export function DataNotice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-line bg-surface-2 px-3 py-2 text-xs text-ink-muted">
      {children}
    </p>
  );
}
