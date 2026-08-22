"use server";

import { redirect } from "next/navigation";
import { MIN_BID_CENTS, normalizeName, processingFeeCents } from "@/lib/board";
import { findOwnedListing, getBoard } from "@/lib/listings";
import { getStripe } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site";

export type BidFormState = { error: string | null };

const MAX_BID_CENTS = 100_000_00; // $100k — a typo guard, not a policy.

function parseBidCents(raw: string) {
  const dollars = Number(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(dollars) || dollars <= 0) return null;
  return Math.round(dollars * 100);
}

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    // Rule 03: the link has to go somewhere a vendor can actually apply.
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Prices a bid and sends the organizer to Stripe's hosted checkout.
 *
 * Every number that ends up on the card is derived here, on the server. The
 * form is free to send whatever it likes — a Server Action is reachable by
 * direct POST, so treating the posted bid as anything but a request would let
 * anyone buy #1 for a nickel.
 */
export async function startCheckout(
  _prev: BidFormState,
  formData: FormData,
): Promise<BidFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const rawUrl = String(formData.get("applyUrl") ?? "");
  const blurb = String(formData.get("blurb") ?? "").trim().slice(0, 400);
  const category = String(formData.get("category") ?? "").trim().slice(0, 40) || "Market";

  if (!name || normalizeName(name).length < 2) {
    return { error: "Give the market a name." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "That email doesn't look right — the receipt goes there." };
  }

  const applyUrl = normalizeUrl(rawUrl);
  if (!applyUrl) {
    return { error: "The vendor application link has to be a real URL." };
  }

  const requested = parseBidCents(String(formData.get("bid") ?? ""));
  if (requested === null || requested > MAX_BID_CENTS) {
    return { error: "Enter a bid between $5 and $100,000." };
  }

  // Raising an existing listing charges only the gap (rule 06). Anyone else
  // pays the full bid. Either way the listing's new total is `requested`.
  const owned = await findOwnedListing(name, email);
  const alreadyPaid = owned?.bidCents ?? 0;

  if (requested < MIN_BID_CENTS) {
    return { error: "The cheapest spot on the board is $5." };
  }
  if (owned && requested <= alreadyPaid) {
    return {
      error: `You've already paid $${alreadyPaid / 100} for ${owned.name}. Bid higher than that to move up.`,
    };
  }

  const chargeCents = requested - alreadyPaid;
  const feeCents = processingFeeCents(chargeCents);

  // Only used to label the line item — the rank that sticks is whatever the
  // money earns when the webhook lands, which may differ if someone outbids
  // them while they're on Stripe's page. Rule 04.
  const board = await getBoard();
  const position = board.filter((row) => row.bidCents >= requested).length + 1;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    success_url: `${SITE_URL}/?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/?bid=cancelled`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: chargeCents,
          product_data: {
            name: owned ? `Raise ${name} to #${position}` : `${name} — bid for #${position}`,
            description: owned
              ? `Difference between your $${alreadyPaid / 100} bid and $${requested / 100}.`
              : "One-time bid for position on the Vendor Events leaderboard.",
          },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: feeCents,
          product_data: { name: "Processing" },
        },
      },
    ],
    // The webhook trusts these and nothing from the browser.
    metadata: {
      name,
      email,
      applyUrl,
      category,
      blurb,
      totalCents: String(requested),
      chargedCents: String(chargeCents),
    },
  });

  if (!session.url) {
    return { error: "Stripe didn't return a checkout page. Try again." };
  }

  redirect(session.url);
}
