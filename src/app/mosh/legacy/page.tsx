import { requireMoshContext } from "@/lib/mosh/context";
import { listLetters } from "@/lib/mosh/services/legacy";
import { PageHeader } from "@/components/mosh/ui";
import { LegacyDesk } from "./legacy-desk";

export const dynamic = "force-dynamic";

export const metadata = { title: "A message from my 77-year-old self" };

export default async function LegacyPage() {
  const ctx = await requireMoshContext();
  const letters = await listLetters(ctx);

  return (
    <>
      <PageHeader
        eyebrow="Legacy"
        title="A Message From My 77-Year-Old Self"
        description="The version of you who has already lived it is the only advisor with nothing to sell. Write in their voice, and read it on the mornings when the work feels heavy."
      />
      <LegacyDesk letters={letters} />
    </>
  );
}
