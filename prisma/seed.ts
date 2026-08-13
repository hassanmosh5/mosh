import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { course, modules } from "./seed-data";
import { seedChiefOfStaff } from "./cos-seed";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const dbCourse = await prisma.course.upsert({
    where: { slug: course.slug },
    update: {
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
    },
    create: {
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
    },
  });

  for (const [moduleOrder, mod] of modules.entries()) {
    const dbModule = await prisma.module.upsert({
      where: { slug: mod.slug },
      update: {
        title: mod.title,
        description: mod.description,
        order: moduleOrder,
        courseId: dbCourse.id,
      },
      create: {
        slug: mod.slug,
        title: mod.title,
        description: mod.description,
        order: moduleOrder,
        courseId: dbCourse.id,
      },
    });

    for (const [lessonOrder, lesson] of mod.lessons.entries()) {
      const dbLesson = await prisma.lesson.upsert({
        where: { slug: lesson.slug },
        update: {
          title: lesson.title,
          summary: lesson.summary,
          content: lesson.content,
          order: lessonOrder,
          estMinutes: lesson.estMinutes,
          keyTakeaways: lesson.keyTakeaways,
          actionStep: lesson.actionStep,
          caseStudy: lesson.caseStudy,
          moduleId: dbModule.id,
        },
        create: {
          slug: lesson.slug,
          title: lesson.title,
          summary: lesson.summary,
          content: lesson.content,
          order: lessonOrder,
          estMinutes: lesson.estMinutes,
          keyTakeaways: lesson.keyTakeaways,
          actionStep: lesson.actionStep,
          caseStudy: lesson.caseStudy,
          moduleId: dbModule.id,
        },
      });

      if (lesson.quiz.length === 0) continue;

      const dbQuiz = await prisma.quiz.upsert({
        where: { lessonId: dbLesson.id },
        update: {},
        create: { lessonId: dbLesson.id },
      });

      await prisma.question.deleteMany({ where: { quizId: dbQuiz.id } });
      await prisma.question.createMany({
        data: lesson.quiz.map((q, i) => ({
          quizId: dbQuiz.id,
          prompt: q.prompt,
          choices: q.choices,
          answer: q.answer,
          order: i,
        })),
      });
    }
  }

  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
  console.log(
    `Seeded course "${course.title}" with ${modules.length} modules and ${lessonCount} lessons.`
  );

  // MOSH Chief of Staff: workspace, business areas, agent registry, reference
  // knowledge, and (on a fresh workspace) clearly-flagged demo data.
  const cos = await seedChiefOfStaff(prisma);
  console.log(
    cos.demo
      ? "Seeded MOSH Chief of Staff with the agent registry and demo business data."
      : "Seeded MOSH Chief of Staff workspace, business areas and agent registry (demo data skipped)."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
