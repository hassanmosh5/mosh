import { requireMoshContext } from "@/lib/mosh/context";
import { getYearPlan } from "@/lib/mosh/services/plan";
import { PageHeader } from "@/components/mosh/ui";
import { PlanBoard } from "./plan-board";

export const dynamic = "force-dynamic";

export const metadata = { title: "365-day master plan" };

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const ctx = await requireMoshContext();
  const params = await searchParams;
  const raw = typeof params.year === "string" ? Number(params.year) : undefined;
  const year = raw && Number.isInteger(raw) && raw >= 2000 && raw <= 2100 ? raw : undefined;

  const plan = await getYearPlan(ctx, year);

  return (
    <>
      <PageHeader
        eyebrow="365-day master plan"
        title={`${plan.year}: four quarters, one direction`}
        description="Root and Routine. Visibility and Credibility. Structure and Scale. Legacy and Leverage. The plan arrives written — rewrite any of it to fit the life you are actually living."
      />
      <PlanBoard plan={plan} />
    </>
  );
}
