import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  const allLessonIds = courses.flatMap((c) =>
    c.modules.flatMap((m) => m.lessons.map((l) => l.id))
  );

  const progress = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: allLessonIds } },
  });
  const completedIds = new Set(
    progress.filter((p) => p.status === "COMPLETED").map((p) => p.lessonId)
  );

  const recentAttempts = await prisma.quizAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { quiz: { include: { lesson: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">
        Welcome back{session.user.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="mt-2 text-black/60 dark:text-white/60">
        Here&apos;s where you left off.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {courses.map((course) => {
          const lessons = course.modules.flatMap((m) => m.lessons);
          const completedCount = lessons.filter((l) =>
            completedIds.has(l.id)
          ).length;
          const percent = lessons.length
            ? Math.round((completedCount / lessons.length) * 100)
            : 0;
          const nextLesson =
            lessons.find((l) => !completedIds.has(l.id)) ?? lessons[0];

          return (
            <div
              key={course.id}
              className="rounded-xl border border-black/10 p-6 dark:border-white/10"
            >
              <h2 className="font-medium">{course.title}</h2>
              <div className="mt-3 flex items-center justify-between text-xs text-black/50 dark:text-white/50">
                <span>
                  {completedCount}/{lessons.length} lessons complete
                </span>
                <span>{percent}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-2 rounded-full bg-black dark:bg-white"
                  style={{ width: `${percent}%` }}
                />
              </div>
              {nextLesson && (
                <Link
                  href={`/learn/${nextLesson.slug}`}
                  className="mt-4 inline-block rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black"
                >
                  {completedCount > 0 ? "Continue" : "Start"}: {nextLesson.title}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-medium">Recent quiz attempts</h2>
        {recentAttempts.length === 0 ? (
          <p className="mt-2 text-sm text-black/50 dark:text-white/50">
            No quiz attempts yet — finish a lesson and take its knowledge
            check.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-black/10 rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/10">
            {recentAttempts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <Link
                  href={`/learn/${a.quiz.lesson.slug}`}
                  className="hover:underline"
                >
                  {a.quiz.lesson.title}
                </Link>
                <span className="text-black/50 dark:text-white/50">
                  {a.score}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <h2 className="font-medium">Need help with a concept?</h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Ask the AI tutor — it answers using the book&apos;s actual content.
        </p>
        <Link
          href="/tutor"
          className="mt-3 inline-block rounded-full border border-black/15 px-4 py-2 text-xs font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Open AI Tutor
        </Link>
      </div>
    </div>
  );
}
