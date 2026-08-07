import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          AI Income Academy
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/courses" className="hover:underline">
            Courses
          </Link>
          {session?.user && (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/tutor" className="hover:underline">
                AI Tutor
              </Link>
            </>
          )}
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-full bg-black px-4 py-1.5 text-white transition hover:opacity-85 dark:bg-white dark:text-black"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-black px-4 py-1.5 text-white transition hover:opacity-85 dark:bg-white dark:text-black"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
