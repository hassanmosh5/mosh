import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
// The HTTP error and rate-limit primitives were written for M-CoS but are
// application infrastructure, not Chief-of-Staff domain logic. MOSH reuses them
// rather than growing a second, subtly different error contract.
import { unauthorized } from "@/lib/cos/errors";
import { BRAND, DEFAULT_CURRENCY } from "./constants";

export type MoshContext = {
  userId: string;
  userName: string;
  userEmail: string;
  displayName: string;
  currency: string;
  timezone: string;
  philosophy: string;
  title: string;
  planYear: number;
  eclipseStart: Date | null;
};

/**
 * Resolve the signed-in user into a MOSH context, creating their profile on
 * first contact.
 *
 * MOSH is a personal system: there is no workspace to join and no role to
 * grant. Access control is therefore a single rule — every query filters by
 * `ctx.userId` — enforced by the services in `./services`.
 */
export const requireMoshContext = cache(async (): Promise<MoshContext> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw unauthorized();

  const profile =
    (await prisma.moshProfile.findUnique({ where: { userId } })) ??
    (await prisma.moshProfile.create({
      data: {
        userId,
        displayName: session.user?.name ?? null,
        currency: DEFAULT_CURRENCY,
        mission: BRAND.mission.join("\n"),
        planYear: new Date().getUTCFullYear(),
        onboardedAt: new Date(),
      },
    }));

  return {
    userId,
    userName: session.user?.name ?? "Friend",
    userEmail: session.user?.email ?? "",
    displayName: profile.displayName ?? session.user?.name ?? "Friend",
    currency: profile.currency,
    timezone: profile.timezone,
    philosophy: profile.philosophy,
    title: profile.title,
    planYear: profile.planYear ?? new Date().getUTCFullYear(),
    eclipseStart: profile.eclipseStart,
  };
});
