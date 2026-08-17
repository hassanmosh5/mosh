"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Send, Sparkles, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { COACH_PATTERNS, COACH_PATTERN_LABELS } from "@/lib/mosh/constants";
import type { CoachSessionView } from "@/lib/mosh/services/coach";
import type { MoshPattern } from "@/generated/prisma/enums";
import { Badge, Card, Field, buttonClass, cx, inputClass } from "@/components/mosh/ui";

/**
 * The Billionaire Self.
 *
 * Two engines behind one interface: a written playbook that always answers,
 * and the model when a key is configured. The badge on every response says
 * which one spoke — guidance is never passed off as something it is not.
 */

type Session = Omit<CoachSessionView, "signals"> & { signals?: CoachSessionView["signals"] };

export function CoachConsole({
  history,
  aiEnabled,
}: {
  history: Session[];
  aiEnabled: boolean;
}) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const [latest, setLatest] = useState<Session | null>(null);
  const [pattern, setPattern] = useState<MoshPattern>("LIMITING_BELIEF");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { situation: "" } });

  const submit = handleSubmit(async (values) => {
    try {
      const session = await api.post<CoachSessionView>("/api/mosh/coach", {
        pattern,
        situation: values.situation,
      });
      setLatest(session);
      reset({ situation: "" });
      toast("Your older self has answered.");
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not send.", "error");
    }
  });

  const selected = COACH_PATTERNS.find((entry) => entry.pattern === pattern);

  return (
    <div className="space-y-4">
      <Card
        title="What are you working through?"
        description={
          aiEnabled
            ? "Answers are personalised by the model, grounded strictly in the numbers you have recorded."
            : "The model is not configured on this server, so the written playbook answers. It is complete on its own — set ANTHROPIC_API_KEY to add personalisation."
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {COACH_PATTERNS.map((entry) => (
            <button
              key={entry.pattern}
              type="button"
              onClick={() => setPattern(entry.pattern)}
              aria-pressed={pattern === entry.pattern}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs transition",
                pattern === entry.pattern
                  ? "border-mosh-brand bg-mosh-brand-soft text-mosh-brand"
                  : "border-mosh-line text-mosh-ink-muted hover:border-mosh-brand"
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {selected ? (
          <p className="mb-4 text-sm leading-relaxed text-mosh-ink-muted">
            <span className="font-medium text-mosh-ink">How it shows up:</span> {selected.tell}
            <br />
            <span className="font-medium text-mosh-ink">Ask yourself:</span> {selected.question}
          </p>
        ) : null}

        <form onSubmit={submit} className="space-y-3">
          <Field label="The situation" htmlFor="situation">
            <textarea
              id="situation"
              rows={5}
              required
              placeholder="Write it as you would say it out loud. The more specific, the more useful the answer."
              className={inputClass}
              {...register("situation", { required: true })}
            />
          </Field>
          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className={buttonClass("primary")}>
              {isSubmitting ? (
                <Loader2 size={15} className="animate-spin" aria-hidden />
              ) : (
                <Send size={15} aria-hidden />
              )}
              Ask The Billionaire Self
            </button>
          </div>
        </form>
      </Card>

      {latest ? <SessionCard session={latest} highlight /> : null}

      {history.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-mosh-ink-subtle">
            Earlier sessions
          </h2>
          {history
            .filter((session) => session.id !== latest?.id)
            .map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
        </div>
      ) : null}
    </div>
  );
}

function SessionCard({ session, highlight }: { session: Session; highlight?: boolean }) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/mosh/coach?id=${session.id}`);
      toast("Session removed.");
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      className={cx(highlight && "border-mosh-brand/50")}
      title={COACH_PATTERN_LABELS[session.pattern]}
      description={new Date(session.createdAt).toLocaleString()}
      actions={
        <div className="flex items-center gap-2">
          <Badge tone={session.source === "AI" ? "brand" : "neutral"}>
            {session.source === "AI" ? `Model · ${session.model ?? "AI"}` : "Written playbook"}
          </Badge>
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            aria-label="Delete session"
            className="text-mosh-ink-subtle transition hover:text-mosh-bad"
          >
            <Trash2 size={14} aria-hidden />
          </button>
        </div>
      }
    >
      <blockquote className="mb-4 border-l-2 border-mosh-line pl-3 text-sm italic leading-relaxed text-mosh-ink-muted">
        {session.situation}
      </blockquote>

      <div className="space-y-4 text-sm leading-relaxed">
        <section>
          <h3 className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-mosh-ink-subtle">
            What is actually happening
          </h3>
          <p className="text-mosh-ink">{session.analysis}</p>
        </section>

        <section className="rounded-xl bg-mosh-brand-soft/60 p-4">
          <h3 className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-mosh-brand">
            <Sparkles size={13} aria-hidden />
            From your older self
          </h3>
          <p className="text-mosh-ink">{session.encouragement}</p>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-mosh-ink-subtle">
            Do these in the next 48 hours
          </h3>
          <ol className="space-y-1.5">
            {session.actions.map((action, index) => (
              <li key={action} className="flex gap-2.5 text-mosh-ink">
                <span className="shrink-0 font-medium tabular-nums text-mosh-brand">
                  {index + 1}.
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </section>

        {session.prompts.length > 0 ? (
          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-mosh-ink-subtle">
              Sit with these
            </h3>
            <ul className="space-y-1.5">
              {session.prompts.map((prompt) => (
                <li key={prompt} className="text-mosh-ink-muted">
                  — {prompt}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {session.recommendations.length > 0 ? (
          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-mosh-ink-subtle">
              Alignment recommendations, from your own numbers
            </h3>
            <ul className="space-y-1.5">
              {session.recommendations.map((recommendation) => (
                <li key={recommendation} className="text-mosh-ink-muted">
                  — {recommendation}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </Card>
  );
}
