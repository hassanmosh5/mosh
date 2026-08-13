import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { AppError } from "../errors";

/**
 * Integration registry.
 *
 * Each entry declares the interface an integration needs and which environment
 * variables must be present for it to work. Nothing here fakes a connection:
 * an integration is CONNECTED only when its required credentials are actually
 * configured on the server, and its status is computed, never asserted.
 */
export type IntegrationSpec = {
  provider: string;
  displayName: string;
  category: string;
  description: string;
  /** Environment variables required for a real connection. */
  requiredEnv: string[];
  capabilities: string[];
  docsUrl?: string;
};

export const INTEGRATION_REGISTRY: IntegrationSpec[] = [
  {
    provider: "google_calendar",
    displayName: "Google Calendar",
    category: "Productivity",
    description: "Pull meetings into the morning briefing and push deadlines out as events.",
    requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALENDAR_REFRESH_TOKEN"],
    capabilities: ["read:events", "write:events"],
  },
  {
    provider: "gmail",
    displayName: "Gmail",
    category: "Communication",
    description: "Draft client follow-ups for approval and log sent threads against leads.",
    requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"],
    capabilities: ["read:threads", "draft:messages"],
  },
  {
    provider: "google_drive",
    displayName: "Google Drive",
    category: "Storage",
    description: "Create client folders on onboarding and attach deliverables to projects.",
    requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_DRIVE_REFRESH_TOKEN"],
    capabilities: ["read:files", "write:files"],
  },
  {
    provider: "google_sheets",
    displayName: "Google Sheets",
    category: "Data",
    description: "Import finance or lead data from existing spreadsheets.",
    requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_SHEETS_REFRESH_TOKEN"],
    capabilities: ["read:sheets", "write:sheets"],
  },
  {
    provider: "whatsapp",
    displayName: "WhatsApp Business",
    category: "Communication",
    description: "Receive lead enquiries and send approved follow-up messages.",
    requiredEnv: ["WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_ACCESS_TOKEN"],
    capabilities: ["read:messages", "send:messages"],
  },
  {
    provider: "facebook",
    displayName: "Facebook Pages",
    category: "Marketing",
    description: "Publish approved content and read page performance.",
    requiredEnv: ["FACEBOOK_PAGE_ID", "FACEBOOK_ACCESS_TOKEN"],
    capabilities: ["publish:posts", "read:insights"],
  },
  {
    provider: "instagram",
    displayName: "Instagram",
    category: "Marketing",
    description: "Schedule approved posts and pull engagement figures into analytics.",
    requiredEnv: ["INSTAGRAM_ACCOUNT_ID", "FACEBOOK_ACCESS_TOKEN"],
    capabilities: ["publish:posts", "read:insights"],
  },
  {
    provider: "linkedin",
    displayName: "LinkedIn",
    category: "Marketing",
    description: "Publish approved company updates and track reach.",
    requiredEnv: ["LINKEDIN_ORGANIZATION_ID", "LINKEDIN_ACCESS_TOKEN"],
    capabilities: ["publish:posts", "read:insights"],
  },
  {
    provider: "youtube",
    displayName: "YouTube",
    category: "Marketing",
    description: "Sync video performance into the content calendar.",
    requiredEnv: ["YOUTUBE_CHANNEL_ID", "YOUTUBE_API_KEY"],
    capabilities: ["read:analytics"],
  },
  {
    provider: "shopify",
    displayName: "Shopify",
    category: "Commerce",
    description: "Import product sales and revenue for e-commerce clients.",
    requiredEnv: ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_ADMIN_TOKEN"],
    capabilities: ["read:orders", "read:products"],
  },
  {
    provider: "paystack",
    displayName: "Paystack",
    category: "Payments",
    description: "Record payments against invoices automatically.",
    requiredEnv: ["PAYSTACK_SECRET_KEY"],
    capabilities: ["read:transactions", "webhook:payments"],
  },
  {
    provider: "selar",
    displayName: "Selar",
    category: "Commerce",
    description: "Sync digital product sales figures.",
    requiredEnv: ["SELAR_API_KEY"],
    capabilities: ["read:sales"],
  },
  {
    provider: "gumroad",
    displayName: "Gumroad",
    category: "Commerce",
    description: "Sync digital product sales and customer feedback.",
    requiredEnv: ["GUMROAD_ACCESS_TOKEN"],
    capabilities: ["read:sales"],
  },
  {
    provider: "zapier",
    displayName: "Zapier",
    category: "Automation",
    description: "Trigger M-CoS actions from thousands of external apps via webhook.",
    requiredEnv: ["MCOS_WEBHOOK_SECRET"],
    capabilities: ["inbound:webhook"],
  },
  {
    provider: "make",
    displayName: "Make",
    category: "Automation",
    description: "Run multi-step scenarios that read from and write to M-CoS.",
    requiredEnv: ["MCOS_WEBHOOK_SECRET"],
    capabilities: ["inbound:webhook"],
  },
  {
    provider: "n8n",
    displayName: "n8n",
    category: "Automation",
    description: "Self-hosted workflow automation against the M-CoS API.",
    requiredEnv: ["MCOS_WEBHOOK_SECRET"],
    capabilities: ["inbound:webhook"],
  },
];

export type IntegrationView = IntegrationSpec & {
  id: string | null;
  status: "NOT_CONNECTED" | "CONNECTED" | "ERROR" | "DISABLED";
  missingEnv: string[];
  lastCheckedAt: Date | null;
  lastError: string | null;
};

/**
 * List every integration with its *real* status.
 *
 * Status is derived from whether the required environment variables are set on
 * the server. A stored status of CONNECTED is downgraded to NOT_CONNECTED when
 * the credentials are missing, so the UI can never claim a connection that does
 * not exist.
 */
export async function listIntegrations(ctx: CosContext): Promise<IntegrationView[]> {
  const stored = await prisma.integration.findMany({ where: { businessId: ctx.businessId } });
  const byProvider = new Map(stored.map((row) => [row.provider, row]));

  return INTEGRATION_REGISTRY.map((spec) => {
    const row = byProvider.get(spec.provider);
    const missingEnv = spec.requiredEnv.filter((key) => !process.env[key]);
    const configured = missingEnv.length === 0;

    let status: IntegrationView["status"];
    if (row?.status === "DISABLED") status = "DISABLED";
    else if (!configured) status = "NOT_CONNECTED";
    else if (row?.status === "ERROR") status = "ERROR";
    else status = row?.status === "CONNECTED" ? "CONNECTED" : "NOT_CONNECTED";

    return {
      ...spec,
      id: row?.id ?? null,
      status,
      missingEnv,
      lastCheckedAt: row?.lastCheckedAt ?? null,
      lastError: row?.lastError ?? null,
    };
  });
}

/**
 * Attempt to mark an integration connected.
 *
 * Refuses when the credentials are not present, which is what keeps the
 * registry honest — you cannot flip a switch to pretend an integration works.
 */
export async function setIntegrationStatus(
  ctx: CosContext,
  provider: string,
  status: "CONNECTED" | "DISABLED" | "NOT_CONNECTED"
) {
  const spec = INTEGRATION_REGISTRY.find((entry) => entry.provider === provider);
  if (!spec) throw new AppError("Unknown integration.", { status: 404, code: "not_found" });

  const missingEnv = spec.requiredEnv.filter((key) => !process.env[key]);
  if (status === "CONNECTED" && missingEnv.length > 0) {
    throw new AppError(
      `${spec.displayName} cannot be connected: ${missingEnv.join(", ")} ${missingEnv.length === 1 ? "is" : "are"} not set on the server.`,
      { status: 409, code: "missing_credentials", details: { missingEnv } }
    );
  }

  const integration = await prisma.integration.upsert({
    where: { businessId_provider: { businessId: ctx.businessId, provider } },
    create: {
      businessId: ctx.businessId,
      provider,
      displayName: spec.displayName,
      category: spec.category,
      status,
      lastCheckedAt: new Date(),
    },
    update: { status, lastCheckedAt: new Date(), lastError: null },
  });

  await recordAudit(ctx, {
    action: "integration.status",
    entityType: "integration",
    entityId: integration.id,
    detail: { provider, status },
  });
  return integration;
}

export async function deleteIntegration(ctx: CosContext, id: string) {
  const existing = await prisma.integration.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "integration");
  await prisma.integration.delete({ where: { id } });
  await recordAudit(ctx, { action: "integration.delete", entityType: "integration", entityId: id });
  return { ok: true };
}
