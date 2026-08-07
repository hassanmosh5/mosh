import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const course = await prisma.course.findUnique({
    where: { slug: "ai-income-blueprint" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  const lessonCount =
    course?.modules.reduce((n, m) => n + m.lessons.length, 0) ?? 0;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 py-24">
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium tracking-wide uppercase dark:bg-white/10">
          Based on the book by Hassan Mohammed
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {course?.title ?? "The AI Income Blueprint"}
        </h1>
        <p className="max-w-2xl text-lg text-black/60 dark:text-white/60">
          {course?.subtitle ??
            "How non-tech professionals are earning $1,000–$5,000 per month with simple AI tools."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black"
          >
            Start learning free
          </Link>
          <Link
            href="/courses"
            className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Browse the course
          </Link>
        </div>
        {course && (
          <p className="text-sm text-black/50 dark:text-white/50">
            {course.modules.length} parts · {lessonCount} lessons · knowledge
            checks + an AI tutor built into every lesson
          </p>
        )}
      </section>

      {/* What you'll learn */}
      {course && (
        <section className="border-t border-black/10 dark:border-white/10">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-semibold">What you&apos;ll learn</h2>
            <p className="mt-2 max-w-2xl text-black/60 dark:text-white/60">
              Five parts, seventeen lessons — from mindset and tools to seven
              fully-scoped income streams and a 30-day launch plan.
            </p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {course.modules.map((m, i) => (
                <li
                  key={m.id}
                  className="rounded-xl border border-black/10 p-5 dark:border-white/10"
                >
                  <span className="text-xs font-medium text-black/40 dark:text-white/40">
                    Part {i + 1}
                  </span>
                  <h3 className="mt-1 font-medium">
                    {m.title.replace(/^Part [A-Za-z]+: /, "")}
                  </h3>
                  <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                    {m.lessons.length} lesson{m.lessons.length === 1 ? "" : "s"}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold">
            Built for actually finishing
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-medium">Progress tracking</h3>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                Pick up exactly where you left off, lesson by lesson, with a
                dashboard that shows how far you&apos;ve come.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Knowledge checks</h3>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                Every lesson ends with a short quiz grounded in the
                book&apos;s actual frameworks and case studies.
              </p>
            </div>
            <div>
              <h3 className="font-medium">AI tutor</h3>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                Ask questions about any lesson and get answers grounded in the
                book&apos;s content — not a generic chatbot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-6 py-16">
          <h2 className="text-2xl font-semibold">Ready to start?</h2>
          <p className="max-w-xl text-black/60 dark:text-white/60">
            Create a free account and start with Chapter 1 — no credit card
            required.
          </p>
          <Link
            href="/register"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black"
          >
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
}
