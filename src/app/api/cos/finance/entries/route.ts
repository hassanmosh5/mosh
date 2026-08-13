import { route, readJson } from "@/lib/cos/api";
import { createFinanceEntry, listFinanceEntries } from "@/lib/cos/services/finance";
import { financeEntrySchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "finance:read" }, async (ctx) => ({
  items: await listFinanceEntries(ctx),
}));

export const POST = route({ permission: "finance:write" }, async (ctx, request) => {
  const input = await readJson(request, financeEntrySchema);
  return createFinanceEntry(ctx, input);
});
