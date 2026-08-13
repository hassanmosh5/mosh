import { prisma } from "@/lib/prisma";
import { requireCosContext, can } from "@/lib/cos/context";
import { listProducts } from "@/lib/cos/services/content";
import { formatMoney } from "@/lib/cos/format";
import { options, PRODUCT_STAGE, statusTone } from "@/lib/cos/options";
import { Badge, Card, EmptyState, Grid, PageHeader, Stat, Table, Td } from "@/components/cos/ui";
import { CreatePanel } from "@/components/cos/disclosure";
import { EntityForm } from "@/components/cos/entity-form";
import { StatusSelect } from "@/components/cos/row-actions";

export const dynamic = "force-dynamic";

const PIPELINE = ["IDEA", "RESEARCH", "VALIDATION", "PRODUCTION", "LAUNCH", "OPTIMIZATION", "SCALE"] as const;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();

  const [products, areas] = await Promise.all([
    listProducts(ctx),
    prisma.businessArea.findMany({
      where: { businessId: ctx.businessId, active: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const writable = can(ctx, "product:write");
  const totalRevenue = products.reduce((total, product) => total + product.revenueValue, 0);
  const totalUnits = products.reduce((total, product) => total + product.unitsSold, 0);
  const live = products.filter((product) => ["LAUNCH", "OPTIMIZATION", "SCALE"].includes(product.stage));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital products"
        description="Idea → Research → Validation → Production → Launch → Optimisation → Scale."
        actions={
          writable ? (
            <CreatePanel label="Add product" title="New digital product" defaultOpen={params.new === "1"}>
              <EntityForm
                endpoint="/api/cos/products"
                submitLabel="Add product"
                fields={[
                  { name: "name", label: "Product name", required: true, span: 2 },
                  { name: "category", label: "Category", placeholder: "Prompt pack, course, template kit…" },
                  { name: "areaId", label: "Business area", type: "select", options: areas.map((a) => ({ value: a.id, label: a.name })) },
                  { name: "description", label: "Description", type: "textarea", span: 2 },
                  { name: "price", label: "Price", type: "number", min: 0 },
                  { name: "platform", label: "Platform", placeholder: "Selar, Gumroad, own site…" },
                  { name: "stage", label: "Stage", type: "select", options: options(PRODUCT_STAGE), defaultValue: "IDEA", required: true },
                  { name: "landingPage", label: "Landing page", type: "url" },
                ]}
              />
            </CreatePanel>
          ) : null
        }
      />

      <Grid cols={4}>
        <Stat label="Products" value={products.length} hint={`${live.length} live`} />
        <Stat label="Units sold" value={totalUnits.toLocaleString()} />
        <Stat label="Product revenue" value={formatMoney(totalRevenue, ctx.currency)} tone="good" />
        <Stat
          label="Average price"
          value={
            products.length === 0
              ? "—"
              : formatMoney(
                  products.reduce((total, product) => total + product.priceValue, 0) / products.length,
                  ctx.currency
                )
          }
        />
      </Grid>

      <Card title="Pipeline" description="How many products sit at each stage.">
        <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {PIPELINE.map((stage) => {
            const bucket = products.filter((product) => product.stage === stage);
            return (
              <div key={stage} className="rounded-lg border border-line p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
                  {stage.toLowerCase()}
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-ink">{bucket.length}</p>
                <p className="text-xs text-ink-muted">
                  {formatMoney(bucket.reduce((total, product) => total + product.revenueValue, 0), ctx.currency)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card padded={products.length === 0}>
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Register a product to track it from idea through to scale."
          />
        ) : (
          <Table head={["Product", "Stage", "Price", "Units", "Revenue", "Platform"]}>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-surface-2">
                <Td>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-ink-subtle">
                    {product.category ?? "Uncategorised"}
                    {product.area?.name ? ` · ${product.area.name}` : ""}
                  </p>
                </Td>
                <Td>
                  {writable ? (
                    <StatusSelect
                      endpoint={`/api/cos/products/${product.id}`}
                      field="stage"
                      value={product.stage}
                      options={options(PRODUCT_STAGE)}
                    />
                  ) : (
                    <Badge tone={statusTone(product.stage)}>{product.stage}</Badge>
                  )}
                </Td>
                <Td className="whitespace-nowrap text-xs tabular-nums">
                  {product.priceValue ? formatMoney(product.priceValue, ctx.currency) : "—"}
                </Td>
                <Td className="text-xs tabular-nums">{product.unitsSold}</Td>
                <Td className="whitespace-nowrap text-xs tabular-nums">
                  {formatMoney(product.revenueValue, ctx.currency)}
                </Td>
                <Td className="text-xs text-ink-muted">{product.platform ?? "—"}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
