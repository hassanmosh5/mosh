import { route } from "@/lib/mosh/api";
import { getDashboard } from "@/lib/mosh/services/dashboard";

export const GET = route({}, async (ctx) => getDashboard(ctx));
