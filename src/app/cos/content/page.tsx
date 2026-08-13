import { requireCosContext, can } from "@/lib/cos/context";
import { listCampaigns, listContent, listProducts } from "@/lib/cos/services/content";
import { formatDate, relativeDays } from "@/lib/cos/format";
import { CONTENT_PLATFORM, CONTENT_STATUS, options, statusTone } from "@/lib/cos/options";
import { Badge, Card, EmptyState, Grid, PageHeader, Stat, Table, Td } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";
import { StatusSelect } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();
  const status = typeof params.status === "string" ? params.status : undefined;

  const [items, products, campaigns] = await Promise.all([
    listContent(ctx, { status }),
    listProducts(ctx),
    listCampaigns(ctx),
  ]);

  const writable = can(ctx, "content:write");
  const today = new Date();
  const published = items.filter((item) => item.status === "PUBLISHED");
  const overdue = items.filter(
    (item) => item.status !== "PUBLISHED" && item.status !== "REPURPOSE" && item.publishAt && item.publishAt < today
  );
  const totalViews = published.reduce((total, item) => total + item.views, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content"
        description="The calendar across every channel, from idea to repurpose."
        actions={
          writable ? (
            <CreatePanel label="Add content" title="New content item" defaultOpen={params.new === "1"}>
              <EntityForm
                endpoint="/api/cos/content"
                submitLabel="Add to calendar"
                fields={[
                  { name: "title", label: "Title", required: true, span: 2 },
                  { name: "platform", label: "Platform", type: "select", options: options(CONTENT_PLATFORM), defaultValue: "YOUTUBE", required: true },
                  { name: "format", label: "Format", placeholder: "Short-form video, carousel, long-form post…" },
                  { name: "topic", label: "Topic / angle", span: 2 },
                  { name: "status", label: "Status", type: "select", options: options(CONTENT_STATUS), defaultValue: "IDEA", required: true },
                  { name: "publishAt", label: "Publish date", type: "date" },
                  { name: "productId", label: "Promotes product", type: "select", options: products.map((p) => ({ value: p.id, label: p.name })) },
                  { name: "campaignId", label: "Campaign", type: "select", options: campaigns.map((c) => ({ value: c.id, label: c.name })) },
                  { name: "callToAction", label: "Call to action", span: 2 },
                  { name: "script", label: "Script / outline", type: "textarea", span: 2 },
                  { name: "caption", label: "Caption", type: "textarea", span: 2 },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      />

      <Grid cols={4}>
        <Stat label="In the calendar" value={items.length} />
        <Stat label="Published" value={published.length} tone="good" />
        <Stat label="Past publish date" value={overdue.length} tone={overdue.length > 0 ? "warn" : "good"} />
        <Stat label="Total views" value={totalViews.toLocaleString()} />
      </Grid>

      <Card padded={false}>
        <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3 text-xs">
          <FilterChip href="/cos/content" label="All" active={!status} />
          {CONTENT_STATUS.map((value) => (
            <FilterChip
              key={value}
              href={`/cos/content?status=${value}`}
              label={value.toLowerCase()}
              active={status === value}
            />
          ))}
        </div>

        {items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Nothing in the calendar"
              description="Add an idea, or ask the Content Agent to plan a month of content."
            />
          </div>
        ) : (
          <Table head={["Title", "Platform", "Status", "Publish", "Product", "Performance"]}>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-2">
                <Td>
                  <p className="font-medium">{item.title}</p>
                  {item.topic ? <p className="text-xs text-ink-subtle">{item.topic}</p> : null}
                </Td>
                <Td className="text-xs">{item.platform}</Td>
                <Td>
                  {writable ? (
                    <StatusSelect
                      endpoint={`/api/cos/content/${item.id}`}
                      value={item.status}
                      options={options(CONTENT_STATUS)}
                    />
                  ) : (
                    <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                  )}
                </Td>
                <Td className="whitespace-nowrap text-xs text-ink-muted">
                  <span title={formatDate(item.publishAt)}>{item.publishAt ? relativeDays(item.publishAt) : "—"}</span>
                </Td>
                <Td className="text-xs text-ink-muted">{item.product?.name ?? "—"}</Td>
                <Td className="text-xs tabular-nums text-ink-muted">
                  {item.status === "PUBLISHED"
                    ? `${item.views.toLocaleString()} views · ${item.engagements} eng · ${item.conversions} conv`
                    : "—"}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {campaigns.length > 0 ? (
        <Card title="Campaigns">
          <ul className="space-y-2 text-sm">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="flex items-center justify-between gap-2">
                <span>
                  {campaign.name}
                  {campaign.product?.name ? (
                    <span className="text-ink-muted"> · {campaign.product.name}</span>
                  ) : null}
                </span>
                <span className="text-xs text-ink-subtle">
                  {campaign._count.contentItems} items · {campaign.active ? "active" : "closed"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`rounded-full border px-2.5 py-1 capitalize transition ${
        active ? "border-brand bg-brand-soft text-brand" : "border-line text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
}
