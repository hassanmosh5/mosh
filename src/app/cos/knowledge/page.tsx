import Link from "next/link";
import { requireCosContext, can } from "@/lib/cos/context";
import { listKnowledge, listMemories } from "@/lib/cos/services/knowledge";
import { formatDate } from "@/lib/cos/format";
import { KNOWLEDGE_CATEGORY, MEMORY_SCOPE, options } from "@/lib/cos/options";
import { Badge, Card, EmptyState, Grid, PageHeader, Stat } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";
import { DeleteButton } from "@/components/cos/row-actions";
import { Input } from "@/components/cos/controls";

export const dynamic = "force-dynamic";

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();
  const search = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;

  const [documents, memories] = await Promise.all([
    listKnowledge(ctx, { search, category }),
    listMemories(ctx),
  ]);

  const canWriteKnowledge = can(ctx, "knowledge:write");
  const canWriteMemory = can(ctx, "memory:write");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge & memory"
        description="What the Chief of Staff knows about MOSH. Documents are reference material; memory is structured facts with confidence and review dates."
        actions={
          canWriteKnowledge ? (
            <CreatePanel label="Add document" title="New knowledge document">
              <EntityForm
                endpoint="/api/cos/knowledge"
                submitLabel="Save document"
                fields={[
                  { name: "title", label: "Title", required: true, span: 2 },
                  { name: "category", label: "Category", type: "select", options: options(KNOWLEDGE_CATEGORY), defaultValue: "COMPANY", required: true },
                  { name: "source", label: "Source", placeholder: "Where this came from" },
                  { name: "summary", label: "Summary", type: "textarea", span: 2 },
                  { name: "body", label: "Body", type: "textarea", required: true, span: 2, hint: "Markdown is fine." },
                  { name: "tags", label: "Tags", type: "tags", hint: "Comma separated", span: 2 },
                  { name: "reviewAt", label: "Review on", type: "date" },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      />

      <Grid cols={4}>
        <Stat label="Documents" value={documents.length} />
        <Stat label="Memories" value={memories.length} />
        <Stat label="Pinned memories" value={memories.filter((memory) => memory.pinned).length} />
        <Stat
          label="Due for review"
          value={documents.filter((doc) => doc.reviewAt && doc.reviewAt < new Date()).length}
          tone="warn"
        />
      </Grid>

      <Card title="Knowledge base" description="Searched by the AI before it answers questions about how MOSH works.">
        <form method="GET" className="mb-4 flex flex-wrap gap-2">
          <Input name="q" defaultValue={search ?? ""} placeholder="Search titles, summaries and bodies" className="max-w-sm" />
          <select
            name="category"
            defaultValue={category ?? ""}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value="">All categories</option>
            {KNOWLEDGE_CATEGORY.map((value) => (
              <option key={value} value={value}>
                {value.replace("_", " ")}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink hover:bg-surface-2">
            Search
          </button>
        </form>

        {documents.length === 0 ? (
          <EmptyState
            title="No documents match"
            description="Add your services, pricing, SOPs and brand guidelines so the AI stops guessing."
          />
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-line px-3 py-2">
                <div className="min-w-0">
                  <Link href={`/cos/knowledge/${doc.id}`} className="text-sm font-medium text-ink hover:underline">
                    {doc.title}
                  </Link>
                  {doc.summary ? <p className="mt-0.5 text-xs text-ink-muted">{doc.summary}</p> : null}
                  {doc.tags.length > 0 ? (
                    <p className="mt-1 text-[11px] text-ink-subtle">{doc.tags.join(" · ")}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {doc.isDemo ? <Badge tone="warn">Demo</Badge> : null}
                  <Badge>{doc.category.replace("_", " ")}</Badge>
                  <span className="text-[11px] text-ink-subtle">{formatDate(doc.updatedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card
        title="Structured memory"
        description="Scoped facts with a source and a confidence score. Re-recording a key updates it rather than duplicating it."
        actions={
          canWriteMemory ? (
            <CreatePanel label="Add memory" title="New memory">
              <EntityForm
                endpoint="/api/cos/memory"
                submitLabel="Save memory"
                compact
                fields={[
                  { name: "scope", label: "Scope", type: "select", options: options(MEMORY_SCOPE), defaultValue: "COMPANY", required: true },
                  { name: "key", label: "Key", required: true, placeholder: "preferred_project_kickoff_process" },
                  { name: "value", label: "Fact", type: "textarea", required: true, span: 2 },
                  { name: "confidence", label: "Confidence %", type: "number", min: 0, max: 100, defaultValue: 80 },
                  { name: "reviewAt", label: "Review on", type: "date" },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      >
        {memories.length === 0 ? (
          <EmptyState
            title="No memories recorded"
            description="Memory is deliberately narrow — record facts that will still matter next month."
          />
        ) : (
          <ul className="space-y-2">
            {memories.map((memory) => (
              <li key={memory.id} className="rounded-lg border border-line px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge tone="brand">{memory.scope}</Badge>
                    <span className="font-mono text-xs text-ink-muted">{memory.key}</span>
                    {memory.pinned ? <Badge tone="info">Pinned</Badge> : null}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-ink-subtle">
                    <span>{memory.source}</span>
                    <span>confidence {memory.confidence}%</span>
                    {memory.expiresAt ? <span>expires {formatDate(memory.expiresAt)}</span> : null}
                    {can(ctx, "memory:delete") ? (
                      <DeleteButton endpoint={`/api/cos/memory/${memory.id}`} label="Forget" confirmLabel="Confirm" />
                    ) : null}
                  </div>
                </div>
                <p className="mt-1 text-sm text-ink">{memory.value}</p>
                {memory.client?.name || memory.project?.name ? (
                  <p className="mt-1 text-[11px] text-ink-subtle">
                    {memory.client?.name ? `Client: ${memory.client.name}` : ""}
                    {memory.project?.name ? ` Project: ${memory.project.name}` : ""}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
