"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Markdown from "react-markdown";
import { Button, ErrorBanner, Field, Select, Textarea } from "@/components/cos/controls";
import { Card } from "@/components/cos/ui";

type AgentOption = { key: string; name: string; role: string };

type RunResult = {
  agents: { agentKey: string; agentName: string; output: string }[];
  synthesis: string;
};

/**
 * Delegation console.
 *
 * Leaving the agent on "Route automatically" runs the orchestrator: it selects
 * the specialists, runs them, and the Chief of Staff combines their output into
 * one recommendation.
 */
export function AgentRunner({ configured, agents }: { configured: boolean; agents: AgentOption[] }) {
  const router = useRouter();
  const [objective, setObjective] = useState("");
  const [agentKey, setAgentKey] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);

  async function run(event: React.FormEvent) {
    event.preventDefault();
    if (!objective.trim() || pending) return;

    setPending(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/cos/agents/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          objective: objective.trim(),
          agentKey: agentKey || undefined,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body?.error?.message ?? "The agent run failed.");
        return;
      }
      setResult(body as RunResult);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card title="Delegate an objective" description="Route work to the right specialist agents.">
      {!configured ? (
        <div className="mb-3 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn">
          The AI layer is not configured. Set <code>ANTHROPIC_API_KEY</code> on the server to run agents.
        </div>
      ) : null}

      <form onSubmit={run} className="space-y-3">
        <ErrorBanner message={error} />
        <Field label="Objective" htmlFor="objective">
          <Textarea
            id="objective"
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
            rows={3}
            disabled={!configured || pending}
            placeholder="Create a launch strategy for my new AI prompt pack."
          />
        </Field>
        <div className="flex flex-wrap items-end gap-2">
          <Field label="Agent" htmlFor="agent" className="min-w-56">
            <Select
              id="agent"
              value={agentKey}
              onChange={(event) => setAgentKey(event.target.value)}
              disabled={!configured || pending}
            >
              <option value="">Route automatically</option>
              {agents.map((agent) => (
                <option key={agent.key} value={agent.key}>
                  {agent.name} — {agent.role}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit" disabled={!configured || pending || objective.trim().length === 0}>
            {pending ? "Running agents…" : "Run"}
          </Button>
        </div>
      </form>

      {result ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-brand/40 bg-brand-soft/40 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand">
              Chief of Staff recommendation
            </p>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <Markdown>{result.synthesis}</Markdown>
            </div>
          </div>
          {result.agents.length > 1
            ? result.agents.map((entry) => (
                <details key={entry.agentKey} className="rounded-lg border border-line p-3">
                  <summary className="cursor-pointer text-sm font-medium text-ink">{entry.agentName}</summary>
                  <div className="prose prose-sm mt-2 max-w-none dark:prose-invert">
                    <Markdown>{entry.output}</Markdown>
                  </div>
                </details>
              ))
            : null}
        </div>
      ) : null}
    </Card>
  );
}
