import { route } from "@/lib/cos/api";
import { listIntegrations } from "@/lib/cos/services/integrations";

export const GET = route({ permission: "integration:read" }, async (ctx) => ({
  items: await listIntegrations(ctx),
}));
