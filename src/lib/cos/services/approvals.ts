import { prisma } from "@/lib/prisma";
import type { CosContext } from "../tenancy";
import { assertOwned } from "../tenancy";
import { recordAudit } from "../audit";
import { AppError } from "../errors";

/**
 * PLAN → APPROVE → EXECUTE.
 *
 * The AI can only ever produce the PLAN. Approving records the human decision;
 * executing is a separate, explicit step that the founder performs. M-CoS does
 * not carry out irreversible external actions on its own — approving a request
 * marks it as authorised and hands the founder the details to act on.
 */

export async function listApprovals(ctx: CosContext, options: { status?: string } = {}) {
  return prisma.approvalRequest.findMany({
    where: {
      businessId: ctx.businessId,
      ...(options.status ? { status: options.status as never } : {}),
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      requestedBy: { select: { id: true, name: true } },
      decidedBy: { select: { id: true, name: true } },
    },
    take: 100,
  });
}

export async function decideApproval(
  ctx: CosContext,
  id: string,
  input: { decision: "APPROVED" | "REJECTED"; note?: string }
) {
  const existing = await prisma.approvalRequest.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "approval request");

  if (existing!.status !== "PENDING") {
    throw new AppError(`That request was already ${existing!.status.toLowerCase()}.`, {
      status: 409,
      code: "already_decided",
    });
  }
  if (existing!.expiresAt && existing!.expiresAt < new Date()) {
    await prisma.approvalRequest.update({ where: { id }, data: { status: "EXPIRED" } });
    throw new AppError("That approval request has expired. Ask the AI to re-plan it.", {
      status: 409,
      code: "expired",
    });
  }

  const approval = await prisma.approvalRequest.update({
    where: { id },
    data: {
      status: input.decision,
      decidedById: ctx.userId,
      decidedAt: new Date(),
      result: input.note,
    },
  });

  await recordAudit(ctx, {
    action: `approval.${input.decision.toLowerCase()}`,
    entityType: "approval",
    entityId: id,
    detail: { action: existing!.action, note: input.note },
  });

  return approval;
}

/**
 * Record that an approved action has been carried out by a human. This closes
 * the audit loop: every sensitive action has a request, a decision and an
 * execution record naming the person responsible.
 */
export async function markExecuted(ctx: CosContext, id: string, note?: string) {
  const existing = await prisma.approvalRequest.findUnique({ where: { id } });
  await assertOwned(existing, ctx, "approval request");

  if (existing!.status !== "APPROVED") {
    throw new AppError("Only an approved request can be marked as executed.", {
      status: 409,
      code: "not_approved",
    });
  }

  const approval = await prisma.approvalRequest.update({
    where: { id },
    data: { status: "EXECUTED", executedAt: new Date(), result: note ?? existing!.result },
  });

  await recordAudit(ctx, {
    action: "approval.executed",
    entityType: "approval",
    entityId: id,
    detail: { action: existing!.action, note },
  });
  return approval;
}
