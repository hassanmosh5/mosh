import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: { include: { lessons: { select: { id: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Courses</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">
        Everything currently available on the platform.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {courses.map((c) => {
          const lessonCount = c.modules.reduce(
            (n, m) => n + m.lessons.length,
            0
          );
          return (
            <Link
              key={c.id}
              href={`/courses/${c.slug}`}
              className="rounded-xl border border-black/10 p-6 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              <h2 className="text-lg font-medium">{c.title}</h2>
              {c.subtitle && (
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  {c.subtitle}
                </p>
              )}
              <p className="mt-3 text-xs text-black/40 dark:text-white/40">
                {c.modules.length} parts · {lessonCount} lessons
              </p>
            </Link>
          );
        })}
        {courses.length === 0 && (
          <p className="text-black/50 dark:text-white/50">
            No courses published yet.
          </p>
        )}
      </div>
    </div>
  );
}
