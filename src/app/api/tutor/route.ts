import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isLessonAccessible } from "@/lib/entitlement";
import { buildTutorSystemPrompt } from "@/lib/tutor-context";

const schema = z.object({
  lessonSlug: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(30),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "The AI tutor isn't configured yet. Set OPENAI_API_KEY in your environment to enable it.",
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { messages } = parsed.data;
  let { lessonSlug } = parsed.data;

  if (lessonSlug) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug: lessonSlug },
      select: { id: true },
    });
    const accessible =
      lesson && (await isLessonAccessible(session.user.id, lesson.id));
    if (!accessible) lessonSlug = undefined;
  }

  const systemPrompt = await buildTutorSystemPrompt(lessonSlug);

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_TUTOR_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.4,
      max_tokens: 700,
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI tutor request failed", error);
    return NextResponse.json(
      { error: "The AI tutor is temporarily unavailable. Try again shortly." },
      { status: 502 }
    );
  }
}
