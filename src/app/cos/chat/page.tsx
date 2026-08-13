import { prisma } from "@/lib/prisma";
import { requireCosContext } from "@/lib/cos/context";
import { isAiConfigured } from "@/lib/cos/ai/client";
import { PageHeader } from "@/components/cos/ui";
import { ChatConsole } from "./chat-console";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ctx = await requireCosContext();
  const conversationId = typeof params.c === "string" ? params.c : undefined;

  const [conversations, messages] = await Promise.all([
    prisma.conversation.findMany({
      where: { businessId: ctx.businessId, archived: false },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: { id: true, title: true, updatedAt: true },
    }),
    conversationId
      ? prisma.message.findMany({
          where: {
            conversationId,
            conversation: { businessId: ctx.businessId },
            role: { in: ["USER", "ASSISTANT"] },
          },
          orderBy: { createdAt: "asc" },
          take: 100,
          select: { id: true, role: true, content: true, createdAt: true },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Chief of Staff"
        description="Ask for a plan, a review, or an analysis. Answers are grounded in your live business data through controlled tools."
      />
      <ChatConsole
        key={conversationId ?? "new"}
        configured={isAiConfigured()}
        conversationId={conversationId ?? null}
        conversations={conversations.map((conversation) => ({
          id: conversation.id,
          title: conversation.title,
        }))}
        initialMessages={messages.map((message) => ({
          id: message.id,
          role: message.role === "USER" ? "user" : "assistant",
          content: message.content,
        }))}
      />
    </div>
  );
}
