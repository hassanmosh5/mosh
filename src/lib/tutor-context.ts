import { prisma } from "@/lib/prisma";

export async function buildTutorSystemPrompt(lessonSlug?: string) {
  const course = await prisma.course.findUnique({
    where: { slug: "ai-income-blueprint" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  const tableOfContents =
    course?.modules
      .map(
        (m) =>
          `${m.title}\n` +
          m.lessons.map((l) => `  - ${l.title}`).join("\n")
      )
      .join("\n") ?? "";

  let lessonContext = "";
  if (lessonSlug) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug: lessonSlug },
      include: { module: true },
    });
    if (lesson) {
      lessonContext = `

The student is currently on this lesson — ground your answer in it when relevant:

Title: ${lesson.title}
Part: ${lesson.module.title}
Summary: ${lesson.summary ?? ""}
Content:
${lesson.content}
${lesson.caseStudy ? `Case study: ${lesson.caseStudy}` : ""}
${lesson.actionStep ? `Action step: ${lesson.actionStep}` : ""}
Key takeaways: ${lesson.keyTakeaways.join("; ")}`;
    }
  }

  return `You are the AI Tutor for "${course?.title ?? "The AI Income Blueprint"}", an interactive course adapted from the book by Hassan Mohammed: "${course?.subtitle ?? ""}".

Answer student questions using the book's actual frameworks, terminology, and case studies below. Prefer citing the specific chapter/lesson a concept comes from. If a question falls outside the book's content, say so plainly, then give brief, honest best-effort guidance clearly labeled as beyond the book's scope — never invent facts and present them as being from the book.

Course table of contents:
${tableOfContents}
${lessonContext}

Keep answers focused and practical. Use short paragraphs or bullet points. Do not pad answers with filler.`;
}
