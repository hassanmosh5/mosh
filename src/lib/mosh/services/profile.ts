import { prisma } from "@/lib/prisma";
import type { MoshContext } from "../context";
import { BRAND } from "../constants";
import type { profileSchema } from "../schemas";
import type { z } from "zod";

/** The user's own framing of the system: name, title, philosophy, mission. */
export async function getProfile(ctx: MoshContext) {
  const profile = await prisma.moshProfile.findUnique({ where: { userId: ctx.userId } });
  return {
    displayName: profile?.displayName ?? ctx.userName,
    title: profile?.title ?? BRAND.title,
    philosophy: profile?.philosophy ?? BRAND.philosophy,
    mission: profile?.mission ?? BRAND.mission.join("\n"),
    currency: profile?.currency ?? ctx.currency,
    timezone: profile?.timezone ?? ctx.timezone,
    planYear: profile?.planYear ?? ctx.planYear,
    eclipseStart: profile?.eclipseStart ? profile.eclipseStart.toISOString().slice(0, 10) : null,
    email: ctx.userEmail,
  };
}

export async function saveProfile(ctx: MoshContext, input: z.infer<typeof profileSchema>) {
  await prisma.moshProfile.update({
    where: { userId: ctx.userId },
    data: {
      displayName: input.displayName,
      title: input.title ?? undefined,
      philosophy: input.philosophy ?? undefined,
      mission: input.mission,
      currency: input.currency,
      timezone: input.timezone,
      planYear: input.planYear ?? undefined,
    },
  });
  return getProfile(ctx);
}
