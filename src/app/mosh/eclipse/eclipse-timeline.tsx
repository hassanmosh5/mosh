"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Play } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { ECLIPSE_PHASES } from "@/lib/mosh/constants";
import type { EclipseView } from "@/lib/mosh/services/eclipse";
import { Badge, Card, buttonClass, cx, inputClass, labelClass } from "@/components/mosh/ui";

/**
 * The 50-Day Eclipse timeline.
 *
 * Fifty dots, five phases, one action a day. The dot strip is a real control —
 * each dot is a button that scrolls its day into view — and every day carries
 * a note field, because the reason a day was hard is worth more later than the
 * tick itself.
 */

export function EclipseTimeline({ eclipse }: { eclipse: EclipseView }) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const [busy, setBusy] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(
    eclipse.startDate ?? new Date().toISOString().slice(0, 10)
  );
  const [starting, setStarting] = useState(false);

  const toggle = async (day: number, done: boolean) => {
    setBusy(day);
    try {
      await api.patch("/api/mosh/eclipse", { day, done });
      toast(done ? `Day ${day} complete.` : `Day ${day} reopened.`);
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not save.", "error");
    } finally {
      setBusy(null);
    }
  };

  const start = async (reset: boolean) => {
    setStarting(true);
    try {
      await api.post("/api/mosh/eclipse", { startDate, reset });
      toast(reset ? "The fifty days have been restarted." : "The clock is set.");
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not save.", "error");
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card
        title="The clock"
        description="Set the day the fifty begin, and every action lands on a real date in your calendar."
      >
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className={labelClass} htmlFor="eclipse-start">
              Start date
            </label>
            <input
              id="eclipse-start"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className={`${inputClass} mt-1.5 max-w-xs`}
            />
          </div>
          <button
            type="button"
            onClick={() => start(false)}
            disabled={starting}
            className={buttonClass("primary", "sm")}
          >
            {starting ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <Play size={14} aria-hidden />
            )}
            {eclipse.startDate ? "Update start date" : "Start the 50 days"}
          </button>
          {eclipse.startDate ? (
            <button
              type="button"
              onClick={() => start(true)}
              disabled={starting}
              className={buttonClass("secondary", "sm")}
            >
              Restart and clear progress
            </button>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap gap-1.5" role="list" aria-label="Fifty day timeline">
            {eclipse.days.map((day) => (
              <a
                key={day.day}
                href={`#eclipse-day-${day.day}`}
                role="listitem"
                title={`Day ${day.day}: ${day.focus}${day.done ? " (done)" : ""}`}
                className={cx(
                  "flex h-7 w-7 items-center justify-center rounded-md border text-[11px] tabular-nums transition",
                  day.done
                    ? "border-mosh-brand bg-mosh-brand text-mosh-brand-ink"
                    : day.isToday
                      ? "border-mosh-accent text-mosh-accent"
                      : "border-mosh-line text-mosh-ink-subtle hover:border-mosh-brand"
                )}
              >
                {day.day}
              </a>
            ))}
          </div>
        </div>
      </Card>

      {ECLIPSE_PHASES.map((phase) => {
        const summary = eclipse.phases.find((entry) => entry.phase === phase.phase);
        const days = eclipse.days.filter(
          (day) => day.day >= phase.range[0] && day.day <= phase.range[1]
        );

        return (
          <Card
            key={phase.phase}
            title={`Phase ${phase.number} — ${phase.label}`}
            description={`${phase.promise} · Days ${phase.range[0]}–${phase.range[1]}`}
            actions={
              <div className="flex items-center gap-2">
                {summary?.isCurrent ? <Badge tone="brand">Current phase</Badge> : null}
                <Badge>
                  {summary?.done ?? 0}/{summary?.total ?? 0}
                </Badge>
              </div>
            }
          >
            <ul className="space-y-2">
              {days.map((day) => (
                <li
                  key={day.day}
                  id={`eclipse-day-${day.day}`}
                  className={cx(
                    "flex items-start gap-3 rounded-xl border p-3.5 scroll-mt-24",
                    day.isToday ? "border-mosh-accent/60 bg-mosh-accent-soft/40" : "border-mosh-line"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(day.day, !day.done)}
                    disabled={busy === day.day}
                    aria-pressed={day.done}
                    aria-label={`${day.done ? "Reopen" : "Complete"} day ${day.day}`}
                    className={cx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                      day.done
                        ? "border-mosh-brand bg-mosh-brand text-mosh-brand-ink"
                        : "border-mosh-line-strong hover:border-mosh-brand"
                    )}
                  >
                    {busy === day.day ? (
                      <Loader2 size={12} className="animate-spin" aria-hidden />
                    ) : day.done ? (
                      <Check size={13} strokeWidth={3} aria-hidden />
                    ) : null}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-mosh-ink">
                      <span>
                        Day {day.day} · {day.focus}
                      </span>
                      {day.date ? (
                        <span className="text-xs font-normal text-mosh-ink-subtle">{day.date}</span>
                      ) : null}
                      {day.isToday ? <Badge tone="warn">Today</Badge> : null}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-mosh-ink-muted">{day.action}</p>
                    <NoteField day={day.day} note={day.note} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}

function NoteField({ day, note }: { day: number; note: string | null }) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const [value, setValue] = useState(note ?? "");
  const [saving, setSaving] = useState(false);
  const dirty = value !== (note ?? "");

  const save = async () => {
    setSaving(true);
    try {
      await api.patch("/api/mosh/eclipse", { day, note: value });
      toast(`Note saved for day ${day}.`);
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not save.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="What happened when you did this?"
        aria-label={`Note for day ${day}`}
        className={`${inputClass} flex-1`}
      />
      {dirty ? (
        <button type="button" onClick={save} disabled={saving} className={buttonClass("secondary", "sm")}>
          {saving ? <Loader2 size={13} className="animate-spin" aria-hidden /> : null}
          Save note
        </button>
      ) : null}
    </div>
  );
}
