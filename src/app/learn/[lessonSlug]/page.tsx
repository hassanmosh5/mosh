import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isLessonAccessible } from "@/lib/entitlement";
import { MarkCompleteButton } from "./mark-complete-button";
import { LessonQuiz } from "./lesson-quiz";
import { BookmarkButton } from "./bookmark-button";
import { NotesSection } from "./notes-section";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const session = await auth();

  const lesson = await prisma.lesson.findUnique({
    where: { slug: lessonSlug },
    include: {
      module: {
        include: {
          course: true,
          lessons: { orderBy: { order: "asc" } },
        },
      },
      quiz: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });

  if (!lesson) notFound();

  const course = lesson.module.course;

  const courseModules = await prisma.module.findMany({
    where: { courseId: course.id },
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  const flatLessons = courseModules.flatMap((m) => m.lessons);
  const currentIndex = flatLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < flatLessons.length - 1
      ? flatLessons[currentIndex + 1]
      : null;

  const accessible = session?.user
    ? await isLessonAccessible(session.user.id, lesson.id)
    : currentIndex === 0;

  if (!accessible) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-xs text-black/40 dark:text-white/40">
          <Link href={`/courses/${course.slug}`} className="hover:underline">
            {course.title}
          </Link>{" "}
          · {lesson.module.title.replace(/^Part [A-Za-z]+: /, "")}
        </div>
        <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>
        {lesson.summary && (
          <p className="mt-2 text-black/60 dark:text-white/60">
            {lesson.summary}
          </p>
        )}
        <div className="mt-8 rounded-xl border border-black/10 p-8 text-center dark:border-white/10">
          <p className="text-lg font-medium">🔒 This lesson is locked</p>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Buy course access to unlock every lesson, quiz, and the AI tutor.
          </p>
          <Link
            href={`/courses/${course.slug}`}
            className="mt-5 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black"
          >
            View pricing
          </Link>
        </div>
      </div>
    );
  }

  const progress = session?.user
    ? await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: { userId: session.user.id, lessonId: lesson.id },
        },
      })
    : null;

  const lastAttempt =
    session?.user && lesson.quiz
      ? await prisma.quizAttempt.findFirst({
          where: { userId: session.user.id, quizId: lesson.quiz.id },
          orderBy: { createdAt: "desc" },
        })
      : null;

  const [bookmark, notes] = session?.user
    ? await Promise.all([
        prisma.bookmark.findUnique({
          where: {
            userId_lessonId: { userId: session.user.id, lessonId: lesson.id },
          },
        }),
        prisma.note.findMany({
          where: { userId: session.user.id, lessonId: lesson.id },
          orderBy: { createdAt: "desc" },
        }),
      ])
    : [null, []];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-xs text-black/40 dark:text-white/40">
        <Link href={`/courses/${course.slug}`} className="hover:underline">
          {course.title}
        </Link>{" "}
        · {lesson.module.title.replace(/^Part [A-Za-z]+: /, "")}
      </div>
      <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>
      {lesson.summary && (
        <p className="mt-2 text-black/60 dark:text-white/60">
          {lesson.summary}
        </p>
      )}
      <div className="mt-1 flex items-center justify-between">
        <p className="text-xs text-black/40 dark:text-white/40">
          {lesson.estMinutes} min read
        </p>
        <div className="flex items-center gap-4">
          {session?.user && (
            <BookmarkButton
              lessonId={lesson.id}
              bookmarked={Boolean(bookmark)}
            />
          )}
          <Link
            href={`/tutor?lesson=${lesson.slug}`}
            className="text-xs font-medium underline"
          >
            Ask the AI tutor about this lesson
          </Link>
        </div>
      </div>

      <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <Markdown>{lesson.content}</Markdown>
      </article>

      {lesson.keyTakeaways.length > 0 && (
        <div className="mt-10 rounded-xl border border-black/10 p-5 dark:border-white/10">
          <h2 className="font-medium">Key takeaways</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-black/70 dark:text-white/70">
            {lesson.keyTakeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {lesson.caseStudy && (
        <div className="mt-4 rounded-xl border border-black/10 p-5 dark:border-white/10">
          <h2 className="font-medium">Case study</h2>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">
            {lesson.caseStudy}
          </p>
        </div>
      )}

      {lesson.actionStep && (
        <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <h2 className="font-medium">Action step</h2>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">
            {lesson.actionStep}
          </p>
        </div>
      )}

      {lesson.quiz && lesson.quiz.questions.length > 0 && (
        <LessonQuiz
          quizId={lesson.quiz.id}
          questions={lesson.quiz.questions.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            choices: q.choices,
          }))}
          lastScore={lastAttempt?.score ?? null}
        />
      )}

      {session?.user && (
        <NotesSection
          lessonId={lesson.id}
          initialNotes={notes.map((n) => ({
            id: n.id,
            body: n.body,
            createdAt: n.createdAt.toISOString(),
          }))}
        />
      )}

      <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6 dark:border-white/10">
        {session?.user ? (
          <MarkCompleteButton
            lessonId={lesson.id}
            completed={progress?.status === "COMPLETED"}
          />
        ) : (
          <span />
        )}
        <div className="flex gap-3 text-sm">
          {prevLesson && (
            <Link
              href={`/learn/${prevLesson.slug}`}
              className="rounded-full border border-black/15 px-4 py-2 transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              ← Previous
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/learn/${nextLesson.slug}`}
              className="rounded-full bg-black px-4 py-2 text-white transition hover:opacity-85 dark:bg-white dark:text-black"
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
