import { z } from "zod";
import { route, readJson } from "@/lib/cos/api";
import { setIntegrationStatus } from "@/lib/cos/services/integrations";

const schema = z.object({ status: z.enum(["CONNECTED", "DISABLED", "NOT_CONNECTED"]) });

export const PATCH = route<{ provider: string }>(
  { permission: "integration:write" },
  async (ctx, request, { provider }) => {
    const { status } = await readJson(request, schema);
    return setIntegrationStatus(ctx, provider, status);
  }
);
