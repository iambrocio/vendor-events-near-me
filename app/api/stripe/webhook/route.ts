import type Stripe from "stripe";
import { recordPaidBid } from "@/lib/listings";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe webhook — the only thing that puts a listing on the board.
 *
 * `success_url` deliberately doesn't write anything: people close the tab
 * mid-redirect, and the URL is guessable. A signed webhook is the one report
 * of a payment we can trust.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing — refusing the event.");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  // Must be the raw body: the signature covers the exact bytes Stripe sent, so
  // parsing to JSON first and re-serializing would never verify.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    // A bad signature means it isn't from Stripe. 400 so it isn't retried.
    console.error("Stripe signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // `mode: "payment"` sessions can complete unpaid when the payment method is
  // asynchronous. Position is only bought once the money is actually there.
  if (session.payment_status !== "paid") {
    return Response.json({ ignored: "unpaid", status: session.payment_status });
  }

  const meta = session.metadata ?? {};
  const totalCents = Number(meta.totalCents);
  const chargedCents = Number(meta.chargedCents);

  if (!meta.name || !meta.applyUrl || !Number.isFinite(totalCents)) {
    console.error("Checkout session is missing bid metadata:", session.id);
    // 200: retrying won't conjure the metadata, and a 500 would have Stripe
    // hammering this endpoint for days.
    return Response.json({ ignored: "incomplete metadata" });
  }

  try {
    const listing = await recordPaidBid({
      sessionId: session.id,
      name: meta.name,
      email: meta.email || session.customer_email || "",
      applyUrl: meta.applyUrl,
      category: meta.category || "Market",
      location: meta.location ?? "",
      blurb: meta.blurb ?? "",
      // Metadata values are always strings, and the action requires a date, so
      // "" only shows up on a session created before it was mandatory.
      eventDate: meta.eventDate || null,
      totalCents,
      chargedCents: Number.isFinite(chargedCents) ? chargedCents : totalCents,
    });

    // Nothing to revalidate: the board is read per request, so the next page
    // view already reflects this.
    return Response.json({ listing: listing.id });
  } catch (error) {
    // 500 so Stripe retries — `apply_paid_bid` is idempotent, so a retry that
    // arrives after a partial success can't double-charge position.
    console.error("Failed to apply a paid bid:", error);
    return new Response("Failed to record the bid", { status: 500 });
  }
}
