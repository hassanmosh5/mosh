import { route, readJson } from "@/lib/cos/api";
import { approvalDecisionSchema } from "@/lib/cos/schemas";
import { decideApproval, markExecuted } from "@/lib/cos/services/approvals";

export const PATCH = route<{ id: string }>({ permission: "approval:decide" }, async (ctx, request, { id }) => {
  const input = await readJson(request, approvalDecisionSchema);
  return decideApproval(ctx, id, input);
});

export const POST = route<{ id: string }>({ permission: "approval:decide" }, async (ctx, request, { id }) => {
  const body = await request.json().catch(() => ({}));
  const note = typeof body?.note === "string" ? body.note.slice(0, 1000) : undefined;
  return markExecuted(ctx, id, note);
});
