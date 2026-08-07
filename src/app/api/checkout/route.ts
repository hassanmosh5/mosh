import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { hasCourseAccess } from "@/lib/entitlement";

const schema = z.object({
  courseSlug: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Payments aren't configured yet. Set STRIPE_SECRET_KEY in your environment to enable checkout.",
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { slug: parsed.data.courseSlug },
  });
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  if (course.priceCents <= 0) {
    return NextResponse.json(
      { error: "This course is free — no checkout needed." },
      { status: 400 }
    );
  }

  const alreadyOwned = await hasCourseAccess(session.user.id, course);
  if (alreadyOwned) {
    return NextResponse.json(
      { error: "You already have access to this course." },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      client_reference_id: session.user.id,
      line_items: [
        {
          price_data: {
            currency: course.currency,
            unit_amount: course.priceCents,
            product_data: {
              name: course.title,
              description: course.subtitle ?? undefined,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { userId: session.user.id, courseId: course.id },
      success_url: `${appUrl}/courses/${course.slug}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/courses/${course.slug}?purchase=cancelled`,
    });

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId: session.user.id, courseId: course.id },
      },
      update: {
        status: "PENDING",
        amountCents: course.priceCents,
        currency: course.currency,
        stripeCheckoutSessionId: checkoutSession.id,
      },
      create: {
        userId: session.user.id,
        courseId: course.id,
        status: "PENDING",
        amountCents: course.priceCents,
        currency: course.currency,
        stripeCheckoutSessionId: checkoutSession.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed", error);
    return NextResponse.json(
      { error: "Couldn't start checkout. Try again shortly." },
      { status: 502 }
    );
  }
}
