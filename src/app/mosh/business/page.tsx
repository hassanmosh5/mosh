import { requireMoshContext } from "@/lib/mosh/context";
import { getBusiness } from "@/lib/mosh/services/business";
import { formatShortMonth, fromIsoDate } from "@/lib/mosh/dates";
import { labelForScore } from "@/lib/mosh/scoring";
import { WealthFlowChart } from "@/components/mosh/charts";
import {
  Card,
  EmptyState,
  Grid,
  PageHeader,
  ScoreBar,
  Stat,
  TableWrap,
  tableClass,
  tdClass,
  thClass,
} from "@/components/mosh/ui";
import { OfferEcosystem } from "./offer-ecosystem";

export const dynamic = "force-dynamic";

export const metadata = { title: "Offer ecosystem" };

export default async function BusinessPage() {
  const ctx = await requireMoshContext();
  const business = await getBusiness(ctx, 12);

  const money = (value: number) =>
    `${business.currency} ${Math.round(value).toLocaleString()}`;

  const hasData = business.wealthTrend.some((point) => point.index > 0);

  return (
    <>
      <PageHeader
        eyebrow="Business"
        title="The offer ecosystem"
        description="Three tiers, one path. An attraction offer that opens the door, a core program that produces the transformation, and mentorship that goes deep with few."
      />

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ScoreBar
          label="Wealth Flow Index"
          value={business.wealth.progress}
          band={labelForScore(business.wealth.progress)}
          description="(Attraction × 1) + (Core × 2) + (Premium × 3)"
          detail={`${money(business.wealth.index)} of ${money(business.wealth.target)}`}
        />
        <Stat
          label="Revenue this month"
          value={money(business.wealth.totalRevenue)}
          hint="Unweighted, across all three tiers"
          tone="brand"
        />
        <Stat
          label="Index target"
          value={money(business.wealth.target)}
          hint="From this quarter's revenue target in the master plan"
        />
      </div>

      <Card
        className="mb-4"
        title="Wealth Flow, twelve months"
        description="Each segment is the tier's revenue after its multiplier — the shape of the bar is the shape of the ecosystem."
      >
        {hasData ? (
          <WealthFlowChart
            currency={business.currency}
            data={business.wealthTrend.map((point) => ({
              label: formatShortMonth(fromIsoDate(point.month)),
              attraction: point.attraction * 1,
              core: point.core * 2,
              premium: point.premium * 3,
            }))}
          />
        ) : (
          <EmptyState
            title="No revenue reported yet"
            description="Create your offers below and report a month. The index and this chart are computed from those numbers alone."
          />
        )}
      </Card>

      <Grid cols={3}>
        {business.tiers.map((tier) => (
          <Stat
            key={tier.tier}
            label={`${tier.label} × ${tier.weight}`}
            value={money(tier.weightedRevenue)}
            hint={`${money(tier.revenue)} raw · ${tier.headcount.toLocaleString()} people · ${tier.offers} offer${tier.offers === 1 ? "" : "s"}`}
          />
        ))}
      </Grid>

      <div className="mt-4">
        <OfferEcosystem business={business} month={business.currentMonth} />
      </div>

      {business.offers.length > 0 ? (
        <Card
          className="mt-4"
          title="Reported months"
          description="Every figure behind the index, exactly as entered."
        >
          <TableWrap>
            <table className={tableClass}>
              <caption className="sr-only">
                Reported monthly metrics for every offer in the ecosystem
              </caption>
              <thead>
                <tr>
                  <th className={thClass}>Offer</th>
                  <th className={thClass}>Month</th>
                  <th className={thClass}>Revenue</th>
                  <th className={thClass}>Leads</th>
                  <th className={thClass}>Students</th>
                  <th className={thClass}>Clients</th>
                </tr>
              </thead>
              <tbody>
                {business.offers.flatMap((offer) =>
                  offer.metrics.map((metric) => (
                    <tr key={`${offer.id}-${metric.month}`}>
                      <td className={tdClass}>{offer.name}</td>
                      <td className={tdClass}>{metric.month}</td>
                      <td className={`${tdClass} tabular-nums`}>{money(metric.revenue)}</td>
                      <td className={`${tdClass} tabular-nums`}>{metric.leads}</td>
                      <td className={`${tdClass} tabular-nums`}>{metric.students}</td>
                      <td className={`${tdClass} tabular-nums`}>{metric.clients}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TableWrap>
        </Card>
      ) : null}
    </>
  );
}
