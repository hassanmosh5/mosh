import { prisma } from "@/lib/prisma";
import { ActorKind, AuditResult } from "@/generated/prisma/enums";
import type { CosContext } from "./tenancy";

export type AuditInput = {
  action: string;
  entityType?: string;
  entityId?: string;
  result?: AuditResult;
  detail?: Record<string, unknown>;
  actorKind?: ActorKind;
  actorId?: string;
  actorLabel?: string;
};

/**
 * Append an audit record.
 *
 * Auditing must never break the operation it is recording, so failures are
 * logged and swallowed. Everything that mutates business data, runs an agent or
 * touches an integration calls this.
 */
export async function recordAudit(
  ctx: Pick<CosContext, "businessId" | "userId" | "userName">,
  input: AuditInput
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        businessId: ctx.businessId,
        actorKind: input.actorKind ?? ActorKind.USER,
        actorId: input.actorId ?? ctx.userId,
        actorLabel: input.actorLabel ?? ctx.userName,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        result: input.result ?? AuditResult.SUCCESS,
        detail: (input.detail ?? undefined) as never,
      },
    });
  } catch (error) {
    console.error("[m-cos] failed to write audit log", { action: input.action, error });
  }
}
