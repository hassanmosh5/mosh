"use client";

import { useState } from "react";

type Note = {
  id: string;
  body: string;
  createdAt: string;
};

export function NotesSection({
  lessonId,
  initialNotes,
}: {
  lessonId: string;
  initialNotes: Note[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  async function addNote() {
    const body = draft.trim();
    if (!body) return;
    setSaving(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, body }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setNotes((prev) => [data.note, ...prev]);
      setDraft("");
    }
  }

  async function saveEdit(noteId: string) {
    const body = editBody.trim();
    if (!body) return;
    const res = await fetch(`/api/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      const data = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === noteId ? data.note : n)));
      setEditingId(null);
    }
  }

  async function deleteNote(noteId: string) {
    const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  }

  return (
    <div className="mt-10 rounded-xl border border-black/10 p-5 dark:border-white/10">
      <h2 className="font-medium">Your notes</h2>

      <div className="mt-3 flex flex-col gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Jot down a thought about this lesson..."
          rows={3}
          className="rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
        />
        <button
          onClick={addNote}
          disabled={saving || !draft.trim()}
          className="self-start rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-85 disabled:opacity-40 dark:bg-white dark:text-black"
        >
          {saving ? "Saving..." : "Add note"}
        </button>
      </div>

      {notes.length > 0 && (
        <ul className="mt-5 flex flex-col gap-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10"
            >
              {editingId === note.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={3}
                    className="rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(note.id)}
                      className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white hover:opacity-85 dark:bg-white dark:text-black"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-full border border-black/15 px-3 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-black/80 dark:text-white/80">
                    {note.body}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => {
                        setEditingId(note.id);
                        setEditBody(note.body);
                      }}
                      className="underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
