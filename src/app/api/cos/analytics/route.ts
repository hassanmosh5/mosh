import { route } from "@/lib/cos/api";
import { getAnalytics } from "@/lib/cos/services/analytics";

export const GET = route({ permission: "analytics:read" }, async (ctx) => getAnalytics(ctx));
