import { route, readJson } from "@/lib/cos/api";
import { createInvoice, listInvoices } from "@/lib/cos/services/finance";
import { invoiceSchema } from "@/lib/cos/schemas";

export const GET = route({ permission: "finance:read" }, async (ctx) => ({
  items: await listInvoices(ctx),
}));

export const POST = route({ permission: "finance:write" }, async (ctx, request) => {
  const input = await readJson(request, invoiceSchema);
  return createInvoice(ctx, input);
});
