import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillCheckoutSession } from "@/lib/entitlement";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhooks aren't configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      await fulfillCheckoutSession(session.id);
    } catch (err) {
      console.error("Failed to fulfill checkout session", session.id, err);
      return NextResponse.json({ error: "Fulfillment failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
