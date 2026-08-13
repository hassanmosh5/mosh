import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CosRole } from "@/generated/prisma/enums";
import { DEFAULT_BUSINESS_AREAS, DEFAULT_BUSINESS_SLUG } from "./constants";
import { forbidden, unauthorized } from "./errors";
import type { Permission } from "./access";
import { assertPermission, type CosContext } from "./tenancy";

export { assertOwned, assertPermission, can } from "./tenancy";
export type { CosContext } from "./tenancy";

/**
 * The active business. M-CoS ships as a single-business executive OS, but every
 * record is already scoped by `businessId`, so turning this into a real
 * multi-tenant resolver later is a change to this one function.
 */
export const getActiveBusiness = cache(async () => {
  const slug = process.env.MCOS_BUSINESS_SLUG || DEFAULT_BUSINESS_SLUG;
  const business =
    (await prisma.business.findUnique({ where: { slug } })) ??
    (await prisma.business.findFirst({ orderBy: { createdAt: "asc" } }));
  return business;
});

/**
 * Ensure a business exists and the given user is a member of it.
 *
 * The first user to reach M-CoS bootstraps the workspace and becomes its OWNER.
 * Subsequent users join as VIEWER and must be promoted by the owner — new
 * accounts never silently gain write access.
 */
async function ensureMembership(userId: string) {
  let business = await getActiveBusiness();

  if (!business) {
    business = await prisma.business.create({
      data: {
        slug: process.env.MCOS_BUSINESS_SLUG || DEFAULT_BUSINESS_SLUG,
        name: process.env.MCOS_BUSINESS_NAME || "MOSH Digital Studios",
        tagline: "AI automation, websites and digital products.",
        areas: {
          create: DEFAULT_BUSINESS_AREAS.map((area, index) => ({
            slug: area.slug,
            name: area.name,
            description: area.description,
            order: index,
          })),
        },
      },
    });
  }

  const existing = await prisma.membership.findUnique({
    where: { businessId_userId: { businessId: business.id, userId } },
  });
  if (existing) return { business, membership: existing };

  const memberCount = await prisma.membership.count({ where: { businessId: business.id } });
  const membership = await prisma.membership.create({
    data: {
      businessId: business.id,
      userId,
      role: memberCount === 0 ? CosRole.OWNER : CosRole.VIEWER,
    },
  });
  return { business, membership };
}

/**
 * Resolve the signed-in user into a M-CoS context. Throws `unauthorized` when
 * there is no session — never returns a partially-populated context.
 */
export const requireCosContext = cache(async (): Promise<CosContext> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw unauthorized();

  const { business, membership } = await ensureMembership(userId);
  if (!membership.active) throw forbidden("Your access to this workspace has been disabled.");

  return {
    userId,
    userName: session.user?.name ?? "Founder",
    userEmail: session.user?.email ?? "",
    businessId: business.id,
    businessName: business.name,
    currency: business.currency,
    timezone: business.timezone,
    role: membership.role,
  };
});

/** Resolve the context and assert a permission in one step. */
export async function requirePermission(permission: Permission): Promise<CosContext> {
  const ctx = await requireCosContext();
  assertPermission(ctx, permission);
  return ctx;
}
