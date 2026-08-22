import "server-only";

import Stripe from "stripe";

/**
 * Server-side Stripe client, created on first use — same reasoning as
 * `getSupabase()`: don't take down a build over a secret the build doesn't
 * need.
 *
 * No `apiVersion` pin: the installed SDK version decides, so upgrading the
 * package is the single place a version changes.
 */
let client: Stripe | null = null;

export function getStripe() {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY. Checkout can't be created.");
  }

  client = new Stripe(key);
  return client;
}
