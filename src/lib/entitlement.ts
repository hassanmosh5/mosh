import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

/** Whether a user has paid access to a course. Free courses always return true. */
export async function hasCourseAccess(
  userId: string,
  course: { id: string; priceCents: number }
): Promise<boolean> {
  if (course.priceCents <= 0) return true;

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });

  return enrollment?.status === "COMPLETED";
}

/**
 * Whether a user may view a specific lesson: either they own the course,
 * or the lesson is that course's free-preview lesson (the very first one).
 */
export async function isLessonAccessible(
  userId: string,
  lessonId: string
): Promise<boolean> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });
  if (!lesson) return false;

  const course = lesson.module.course;
  if (course.priceCents <= 0) return true;

  const firstModule = await prisma.module.findFirst({
    where: { courseId: course.id },
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" }, take: 1 } },
  });
  const firstLessonId = firstModule?.lessons[0]?.id;
  if (lesson.id === firstLessonId) return true;

  return hasCourseAccess(userId, course);
}

/** Fulfills a Stripe Checkout Session by marking the matching Enrollment COMPLETED. Idempotent. */
export async function fulfillCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return null;

  const enrollment = await prisma.enrollment.findUnique({
    where: { stripeCheckoutSessionId: session.id },
  });
  if (!enrollment) return null;
  if (enrollment.status === "COMPLETED") return enrollment;

  return prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      status: "COMPLETED",
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
    },
  });
}
