import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import type { CosContext } from "@/lib/cos/context";

/**
 * Integration tests run against a real PostgreSQL database so the query layer,
 * constraints and cascades are actually exercised. They skip themselves when
 * DATABASE_URL is unset — see TESTING.md.
 */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

export const prisma = hasDatabase
  ? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
  : (null as unknown as PrismaClient);

let counter = 0;
const suffix = () => `${Date.now().toString(36)}-${(counter += 1)}`;

export type TestWorkspace = {
  ctx: CosContext;
  userId: string;
  businessId: string;
};

/** Create an isolated business + owner so tests never see each other's data. */
export async function createWorkspace(name = "Test Business"): Promise<TestWorkspace> {
  const unique = suffix();
  const user = await prisma.user.create({
    data: { email: `test-${unique}@example.test`, name: "Test Owner" },
  });
  const business = await prisma.business.create({
    data: { slug: `test-${unique}`, name, currency: "GHS" },
  });
  await prisma.membership.create({
    data: { businessId: business.id, userId: user.id, role: "OWNER" },
  });

  return {
    userId: user.id,
    businessId: business.id,
    ctx: {
      userId: user.id,
      userName: "Test Owner",
      userEmail: user.email,
      businessId: business.id,
      businessName: business.name,
      currency: business.currency,
      timezone: business.timezone,
      role: "OWNER",
    },
  };
}

export function withRole(workspace: TestWorkspace, role: CosContext["role"]): CosContext {
  return { ...workspace.ctx, role };
}

export async function destroyWorkspace(workspace: TestWorkspace) {
  await prisma.business.deleteMany({ where: { id: workspace.businessId } });
  await prisma.user.deleteMany({ where: { id: workspace.userId } });
}

export async function disconnect() {
  if (hasDatabase) await prisma.$disconnect();
}
