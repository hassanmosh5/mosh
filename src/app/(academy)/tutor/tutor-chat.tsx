"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function TutorChat({ lessonSlug }: { lessonSlug?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: lessonSlug
        ? "I'm grounded in this lesson right now — ask me anything about it."
        : "Ask me anything about The AI Income Blueprint — frameworks, tools, income streams, or the launch plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonSlug,
        messages: next.filter((m) => m.role === "user" || m.role === "assistant"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "ml-auto bg-black text-white dark:bg-white dark:text-black"
                : "bg-black/5 dark:bg-white/10"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-[85%] rounded-xl bg-black/5 px-4 py-2.5 text-sm text-black/40 dark:bg-white/10 dark:text-white/40">
            Thinking...
          </div>
        )}
        {error && (
          <div className="max-w-[85%] rounded-xl border border-red-600/40 bg-red-600/5 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 border-t border-black/10 p-3 dark:border-white/10"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a framework, tool, or income stream..."
          className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-85 disabled:opacity-40 dark:bg-white dark:text-black"
        >
          Send
        </button>
      </form>
    </div>
  );
}
