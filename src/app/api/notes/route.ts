import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isLessonAccessible } from "@/lib/entitlement";

const createSchema = z.object({
  lessonId: z.string().min(1),
  body: z.string().min(1).max(5000),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json(
      { error: "lessonId query param is required." },
      { status: 400 }
    );
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id, lessonId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { lessonId, body: noteBody } = parsed.data;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  if (!(await isLessonAccessible(session.user.id, lessonId))) {
    return NextResponse.json(
      { error: "You don't have access to this lesson yet." },
      { status: 403 }
    );
  }

  const note = await prisma.note.create({
    data: { userId: session.user.id, lessonId, body: noteBody },
  });

  return NextResponse.json({ note }, { status: 201 });
}
