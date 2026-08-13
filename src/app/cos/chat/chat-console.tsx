"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Button, ErrorBanner, Textarea } from "@/components/cos/controls";
import { Badge, Card, EmptyState } from "@/components/cos/ui";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's the most important thing I should do today?",
  "Review my projects and tell me which one is slipping.",
  "Analyse my sales pipeline and tell me what's blocking revenue.",
  "Which clients need attention this week?",
  "What can I delegate and what can I automate?",
  "Prepare my weekly executive report.",
  "Give me a 90-day growth strategy for digital products.",
  "What should I stop doing?",
];

/**
 * The page remounts this component with a `key` tied to the conversation id, so
 * switching conversations reinitialises state from the server props instead of
 * syncing them in an effect.
 */
export function ChatConsole({
  configured,
  conversationId,
  conversations,
  initialMessages,
}: {
  configured: boolean;
  conversationId: string | null;
  conversations: { id: string; title: string }[];
  initialMessages: ChatMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(conversationId);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    setError(null);
    setPending(true);
    setInput("");
    const optimistic: ChatMessage = { id: `local-${Date.now()}`, role: "user", content: trimmed };
    setMessages((current) => [...current, optimistic]);

    try {
      const response = await fetch("/api/cos/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversationId: activeId ?? undefined }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body?.error?.message ?? "The Chief of Staff could not answer that.");
        setMessages((current) => current.filter((message) => message.id !== optimistic.id));
        setInput(trimmed);
        return;
      }

      setActiveId(body.conversationId);
      setMessages((current) => [
        ...current,
        { id: `reply-${Date.now()}`, role: "assistant", content: body.reply },
      ]);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setMessages((current) => current.filter((message) => message.id !== optimistic.id));
      setInput(trimmed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card padded={false} className="flex h-[70vh] flex-col">
          <div className="cos-scroll flex-1 space-y-4 overflow-y-auto p-4">
            {!configured ? (
              <div className="rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn">
                The AI layer is not configured. Set <code>ANTHROPIC_API_KEY</code> on the server to enable the
                Chief of Staff. Everything else in M-CoS works without it.
              </div>
            ) : null}

            {messages.length === 0 ? (
              <EmptyState
                title="Ask your Chief of Staff"
                description="It reads your live tasks, projects, pipeline, goals and knowledge base before answering."
              />
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-brand text-brand-ink"
                        : "border border-line bg-surface-2 text-ink"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}

            {pending ? (
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
                Reading your business data…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-line p-3">
            <ErrorBanner message={error} />
            <form
              className="mt-2 flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void send(input);
              }}
            >
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Plan my day. Review my projects. What's blocking revenue?"
                rows={2}
                disabled={!configured || pending}
                aria-label="Message the Chief of Staff"
              />
              <Button type="submit" disabled={!configured || pending || input.trim().length === 0}>
                {pending ? "Thinking…" : "Send"}
              </Button>
            </form>
            <p className="mt-1 text-[11px] text-ink-subtle">⌘/Ctrl + Enter to send.</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card title="Try asking">
          <ul className="space-y-1">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => void send(suggestion)}
                  disabled={!configured || pending}
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs text-ink-muted transition hover:bg-surface-2 hover:text-ink disabled:opacity-50"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Conversations">
          {conversations.length === 0 ? (
            <p className="text-xs text-ink-muted">No conversations yet.</p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <a
                    href={`/cos/chat?c=${conversation.id}`}
                    className={`block truncate rounded-md px-2 py-1.5 text-xs transition hover:bg-surface-2 ${
                      conversation.id === activeId ? "bg-surface-2 text-ink" : "text-ink-muted"
                    }`}
                  >
                    {conversation.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <a href="/cos/chat" className="mt-3 inline-block text-xs text-brand hover:underline">
            + New conversation
          </a>
        </Card>

        <Card title="What it can do">
          <ul className="space-y-1.5 text-xs text-ink-muted">
            <li><Badge tone="good">Reads</Badge> tasks, projects, CRM, goals, finance, content, knowledge</li>
            <li><Badge tone="info">Writes</Badge> tasks, projects, content, products, automations, memory</li>
            <li><Badge tone="bad">Never</Badge> sends messages, publishes, changes pricing or deletes — those need your approval</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
