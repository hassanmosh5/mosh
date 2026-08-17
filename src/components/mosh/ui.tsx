import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The MOSH component vocabulary.
 *
 * Calm, elegant, therapeutic: generous spacing, one accent, no shadows louder
 * than a whisper. Every component reads from the `--mosh-*` tokens, so the
 * emerald-and-cream identity is defined in exactly one place.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export type Tone = "neutral" | "good" | "warn" | "bad" | "brand";

export function toneText(tone: Tone): string {
  switch (tone) {
    case "good": return "text-mosh-good";
    case "warn": return "text-mosh-warn";
    case "bad": return "text-mosh-bad";
    case "brand": return "text-mosh-brand";
    default: return "text-mosh-ink";
  }
}

function toneFill(tone: Tone): string {
  switch (tone) {
    case "good": return "bg-mosh-good";
    case "warn": return "bg-mosh-warn";
    case "bad": return "bg-mosh-bad";
    default: return "bg-mosh-brand";
  }
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-mosh-brand">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-mosh-ink sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mosh-ink-muted">
            {description}
          </p>
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
        "rounded-2xl border border-mosh-line bg-mosh-surface shadow-[var(--mosh-shadow)]",
        className
      )}
    >
      {title || actions ? (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-mosh-line px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-sm font-semibold tracking-tight text-mosh-ink">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-xs leading-relaxed text-mosh-ink-muted">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={padded ? "p-5" : undefined}>{children}</div>
    </section>
  );
}

export function Grid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const map = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  } as const;
  return <div className={cx("grid grid-cols-1 gap-4", map[cols])}>{children}</div>;
}

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------

/**
 * A horizontal progress bar with its own label, value and band.
 *
 * The percentage is written next to the bar rather than only drawn, so the
 * number is never carried by length or colour alone.
 */
export function ScoreBar({
  label,
  value,
  description,
  detail,
  band,
  tone = "brand",
  href,
}: {
  label: string;
  value: number;
  description?: string;
  detail?: string;
  band?: string;
  tone?: Tone;
  href?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  const body = (
    <div className="rounded-2xl border border-mosh-line bg-mosh-surface p-5 shadow-[var(--mosh-shadow)] transition hover:border-mosh-brand/50">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-mosh-ink">{label}</h3>
        <p className={cx("text-2xl font-semibold tabular-nums", toneText(tone))}>{clamped}%</p>
      </div>
      {description ? (
        <p className="mt-1 text-xs leading-relaxed text-mosh-ink-muted">{description}</p>
      ) : null}
      <div
        className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-mosh-surface-2"
        role="img"
        aria-label={`${label}: ${clamped} percent${band ? `, ${band}` : ""}`}
      >
        <div
          className={cx("h-full rounded-full transition-[width] duration-500", toneFill(tone))}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-mosh-ink-subtle">
        {band ? <span className="font-medium">{band}</span> : <span />}
        {detail ? <span className="text-right">{detail}</span> : null}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block focus-visible:outline-none">
      {body}
    </Link>
  ) : (
    body
  );
}

/**
 * A circular alignment meter.
 *
 * Drawn as an SVG ring so it stays crisp at any size, with the value repeated
 * in text at the centre.
 */
export function Meter({
  label,
  value,
  caption,
  tone = "brand",
  size = 128,
}: {
  label: string;
  value: number;
  caption?: string;
  tone?: Tone;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  const strokeColor =
    tone === "good"
      ? "var(--mosh-good)"
      : tone === "warn"
        ? "var(--mosh-warn)"
        : tone === "bad"
          ? "var(--mosh-bad)"
          : "var(--mosh-brand)";

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-mosh-line bg-mosh-surface p-5 text-center shadow-[var(--mosh-shadow)]">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: ${clamped} percent`}
        className="max-w-full"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--mosh-surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-[var(--mosh-ink)] text-xl font-semibold"
          style={{ fontSize: size * 0.22 }}
        >
          {clamped}
        </text>
      </svg>
      <div>
        <p className="text-sm font-semibold tracking-tight text-mosh-ink">{label}</p>
        {caption ? <p className="mt-1 text-xs text-mosh-ink-muted">{caption}</p> : null}
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="rounded-2xl border border-mosh-line bg-mosh-surface p-5 shadow-[var(--mosh-shadow)]">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-mosh-ink-subtle">
        {label}
      </p>
      <p className={cx("mt-2 text-2xl font-semibold tabular-nums", toneText(tone))}>{value}</p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-mosh-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const map: Record<Tone, string> = {
    neutral: "bg-mosh-surface-2 text-mosh-ink-muted",
    brand: "bg-mosh-brand-soft text-mosh-brand",
    good: "bg-mosh-brand-soft text-mosh-good",
    warn: "bg-mosh-accent-soft text-mosh-warn",
    bad: "bg-mosh-accent-soft text-mosh-bad",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        map[tone]
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-mosh-line-strong bg-mosh-surface-2/60 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-mosh-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mosh-ink-muted">
        {description}
      </p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-mosh-ink-muted">{children}</div>
  );
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

export function buttonClass(
  variant: "primary" | "secondary" | "ghost" | "danger" = "primary",
  size: "sm" | "md" = "md"
): string {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-60";
  const sizing = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const variants = {
    primary: "bg-mosh-brand text-mosh-brand-ink hover:bg-mosh-brand-strong",
    secondary:
      "border border-mosh-line-strong bg-mosh-surface text-mosh-ink hover:border-mosh-brand hover:text-mosh-brand",
    ghost: "text-mosh-ink-muted hover:bg-mosh-surface-2 hover:text-mosh-ink",
    danger: "border border-mosh-line-strong bg-mosh-surface text-mosh-bad hover:border-mosh-bad",
  } as const;
  return cx(base, sizing, variants[variant]);
}

export const inputClass =
  "w-full rounded-xl border border-mosh-line bg-mosh-surface px-3 py-2 text-sm text-mosh-ink placeholder:text-mosh-ink-subtle focus:border-mosh-brand focus:outline-none";

export const labelClass =
  "block text-xs font-medium uppercase tracking-[0.12em] text-mosh-ink-subtle";

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-mosh-ink-subtle">{hint}</p> : null}
    </div>
  );
}

/** A table that scrolls inside itself rather than pushing the page sideways. */
export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="-mx-5 overflow-x-auto px-5">{children}</div>;
}

export const tableClass = "w-full min-w-[32rem] border-collapse text-sm";
export const thClass =
  "border-b border-mosh-line px-3 py-2 text-left text-xs font-medium uppercase tracking-[0.12em] text-mosh-ink-subtle";
export const tdClass = "border-b border-mosh-line px-3 py-2.5 text-mosh-ink";
