"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  BarChart3,
  Briefcase,
  CalendarCheck,
  CalendarRange,
  Compass,
  Filter,
  LayoutDashboard,
  Menu,
  Moon,
  ScrollText,
  Settings,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useMoshUi } from "@/lib/mosh/store";
import { cx } from "./ui";

/**
 * The application navigation.
 *
 * One list, two presentations: a fixed rail from `lg` up, and a drawer below
 * it. The drawer's open state lives in the Zustand store so the header button
 * and the links themselves can both drive it without prop-drilling.
 */

export const NAV_ITEMS = [
  { href: "/mosh", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/mosh/daily", label: "Daily rhythm", icon: Sun },
  { href: "/mosh/weekly", label: "Weekly momentum", icon: CalendarRange },
  { href: "/mosh/monthly", label: "Monthly review", icon: CalendarCheck },
  { href: "/mosh/plan", label: "365-day plan", icon: Compass },
  { href: "/mosh/business", label: "Offer ecosystem", icon: Briefcase },
  { href: "/mosh/funnel", label: "Customer funnel", icon: Filter },
  { href: "/mosh/eclipse", label: "50-Day Eclipse", icon: Moon },
  { href: "/mosh/coach", label: "The Billionaire Self", icon: Sparkles },
  { href: "/mosh/legacy", label: "My 77-year-old self", icon: ScrollText },
  { href: "/mosh/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/mosh/settings", label: "Settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-0.5" aria-label="MOSH sections">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              active
                ? "bg-mosh-brand-soft font-medium text-mosh-brand"
                : "text-mosh-ink-muted hover:bg-mosh-surface-2 hover:text-mosh-ink"
            )}
          >
            <Icon size={17} strokeWidth={1.8} aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Wordmark({ philosophy }: { philosophy: string }) {
  return (
    <Link href="/mosh" className="block px-3 py-1">
      <p className="text-base font-semibold tracking-tight text-mosh-ink">MOSH</p>
      <p className="text-[11px] leading-tight text-mosh-ink-subtle">
        Self-Mastery &amp; Wealth Alignment
      </p>
      <p className="mt-2 text-[11px] italic leading-tight text-mosh-brand">{philosophy}</p>
    </Link>
  );
}

export function Sidebar({ philosophy }: { philosophy: string }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-mosh-line bg-mosh-surface lg:block">
      <div className="sticky top-0 flex h-dvh flex-col gap-6 overflow-y-auto px-3 py-6">
        <Wordmark philosophy={philosophy} />
        <NavLinks />
      </div>
    </aside>
  );
}

export function MobileNav({ philosophy }: { philosophy: string }) {
  const { navOpen, toggleNav, closeNav } = useMoshUi();
  const pathname = usePathname();
  // The drawer is portalled to <body> on purpose: the header it sits in uses
  // `backdrop-blur`, and a backdrop filter makes an element the containing
  // block for its fixed-position descendants — which would pin a full-screen
  // overlay to the height of the header instead of the viewport.
  //
  // No "mounted" guard is needed around the portal: `navOpen` starts false and
  // can only become true from a click, so `document.body` is never reached
  // during server rendering.

  // A route change always closes the drawer — otherwise the overlay would sit
  // on top of the page the user just asked for.
  useEffect(() => {
    closeNav();
  }, [pathname, closeNav]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNav();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen, closeNav]);

  return (
    <>
      <button
        type="button"
        onClick={toggleNav}
        aria-expanded={navOpen}
        aria-controls="mosh-mobile-nav"
        className="inline-flex items-center gap-2 rounded-full border border-mosh-line-strong px-3 py-1.5 text-sm text-mosh-ink lg:hidden"
      >
        {navOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
        <span>Menu</span>
      </button>

      {navOpen
        ? createPortal(
            <div className="mosh-portal fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={closeNav}
                className="absolute inset-0 bg-black/30"
              />
              <div
                id="mosh-mobile-nav"
                className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-mosh-line bg-mosh-surface px-3 py-6"
              >
                <Wordmark philosophy={philosophy} />
                <NavLinks onNavigate={closeNav} />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
