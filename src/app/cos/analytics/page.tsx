import { requireCosContext } from "@/lib/cos/context";
import { getAnalytics } from "@/lib/cos/services/analytics";
import { formatMoney, titleCase } from "@/lib/cos/format";
import { Card, DataNotice, EmptyState, Grid, PageHeader, Stat, Table, Td } from "@/components/cos/ui";
import { CategoryBarChart, MoneySeriesChart } from "@/components/cos/charts";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const ctx = await requireCosContext();
  const analytics = await getAnalytics(ctx);
  const money = (value: number) => formatMoney(value, ctx.currency);

  const hasFinance = analytics.finance.series.some(
    (point) => point.revenue !== 0 || point.expenses !== 0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Every figure below is computed from records in the database."
      />

      <Grid cols={4}>
        <Stat label="Revenue (6 months)" value={money(analytics.finance.totals.revenue)} tone="good" />
        <Stat label="Profit (6 months)" value={money(analytics.finance.totals.profit)} tone={analytics.finance.totals.profit >= 0 ? "good" : "bad"} hint={`${analytics.finance.totals.margin}% margin`} />
        <Stat label="Conversion rate" value={`${analytics.acquisition.conversionRate}%`} hint={`${analytics.acquisition.leadsLast90Days} leads in 90 days`} />
        <Stat label="Automation saving" value={`${analytics.automation.savedHoursPerMonth}h/mo`} tone="brand" hint={`${analytics.automation.potentialHoursPerMonth}h/mo more available`} />
      </Grid>

      <Card
        title="Revenue, expenses and profit"
        description="Monthly, from recorded finance entries."
      >
        {hasFinance ? (
          <>
            <MoneySeriesChart data={analytics.finance.series} currency={ctx.currency} />
            <div className="mt-4">
              <Table head={["Month", "Revenue", "Expenses", "Profit"]}>
                {analytics.finance.series.map((point) => (
                  <tr key={point.month}>
                    <Td className="text-xs">{point.month}</Td>
                    <Td className="text-xs tabular-nums">{money(point.revenue)}</Td>
                    <Td className="text-xs tabular-nums">{money(point.expenses)}</Td>
                    <Td className={`text-xs tabular-nums ${point.profit < 0 ? "text-bad" : ""}`}>
                      {money(point.profit)}
                    </Td>
                  </tr>
                ))}
              </Table>
            </div>
          </>
        ) : (
          <EmptyState
            title="No finance entries recorded"
            description="Record revenue and expenses to see the monthly picture."
          />
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Pipeline value by stage">
          {analytics.pipeline.stages.every((stage) => stage.value === 0) ? (
            <EmptyState title="Pipeline is empty" description="Add leads or opportunities with values." />
          ) : (
            <CategoryBarChart
              data={analytics.pipeline.stages.map((stage) => ({
                label: titleCase(stage.stage),
                value: Math.round(stage.value),
              }))}
              valueFormatter={money}
              height={260}
            />
          )}
        </Card>

        <Card title="Top products by revenue">
          {analytics.products.length === 0 ? (
            <EmptyState title="No products" description="Register digital products to track their revenue." />
          ) : (
            <CategoryBarChart
              data={analytics.products.slice(0, 8).map((product) => ({
                label: product.name.slice(0, 22),
                value: Math.round(product.revenue),
              }))}
              valueFormatter={money}
              height={260}
            />
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Delivery" description="Task and project throughput.">
          <Grid cols={2}>
            <Stat label="Task completion" value={`${analytics.delivery.taskCompletionRate}%`} />
            <Stat label="Project completion" value={`${analytics.delivery.projectCompletionRate}%`} />
          </Grid>
          <div className="mt-4">
            <Table head={["Task status", "Count"]}>
              {analytics.delivery.tasksByStatus.map((row) => (
                <tr key={row.status}>
                  <Td className="text-xs">{titleCase(row.status)}</Td>
                  <Td className="text-xs tabular-nums">{row.count}</Td>
                </tr>
              ))}
            </Table>
          </div>
        </Card>

        <Card title="AI usage & cost" description="Last 30 days, estimated at published list prices.">
          <Grid cols={2}>
            <Stat label="Requests" value={analytics.ai.requestsLast30Days} />
            <Stat label="Estimated cost" value={`$${analytics.ai.estimatedCostUsd.toFixed(2)}`} tone="brand" />
          </Grid>
          {analytics.ai.byAgent.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="No AI usage yet" description="Usage is recorded every time an agent runs." />
            </div>
          ) : (
            <>
              <div className="mt-4">
                <CategoryBarChart
                  data={analytics.ai.byAgent.slice(0, 8).map((row) => ({
                    label: row.agentKey,
                    value: Number(row.estimatedCostUsd.toFixed(4)),
                  }))}
                  valueFormatter={(value) => `$${value.toFixed(4)}`}
                  height={220}
                />
              </div>
              <div className="mt-4">
                <Table head={["Agent", "Requests", "Input tokens", "Output tokens", "Est. cost"]}>
                  {analytics.ai.byAgent.map((row) => (
                    <tr key={row.agentKey}>
                      <Td className="text-xs">{row.agentKey}</Td>
                      <Td className="text-xs tabular-nums">{row.requests}</Td>
                      <Td className="text-xs tabular-nums">{row.inputTokens.toLocaleString()}</Td>
                      <Td className="text-xs tabular-nums">{row.outputTokens.toLocaleString()}</Td>
                      <Td className="text-xs tabular-nums">${row.estimatedCostUsd.toFixed(4)}</Td>
                    </tr>
                  ))}
                </Table>
              </div>
            </>
          )}
        </Card>
      </div>

      <Card title="Content performance">
        {analytics.content.topPerforming.length === 0 ? (
          <EmptyState title="No published content" description="Performance figures appear once content is marked published." />
        ) : (
          <Table head={["Title", "Platform", "Views", "Engagements", "Conversions"]}>
            {analytics.content.topPerforming.map((item) => (
              <tr key={item.id}>
                <Td className="text-xs">{item.title}</Td>
                <Td className="text-xs">{item.platform}</Td>
                <Td className="text-xs tabular-nums">{item.views.toLocaleString()}</Td>
                <Td className="text-xs tabular-nums">{item.engagements.toLocaleString()}</Td>
                <Td className="text-xs tabular-nums">{item.conversions.toLocaleString()}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <DataNotice>
        REPORTED data is what you or an integration entered. CALCULATED figures (profit, margin, weighted
        pipeline, completion rates) are derived from it. AI cost is an ESTIMATE at published list prices, not a
        billing record. None of this is accounting or tax advice.
      </DataNotice>
    </div>
  );
}
