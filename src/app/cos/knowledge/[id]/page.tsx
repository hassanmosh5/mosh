import Link from "next/link";
import { notFound as nextNotFound } from "next/navigation";
import Markdown from "react-markdown";
import { requireCosContext, can } from "@/lib/cos/context";
import { getKnowledgeDocument } from "@/lib/cos/services/knowledge";
import { AppError } from "@/lib/cos/errors";
import { formatDate } from "@/lib/cos/format";
import { KNOWLEDGE_CATEGORY, options } from "@/lib/cos/options";
import { Badge, Card, PageHeader } from "@/components/cos/ui";
import { EntityForm } from "@/components/cos/entity-form";
import { DeleteButton } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireCosContext();

  let doc;
  try {
    doc = await getKnowledgeDocument(ctx, id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) nextNotFound();
    throw error;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={doc.title}
        description={doc.summary ?? undefined}
        actions={
          <>
            <Link href="/cos/knowledge" className="text-sm text-ink-muted hover:text-ink">← Knowledge</Link>
            {can(ctx, "knowledge:delete") ? (
              <DeleteButton endpoint={`/api/cos/knowledge/${doc.id}`} redirectTo="/cos/knowledge" />
            ) : null}
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
        <Badge>{doc.category.replace("_", " ")}</Badge>
        {doc.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
        <span>Updated {formatDate(doc.updatedAt)}</span>
        {doc.source ? <span>Source: {doc.source}</span> : null}
        {doc.reviewAt ? <span>Review {formatDate(doc.reviewAt)}</span> : null}
      </div>

      <Card>
        <article className="prose prose-sm max-w-none dark:prose-invert">
          <Markdown>{doc.body}</Markdown>
        </article>
      </Card>

      {can(ctx, "knowledge:write") ? (
        <Card title="Edit document">
          <EntityForm
            endpoint={`/api/cos/knowledge/${doc.id}`}
            method="PATCH"
            submitLabel="Save changes"
            resetOnSuccess={false}
            fields={[
              { name: "title", label: "Title", defaultValue: doc.title, required: true, span: 2 },
              { name: "category", label: "Category", type: "select", options: options(KNOWLEDGE_CATEGORY), defaultValue: doc.category, required: true },
              { name: "source", label: "Source", defaultValue: doc.source ?? "" },
              { name: "summary", label: "Summary", type: "textarea", defaultValue: doc.summary ?? "", span: 2 },
              { name: "body", label: "Body", type: "textarea", defaultValue: doc.body, required: true, span: 2 },
              { name: "tags", label: "Tags", type: "tags", defaultValue: doc.tags.join(", "), span: 2 },
            ]}
          />
        </Card>
      ) : null}
    </div>
  );
}
