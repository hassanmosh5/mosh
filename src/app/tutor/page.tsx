import { TutorChat } from "./tutor-chat";

export default async function TutorPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson } = await searchParams;
  return (
    <div className="mx-auto flex h-[calc(100vh-73px)] max-w-3xl flex-col px-6 py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">AI Tutor</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Ask questions about The AI Income Blueprint. Answers are grounded in
          the book&apos;s actual content.
        </p>
      </div>
      <TutorChat lessonSlug={lesson} />
    </div>
  );
}
