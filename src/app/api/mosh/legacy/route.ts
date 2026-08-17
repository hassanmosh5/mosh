import { readJson, readQuery, route } from "@/lib/mosh/api";
import { letterSchema } from "@/lib/mosh/schemas";
import { deleteLetter, listLetters, saveLetter } from "@/lib/mosh/services/legacy";
import { z } from "zod";

export const GET = route({}, async (ctx) => ({ letters: await listLetters(ctx) }));

export const POST = route({}, async (ctx, request) => {
  const input = await readJson(request, letterSchema);
  await saveLetter(ctx, input);
  return { letters: await listLetters(ctx) };
});

export const DELETE = route({}, async (ctx, request) => {
  const { id } = readQuery(request, z.object({ id: z.string().trim().min(1).max(40) }));
  await deleteLetter(ctx, id);
  return { letters: await listLetters(ctx) };
});
