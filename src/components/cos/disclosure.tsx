"use client";

import { useState, type ReactNode } from "react";
import { Button } from "./controls";

/**
 * Inline "new record" panel. Keeps create forms out of the way until needed,
 * which is what makes the dense list views readable.
 */
export function CreatePanel({
  label,
  title,
  children,
  defaultOpen = false,
}: {
  label: string;
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <Button
        type="button"
        variant={open ? "secondary" : "primary"}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {open ? "Cancel" : label}
      </Button>
      {open ? (
        <div className="mt-4 rounded-xl border border-line bg-surface p-4">
          {title ? <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}
