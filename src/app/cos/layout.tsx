import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireCosContext } from "@/lib/cos/context";
import { CommandPalette } from "@/components/cos/command-palette";
import { SidebarNav } from "@/components/cos/sidebar";
import { buttonClass } from "@/components/cos/controls";

export const metadata: Metadata = {
  title: {
    default: "MOSH Chief of Staff",
    template: "%s · MOSH Chief of Staff",
  },
  description:
    "The executive operating system for MOSH Digital Studios — priorities, projects, clients, agents and automation in one place.",
};

export default async function CosLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-braces: proxy.ts already gates /cos, but the layout re-checks so a
  // misconfigured matcher can never expose business data.
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/cos");

  const ctx = await requireCosContext();
  const unreadCount = await prisma.notification.count({
    where: { businessId: ctx.businessId, readAt: null },
  });

  return (
    <div className="cos-root flex min-h-dvh">
      <SidebarNav businessName={ctx.businessName} role={ctx.role} unreadCount={unreadCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur">
          <CommandPalette />
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-xs text-ink-subtle hover:text-ink">
              Academy
            </Link>
            <span className="hidden text-xs text-ink-muted sm:inline">{ctx.userName}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button type="submit" className={buttonClass("secondary", "sm")}>
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
