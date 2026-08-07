import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasCourseAccess, fulfillCheckoutSession } from "@/lib/entitlement";
import { BuyButton } from "./buy-button";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string; purchase?: string }>;
}) {
  const { slug } = await params;
  const { session_id: checkoutSessionId, purchase } = await searchParams;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  const session = await auth();

  if (checkoutSessionId && session?.user) {
    // Synchronous fallback in case the Stripe webhook hasn't landed yet.
    await fulfillCheckoutSession(checkoutSessionId).catch(() => null);
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const firstLessonId = allLessons[0]?.id;

  let completedIds = new Set<string>();
  let owned = course.priceCents <= 0;
  if (session?.user) {
    const [progress, access] = await Promise.all([
      prisma.lessonProgress.findMany({
        where: {
          userId: session.user.id,
          lessonId: { in: allLessons.map((l) => l.id) },
          status: "COMPLETED",
        },
        select: { lessonId: true },
      }),
      hasCourseAccess(session.user.id, course),
    ]);
    completedIds = new Set(progress.map((p) => p.lessonId));
    owned = access;
  }

  const nextLesson =
    allLessons.find((l) => !completedIds.has(l.id)) ?? allLessons[0];
  const percent = allLessons.length
    ? Math.round((completedIds.size / allLessons.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">{course.title}</h1>
      {course.subtitle && (
        <p className="mt-2 text-black/60 dark:text-white/60">
          {course.subtitle}
        </p>
      )}
      <p className="mt-4 max-w-2xl text-black/70 dark:text-white/70">
        {course.description}
      </p>

      {checkoutSessionId && owned && (
        <p className="mt-4 rounded-lg border border-green-600/30 bg-green-600/5 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          Payment received — you now have full access to this course.
        </p>
      )}
      {purchase === "cancelled" && (
        <p className="mt-4 rounded-lg border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black/60 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60">
          Checkout was cancelled — no charge was made.
        </p>
      )}

      {session?.user && allLessons.length > 0 && (
        <div className="mt-6 max-w-sm">
          <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/50">
            <span>Your progress</span>
            <span>{percent}%</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-black/10 dark:bg-white/10">
            <div
              className="h-2 rounded-full bg-black dark:bg-white"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-4">
        {owned || !session?.user ? (
          nextLesson && (
            <Link
              href={
                owned
                  ? `/learn/${nextLesson.slug}`
                  : `/learn/${allLessons[0]?.slug}`
              }
              className="inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black"
            >
              {!session?.user
                ? "Preview free lesson"
                : completedIds.size > 0
                  ? "Continue learning"
                  : "Start course"}
            </Link>
          )
        ) : (
          <>
            <BuyButton courseSlug={course.slug} />
            <span className="text-sm text-black/60 dark:text-white/60">
              {formatPrice(course.priceCents, course.currency)} · one-time,
              lifetime access
            </span>
          </>
        )}
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {course.modules.map((m, i) => (
          <div key={m.id}>
            <h2 className="text-lg font-medium">
              Part {i + 1}: {m.title.replace(/^Part [A-Za-z]+: /, "")}
            </h2>
            {m.description && (
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                {m.description}
              </p>
            )}
            <ol className="mt-4 flex flex-col divide-y divide-black/10 rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/10">
              {m.lessons.map((l) => {
                const done = completedIds.has(l.id);
                const locked = !owned && l.id !== firstLessonId;
                return (
                  <li key={l.id}>
                    <Link
                      href={`/learn/${l.slug}`}
                      className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                            done
                              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                              : "border-black/30 dark:border-white/30"
                          }`}
                        >
                          {done ? "✓" : ""}
                        </span>
                        {l.title}
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-xs text-black/40 dark:text-white/40">
                        {locked && "🔒"}
                        {l.estMinutes} min
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
