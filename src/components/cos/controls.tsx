import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "./ui";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink hover:opacity-90 border-transparent",
  secondary: "bg-surface text-ink border-line hover:bg-surface-2",
  ghost: "bg-transparent text-ink-muted border-transparent hover:bg-surface-2 hover:text-ink",
  danger: "bg-transparent text-bad border-bad/40 hover:bg-bad/10",
};

const SIZES: Record<Size, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3.5 py-2 text-sm",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md"): string {
  return cx(
    "inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size]
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={cx(buttonClass(variant, size), className)} />;
}

export function LinkButton({
  href,
  variant = "secondary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cx(buttonClass(variant, size), className)}>
      {children}
    </Link>
  );
}

const CONTROL_BASE =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle disabled:opacity-60";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={cx(CONTROL_BASE, className)} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea {...props} className={cx(CONTROL_BASE, "min-h-24 resize-y", className)} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select {...props} className={cx(CONTROL_BASE, "pr-8", className)}>
      {children}
    </select>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("space-y-1", className)}>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-ink-muted">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-ink-subtle">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-bad" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-bad/40 bg-bad/10 px-3 py-2 text-sm text-bad"
    >
      {message}
    </p>
  );
}
