import { prisma } from "@/lib/prisma";
import { notFound } from "@/lib/cos/errors";
import type { MoshContext } from "../context";
import { DEFAULT_LEGACY_LETTER } from "../constants";
import type { letterSchema } from "../schemas";
import type { z } from "zod";

/**
 * A Message From My 77-Year-Old Self.
 *
 * On first visit the default letter is written into the user's own collection
 * rather than rendered as static text — so it can be edited, added to, and
 * lived with, which is the entire point of the module.
 */

export type LetterView = {
  id: string;
  kind: "FUTURE_WISDOM" | "LEGACY_LESSON" | "ADVICE_TO_YOUNGER_SELF";
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listLetters(ctx: MoshContext): Promise<LetterView[]> {
  const count = await prisma.moshLegacyLetter.count({ where: { userId: ctx.userId } });

  if (count === 0) {
    await prisma.moshLegacyLetter.create({
      data: {
        userId: ctx.userId,
        kind: "FUTURE_WISDOM",
        title: DEFAULT_LEGACY_LETTER.title,
        body: DEFAULT_LEGACY_LETTER.body,
        pinned: true,
      },
    });
  }

  const rows = await prisma.moshLegacyLetter.findMany({
    where: { userId: ctx.userId },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body,
    pinned: row.pinned,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function saveLetter(ctx: MoshContext, input: z.infer<typeof letterSchema>) {
  if (input.id) {
    const existing = await prisma.moshLegacyLetter.findFirst({
      where: { id: input.id, userId: ctx.userId },
    });
    if (!existing) throw notFound("That letter could not be found.");

    return prisma.moshLegacyLetter.update({
      where: { id: input.id },
      data: { kind: input.kind, title: input.title, body: input.body, pinned: input.pinned },
    });
  }

  return prisma.moshLegacyLetter.create({
    data: {
      userId: ctx.userId,
      kind: input.kind,
      title: input.title,
      body: input.body,
      pinned: input.pinned,
    },
  });
}

export async function deleteLetter(ctx: MoshContext, id: string) {
  const existing = await prisma.moshLegacyLetter.findFirst({
    where: { id, userId: ctx.userId },
  });
  if (!existing) throw notFound("That letter could not be found.");
  await prisma.moshLegacyLetter.delete({ where: { id } });
  return { ok: true };
}
