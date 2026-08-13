import { route } from "@/lib/cos/api";
import { refreshNotifications } from "@/lib/cos/notifications";
import { recordAudit } from "@/lib/cos/audit";

export const POST = route({ permission: "notification:write" }, async (ctx) => {
  const created = await refreshNotifications(ctx);
  await recordAudit(ctx, { action: "notification.refresh", detail: { created } });
  return { created };
});
