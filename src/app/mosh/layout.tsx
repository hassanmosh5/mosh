import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { requireMoshContext } from "@/lib/mosh/context";
import { BRAND } from "@/lib/mosh/constants";
import { formatLongDate, today } from "@/lib/mosh/dates";
import { MobileNav, Sidebar } from "@/components/mosh/nav";
import { ToastHost } from "@/components/mosh/toast";
import { OfflineBanner, ServiceWorkerRegistrar } from "@/components/mosh/pwa";
import { buttonClass } from "@/components/mosh/ui";

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.shortName}`,
  },
  description:
    "Align the mental, spiritual and physical planes while building a business that frees other people. Built by Hassan Mohammed — Structure Creates Freedom.",
  applicationName: BRAND.shortName,
  appleWebApp: { capable: true, statusBarStyle: "default", title: BRAND.shortName },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#08110f" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function MoshLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts gates /mosh at the edge; the layout re-checks because a matcher is
  // a convenience, not a security boundary.
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/mosh");

  const ctx = await requireMoshContext();

  return (
    <div className="mosh-root flex min-h-dvh">
      <ServiceWorkerRegistrar />
      <Sidebar philosophy={ctx.philosophy} />

      <div className="flex min-w-0 flex-1 flex-col">
        <OfflineBanner />
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-mosh-line bg-mosh-surface/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <MobileNav philosophy={ctx.philosophy} />
            <p className="hidden text-sm text-mosh-ink-muted sm:block">
              {formatLongDate(today())}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-mosh-ink-subtle md:inline">
              {ctx.displayName} · {ctx.title}
            </span>
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

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 lg:py-10">
          {children}
        </main>

        <footer className="border-t border-mosh-line px-4 py-6 text-center text-xs text-mosh-ink-subtle md:px-6">
          <p>
            {BRAND.owner} — {BRAND.title}
          </p>
          <p className="mt-1 italic">{BRAND.philosophy}</p>
        </footer>
      </div>

      <ToastHost />
    </div>
  );
}
