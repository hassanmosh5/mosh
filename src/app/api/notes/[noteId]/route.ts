import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  body: z.string().min(1).max(5000),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { noteId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.userId !== session.user.id) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  const updated = await prisma.note.update({
    where: { id: noteId },
    data: { body: parsed.data.body },
  });

  return NextResponse.json({ note: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { noteId } = await params;
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.userId !== session.user.id) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  await prisma.note.delete({ where: { id: noteId } });

  return NextResponse.json({ ok: true });
}
