import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  answers: z.array(z.number().int().min(0)),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quizId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }

  const { answers } = parsed.data;
  if (answers.length !== quiz.questions.length) {
    return NextResponse.json(
      { error: "Answer count does not match question count." },
      { status: 400 }
    );
  }

  let correctCount = 0;
  const correct: Record<string, number> = {};
  quiz.questions.forEach((q, i) => {
    correct[q.id] = q.answer;
    if (answers[i] === q.answer) correctCount += 1;
  });

  const score = Math.round((correctCount / quiz.questions.length) * 100);

  await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId,
      score,
      answers,
    },
  });

  return NextResponse.json({ score, correct });
}
