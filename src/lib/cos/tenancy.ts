import { CosRole } from "@/generated/prisma/enums";
import { forbidden, notFound } from "./errors";
import { roleHas, type Permission } from "./access";

/**
 * Tenancy primitives.
 *
 * Deliberately free of any auth or framework import: the service layer, the AI
 * tool layer and the tests all depend on these, and none of them should drag in
 * the session machinery. `context.ts` builds a CosContext from a real session.
 */
export type CosContext = {
  userId: string;
  userName: string;
  userEmail: string;
  businessId: string;
  businessName: string;
  currency: string;
  timezone: string;
  role: CosRole;
};

export function assertPermission(ctx: CosContext, permission: Permission): void {
  if (!roleHas(ctx.role, permission)) {
    throw forbidden(`Your role (${ctx.role.toLowerCase()}) cannot perform "${permission}".`);
  }
}

export function can(ctx: CosContext, permission: Permission): boolean {
  return roleHas(ctx.role, permission);
}

/**
 * Fetch a record and assert it belongs to the caller's business. Every
 * single-record read/update/delete goes through this so a guessed id from
 * another workspace can never be touched.
 */
export async function assertOwned<T extends { businessId: string }>(
  record: T | null,
  ctx: CosContext,
  label = "record"
): Promise<T> {
  if (!record || record.businessId !== ctx.businessId) {
    throw notFound(`That ${label} could not be found.`);
  }
  return record;
}
