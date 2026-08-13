import { SiteHeader } from "@/components/site-header";

/**
 * Shell for the AI Income Academy learning platform. MOSH Chief of Staff lives
 * under /cos with its own shell, so the two products share auth and the
 * database without sharing chrome.
 */
export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
