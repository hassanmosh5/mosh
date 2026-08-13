import { route } from "@/lib/cos/api";
import { deleteFinanceEntry } from "@/lib/cos/services/finance";

export const DELETE = route<{ id: string }>({ permission: "finance:write" }, async (ctx, _request, { id }) =>
  deleteFinanceEntry(ctx, id)
);
