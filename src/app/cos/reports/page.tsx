import Markdown from "react-markdown";
import { requireCosContext, can } from "@/lib/cos/context";
import { getReport, listReports } from "@/lib/cos/services/reports";
import { isAiConfigured } from "@/lib/cos/ai/client";
import { formatDate, formatDateTime } from "@/lib/cos/format";
import { Badge, Card, EmptyState, PageHeader } from "@/components/cos/ui";
import { ReportGenerator } from "./report-generator";

export const dynamic = "force-dynamic";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();
  const reports = await listReports(ctx);

  const selectedId = typeof params.id === "string" ? params.id : reports[0]?.id;
  const selected = selectedId ? await getReport(ctx, selectedId) : null;
  const preselect = typeof params.generate === "string" ? params.generate : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Briefings and executive reports assembled from your records. The AI interprets the figures; it never supplies them."
        actions={
          can(ctx, "report:write") ? (
            <ReportGenerator configured={isAiConfigured()} preselect={preselect} />
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Card title="History" className="lg:col-span-1">
          {reports.length === 0 ? (
            <p className="text-xs text-ink-muted">No reports generated yet.</p>
          ) : (
            <ul className="space-y-1">
              {reports.map((report) => (
                <li key={report.id}>
                  <a
                    href={`/cos/reports?id=${report.id}`}
                    className={`block rounded-md px-2 py-1.5 text-xs transition hover:bg-surface-2 ${
                      report.id === selectedId ? "bg-surface-2 text-ink" : "text-ink-muted"
                    }`}
                  >
                    <span className="block truncate font-medium">{report.title}</span>
                    <span className="block text-[11px] text-ink-subtle">
                      {formatDateTime(report.createdAt)}
                      {report.aiGenerated ? " · AI narrative" : " · data only"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="lg:col-span-3">
          {selected ? (
            <Card
              title={selected.title}
              description={`${formatDate(selected.periodStart)} → ${formatDate(selected.periodEnd)}`}
              actions={
                <Badge tone={selected.aiGenerated ? "brand" : "neutral"}>
                  {selected.aiGenerated ? "AI narrative" : "Data only"}
                </Badge>
              }
            >
              <article className="prose prose-sm max-w-none dark:prose-invert">
                <Markdown>{selected.body}</Markdown>
              </article>
            </Card>
          ) : (
            <EmptyState
              title="No report selected"
              description="Generate a daily briefing, weekly executive report, monthly business report or quarterly strategy review."
            />
          )}
        </div>
      </div>
    </div>
  );
}
