import "server-only";

import type { BoardRow } from "./board";
import { normalizeName } from "./board";
import { getSupabase } from "./supabase";

type ListingRow = {
  id: string;
  name: string;
  category: string;
  location: string;
  event_date: string | null;
  bid_cents: number;
  apply_url: string;
  blurb: string;
  created_at: string;
  updated_at: string;
};

/** Today in UTC as `YYYY-MM-DD`, the form Postgres compares a `date` against. */
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const SELECT =
  "id, name, category, location, event_date, bid_cents, apply_url, blurb, created_at, updated_at";

function toBoardRow(row: ListingRow): BoardRow {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    location: row.location,
    eventDate: row.event_date,
    bidCents: row.bid_cents,
    applyUrl: row.apply_url,
    blurb: row.blurb,
  };
}

/**
 * The board, highest bid first with ties going to whoever got there first —
 * the same ordering `listings_rank_idx` serves.
 *
 * Read fresh on every request rather than cached. Rank is money: a buyer who
 * lands back on the page after paying has to see the position they just
 * bought, and someone deciding what to bid has to see what it currently costs.
 * It is one indexed query against a small table.
 */
export async function getBoard(): Promise<BoardRow[]> {
  const { data, error } = await getSupabase()
    .from("listings")
    .select(SELECT)
    // A market still shows on its own day, so this is `gte`, not `gt`. A date
    // is required at checkout, so a null one means the listing predates the
    // column; those stay up rather than vanishing retroactively.
    .or(`event_date.is.null,event_date.gte.${todayIso()}`)
    .order("bid_cents", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to load the board: ${error.message}`);
  return (data ?? []).map(toBoardRow);
}

export type RecentBid = { id: string; name: string; bidCents: number; at: string };

/** Most recently moved listings, newest first — the "Latest activity" strip. */
export async function getRecentBids(limit = 5): Promise<RecentBid[]> {
  const { data, error } = await getSupabase()
    .from("listings")
    .select("id, name, bid_cents, updated_at")
    .or(`event_date.is.null,event_date.gte.${todayIso()}`)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to load activity: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    bidCents: row.bid_cents,
    at: row.updated_at,
  }));
}

/**
 * The listing a market name + email already owns, if any. Drives "raising a
 * bid costs the difference" — the caller charges the gap up to the new total.
 */
export async function findOwnedListing(name: string, email: string) {
  const { data, error } = await getSupabase()
    .from("listings")
    .select(SELECT)
    .eq("normalized_name", normalizeName(name))
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) throw new Error(`Failed to look up the listing: ${error.message}`);
  return data ? toBoardRow(data) : null;
}

/**
 * Applies a paid Checkout Session to the board — atomic and idempotent, both
 * of which live in the `apply_paid_bid` SQL function rather than here. Safe to
 * call twice for the same session; the second call is a no-op.
 */
export async function recordPaidBid(input: {
  sessionId: string;
  name: string;
  email: string;
  applyUrl: string;
  category: string;
  location: string;
  blurb: string;
  /** ISO date the market happens. Null only on listings predating the column. */
  eventDate: string | null;
  /** The listing's new cumulative total — not the amount charged. */
  totalCents: number;
  /** What the card was actually charged, i.e. the delta on a raise. */
  chargedCents: number;
}): Promise<BoardRow> {
  const { data, error } = await getSupabase().rpc("apply_paid_bid", {
    p_session_id: input.sessionId,
    p_name: input.name.trim(),
    p_normalized: normalizeName(input.name),
    p_email: input.email.trim().toLowerCase(),
    p_apply_url: input.applyUrl,
    p_category: input.category,
    p_location: input.location,
    p_blurb: input.blurb,
    p_event_date: input.eventDate,
    p_total_cents: input.totalCents,
    p_charged_cents: input.chargedCents,
  });

  if (error) throw new Error(`Failed to record the bid: ${error.message}`);
  return toBoardRow(data as ListingRow);
}

/**
 * What to show someone Stripe has just sent back to us.
 *
 * Reads the session from Stripe rather than trusting the `?paid=` value in the
 * URL — anyone can type a session id. The listing may not exist yet if the
 * redirect beat the webhook, which is why `listing` is nullable and the
 * confirmation can still render from the session alone.
 */
export async function getPaidConfirmation(sessionId: string) {
  const { getStripe } = await import("./stripe");

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }

  if (session.payment_status !== "paid") return null;

  const name = session.metadata?.name;
  const email = session.metadata?.email;
  if (!name || !email) return null;

  const listing = await findOwnedListing(name, email);

  return {
    name,
    totalCents: Number(session.metadata?.totalCents ?? 0),
    listing,
  };
}
