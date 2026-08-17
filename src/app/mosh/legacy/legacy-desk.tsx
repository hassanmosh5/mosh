"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Pin, Plus, Save, Trash2, X } from "lucide-react";
import { api, ApiError } from "@/lib/mosh/client";
import { useMoshUi } from "@/lib/mosh/store";
import { LEGACY_PROMPTS } from "@/lib/mosh/constants";
import type { LetterView } from "@/lib/mosh/services/legacy";
import { Badge, Card, Field, buttonClass, cx, inputClass } from "@/components/mosh/ui";

/**
 * A Message From My 77-Year-Old Self.
 *
 * The default letter is seeded into the collection rather than printed as
 * decoration, so it can be edited, answered, and added to over years. Letters
 * are written in plain text and rendered with their line breaks intact —
 * nothing about this page should feel like filling in a form.
 */

const KIND_LABELS = {
  FUTURE_WISDOM: "Future wisdom",
  LEGACY_LESSON: "Legacy lesson",
  ADVICE_TO_YOUNGER_SELF: "Advice to my younger self",
} as const;

type Kind = keyof typeof KIND_LABELS;

export function LegacyDesk({ letters }: { letters: LetterView[] }) {
  const [editing, setEditing] = useState<LetterView | null>(null);
  const [composing, setComposing] = useState(false);

  return (
    <div className="space-y-4">
      <Card
        title="Prompts, if you need them"
        description="Write as the person who already made it through. Present tense, no hedging."
        actions={
          <button
            type="button"
            onClick={() => {
              setComposing(true);
              setEditing(null);
            }}
            className={buttonClass("primary", "sm")}
          >
            <Plus size={14} aria-hidden />
            Write a letter
          </button>
        }
      >
        <ul className="grid grid-cols-1 gap-2 text-sm text-mosh-ink-muted md:grid-cols-2">
          {LEGACY_PROMPTS.map((prompt) => (
            <li key={prompt} className="rounded-xl bg-mosh-surface-2/70 px-3.5 py-2.5">
              {prompt}
            </li>
          ))}
        </ul>
      </Card>

      {composing ? (
        <LetterEditor
          onClose={() => setComposing(false)}
          title="A new letter"
        />
      ) : null}

      {letters.map((letter) =>
        editing?.id === letter.id ? (
          <LetterEditor
            key={letter.id}
            letter={letter}
            title="Editing"
            onClose={() => setEditing(null)}
          />
        ) : (
          <Card
            key={letter.id}
            title={letter.title}
            description={`Written ${new Date(letter.createdAt).toLocaleDateString()}`}
            actions={
              <div className="flex items-center gap-2">
                {letter.pinned ? (
                  <Badge tone="brand">
                    <Pin size={11} aria-hidden className="mr-1" />
                    Pinned
                  </Badge>
                ) : null}
                <Badge>{KIND_LABELS[letter.kind]}</Badge>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(letter);
                    setComposing(false);
                  }}
                  aria-label={`Edit ${letter.title}`}
                  className="text-mosh-ink-subtle transition hover:text-mosh-brand"
                >
                  <Pencil size={14} aria-hidden />
                </button>
                <DeleteButton id={letter.id} title={letter.title} />
              </div>
            }
            className={cx(letter.pinned && "border-mosh-brand/40")}
          >
            <div className="space-y-3 text-[15px] leading-loose text-mosh-ink">
              {letter.body.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        )
      )}
    </div>
  );
}

function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      aria-label={`Delete ${title}`}
      onClick={async () => {
        setBusy(true);
        try {
          await api.delete(`/api/mosh/legacy?id=${id}`);
          toast("Letter removed.");
          router.refresh();
        } catch (error) {
          toast(error instanceof ApiError ? error.message : "That did not delete.", "error");
        } finally {
          setBusy(false);
        }
      }}
      className="text-mosh-ink-subtle transition hover:text-mosh-bad"
    >
      <Trash2 size={14} aria-hidden />
    </button>
  );
}

function LetterEditor({
  letter,
  title,
  onClose,
}: {
  letter?: LetterView;
  title: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useMoshUi((state) => state.toast);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: letter?.title ?? "A Message From My 77-Year-Old Self",
      body: letter?.body ?? "",
      kind: (letter?.kind ?? "FUTURE_WISDOM") as Kind,
      pinned: letter?.pinned ?? false,
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await api.post("/api/mosh/legacy", {
        id: letter?.id,
        title: values.title,
        body: values.body,
        kind: values.kind,
        pinned: Boolean(values.pinned),
      });
      toast("Letter saved.");
      onClose();
      router.refresh();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "That did not save.", "error");
    }
  });

  return (
    <Card
      title={title}
      actions={
        <button type="button" onClick={onClose} aria-label="Close editor" className="text-mosh-ink-subtle hover:text-mosh-ink">
          <X size={16} aria-hidden />
        </button>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
          <Field label="Title" htmlFor="letter-title">
            <input
              id="letter-title"
              className={inputClass}
              required
              {...register("title", { required: true })}
            />
          </Field>
          <Field label="Kind" htmlFor="letter-kind">
            <select id="letter-kind" className={inputClass} {...register("kind")}>
              {Object.entries(KIND_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="The letter" htmlFor="letter-body">
          <textarea
            id="letter-body"
            rows={12}
            required
            placeholder="Dear younger me…"
            className={`${inputClass} leading-loose`}
            {...register("body", { required: true })}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-mosh-ink-muted">
          <input type="checkbox" className="accent-[var(--mosh-brand)]" {...register("pinned")} />
          Keep this one at the top
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={buttonClass("ghost", "sm")}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "sm")}>
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <Save size={14} aria-hidden />
            )}
            Save letter
          </button>
        </div>
      </form>
    </Card>
  );
}
