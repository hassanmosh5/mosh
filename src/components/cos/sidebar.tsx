"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/cos/constants";
import { cx } from "./ui";

function isActive(pathname: string, href: string): boolean {
  if (href === "/cos") return pathname === "/cos";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({
  businessName,
  role,
  unreadCount,
}: {
  businessName: string;
  role: string;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-0.5" aria-label="Chief of Staff sections">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition",
              active
                ? "bg-brand-soft font-medium text-brand"
                : "text-ink-muted hover:bg-surface-2 hover:text-ink"
            )}
          >
            <span>{item.label}</span>
            {item.href === "/cos" && unreadCount > 0 ? (
              <span className="rounded-full bg-bad/15 px-1.5 py-0.5 text-[10px] font-semibold text-bad">
                {unreadCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-4 z-40 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-lg md:hidden"
        onClick={() => setMobileOpen((value) => !value)}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? "Close menu" : "Menu"}
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            className="cos-scroll h-full w-72 max-w-[85%] overflow-y-auto border-r border-line bg-surface p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <Brand businessName={businessName} role={role} />
            <div className="mt-4">{nav}</div>
          </aside>
        </div>
      ) : null}

      <aside className="cos-scroll sticky top-0 hidden h-dvh w-60 shrink-0 overflow-y-auto border-r border-line bg-surface px-3 py-4 md:block">
        <Brand businessName={businessName} role={role} />
        <div className="mt-5">{nav}</div>
      </aside>
    </>
  );
}

function Brand({ businessName, role }: { businessName: string; role: string }) {
  return (
    <div className="px-2">
      <Link href="/cos" className="block">
        <p className="text-sm font-semibold tracking-tight text-ink">MOSH Chief of Staff</p>
        <p className="truncate text-xs text-ink-subtle">{businessName}</p>
      </Link>
      <p className="mt-2 inline-flex rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-subtle">
        {role}
      </p>
    </div>
  );
}
