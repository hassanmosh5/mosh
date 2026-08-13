import { route } from "@/lib/cos/api";
import { listApprovals } from "@/lib/cos/services/approvals";

export const GET = route({ permission: "approval:read" }, async (ctx) => ({
  items: await listApprovals(ctx),
}));
