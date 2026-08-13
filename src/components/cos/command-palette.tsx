"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/cos/constants";

type SearchHit = {
  type: string;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
};

type Command = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

/**
 * ⌘K / Ctrl+K command centre.
 *
 * Navigation commands are local; entity results come from /api/cos/search,
 * which is debounced and aborts in-flight requests so fast typing does not
 * queue a stack of queries.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Opening and closing reset the palette's transient state here rather than in
  // an effect, so no render is triggered by another render.
  const openPalette = useCallback(() => {
    setActiveIndex(0);
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHits([]);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => {
          if (value) {
            closePalette();
            return false;
          }
          setActiveIndex(0);
          return true;
        });
      }
      if (event.key === "Escape") closePalette();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePalette]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open || query.trim().length < 2) return;
    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const response = await fetch(`/api/cos/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (response.ok) {
          const body = (await response.json()) as { results: SearchHit[] };
          setHits(body.results ?? []);
        } else {
          setHits([]);
        }
      } catch {
        /* aborted or offline — leave the previous results in place */
      } finally {
        setLoading(false);
      }
    }, 180);
    // Cancelling here covers both a new keystroke and the palette closing, so
    // an in-flight search never lands after the user has moved on.
    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query, open]);

  const go = useCallback(
    (href: string) => {
      closePalette();
      router.push(href);
    },
    [router, closePalette]
  );

  const commands = useMemo<Command[]>(() => {
    const base: Command[] = NAV_ITEMS.map((item) => ({
      id: `nav:${item.href}`,
      label: `Go to ${item.label}`,
      hint: "Navigate",
      run: () => go(item.href),
    }));

    const actions: Command[] = [
      { id: "act:task", label: "Add task", hint: "Tasks", run: () => go("/cos/tasks?new=1") },
      { id: "act:project", label: "Create project", hint: "Projects", run: () => go("/cos/projects?new=1") },
      { id: "act:lead", label: "Add lead", hint: "CRM", run: () => go("/cos/crm?new=1") },
      { id: "act:brief", label: "Generate morning briefing", hint: "Reports", run: () => go("/cos/reports?generate=DAILY_BRIEFING") },
      { id: "act:weekly", label: "Create weekly executive report", hint: "Reports", run: () => go("/cos/reports?generate=WEEKLY_EXECUTIVE") },
      { id: "act:pipeline", label: "Review sales pipeline", hint: "CRM", run: () => go("/cos/crm") },
      { id: "act:auto", label: "Find automation opportunities", hint: "Automations", run: () => go("/cos/automations") },
      { id: "act:agent", label: "Launch an AI agent", hint: "Agents", run: () => go("/cos/agents") },
      { id: "act:knowledge", label: "Search knowledge base", hint: "Knowledge", run: () => go("/cos/knowledge") },
      { id: "act:chat", label: "Ask the Chief of Staff", hint: "Chat", run: () => go("/cos/chat") },
    ];

    const needle = query.trim().toLowerCase();
    const all = [...actions, ...base];
    if (!needle) return all.slice(0, 8);
    return all.filter((command) => command.label.toLowerCase().includes(needle)).slice(0, 6);
  }, [query, go]);

  const rows = useMemo(
    () => [
      ...commands.map((command) => ({ kind: "command" as const, command })),
      ...(query.trim().length >= 2 ? hits.map((hit) => ({ kind: "hit" as const, hit })) : []),
    ],
    [commands, hits, query]
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={openPalette}
        className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink-subtle transition hover:text-ink md:inline-flex"
      >
        <span>Search or run a command</span>
        <kbd className="rounded border border-line bg-surface-2 px-1 py-0.5 font-mono text-[10px]">⌘K</kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command centre"
      onClick={(event) => {
        if (event.target === event.currentTarget) closePalette();
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((i) => Math.min(rows.length - 1, i + 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((i) => Math.max(0, i - 1));
            } else if (event.key === "Enter") {
              event.preventDefault();
              const row = rows[activeIndex];
              if (!row) return;
              if (row.kind === "command") row.command.run();
              else go(row.hit.href);
            }
          }}
          placeholder="Search clients, projects, tasks — or type a command"
          className="w-full border-b border-line bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-subtle"
          aria-label="Search or run a command"
        />
        <div className="cos-scroll max-h-80 overflow-y-auto py-1">
          {loading ? <p className="px-4 py-2 text-xs text-ink-subtle">Searching…</p> : null}
          {rows.length === 0 && !loading ? (
            <p className="px-4 py-6 text-center text-sm text-ink-muted">No matches.</p>
          ) : null}
          {rows.map((row, index) => {
            const isActive = index === activeIndex;
            const key = row.kind === "command" ? row.command.id : `${row.hit.type}:${row.hit.id}`;
            const label = row.kind === "command" ? row.command.label : row.hit.title;
            const hint = row.kind === "command" ? row.command.hint : row.hit.subtitle ?? row.hit.type;
            return (
              <button
                key={key}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => (row.kind === "command" ? row.command.run() : go(row.hit.href))}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm ${
                  isActive ? "bg-surface-2 text-ink" : "text-ink-muted"
                }`}
              >
                <span className="truncate">{label}</span>
                {hint ? (
                  <span className="shrink-0 text-[11px] uppercase tracking-wide text-ink-subtle">
                    {hint}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
