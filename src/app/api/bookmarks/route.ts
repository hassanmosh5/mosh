import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isLessonAccessible } from "@/lib/entitlement";

const schema = z.object({
  lessonId: z.string().min(1),
});

/** Toggles a bookmark for a lesson: creates it if missing, removes it if present. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { lessonId } = parsed.data;

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

  const existing = await prisma.bookmark.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({
    data: { userId: session.user.id, lessonId },
  });
  return NextResponse.json({ bookmarked: true });
}
