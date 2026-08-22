/**
 * Board rules and money formatting — shared by the server (which prices and
 * charges bids) and the client (which previews them). Keep this file free of
 * server-only imports; the leaderboard runs it in the browser.
 */

/** One row of the board, as the page renders it. */
export type BoardRow = {
  id: string;
  name: string;
  category: string;
  /** Free-text "City, ST" as the organizer typed it. */
  location: string;
  /** Cumulative amount paid for position, in cents. */
  bidCents: number;
  applyUrl: string;
  blurb: string;
};

/** Cheapest bid that gets you onto the board. */
export const MIN_BID_CENTS = 500;

/** Rows shown before "Show all". */
export const PREVIEW_COUNT = 12;

/**
 * What we add to a bid to cover card processing — the "Processing" line on the
 * order summary. Modelled on Stripe's 2.9% + 30¢ and rounded up to a whole
 * dollar so the total stays a round number. It is our stated fee, not a
 * pass-through of Stripe's actual charge, so the two can differ by cents.
 */
export function processingFeeCents(bidCents: number) {
  return Math.max(100, Math.ceil((bidCents * 0.029 + 30) / 100) * 100);
}

/** `2840` → `$28.40`, `284000` → `$2,840`. Whole dollars drop the `.00`. */
export function formatUsd(cents: number) {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Ownership key for a market name. Bidding again under the same name and email
 * raises that listing rather than opening a second one, so this has to ignore
 * the ways people retype their own market: case, punctuation, extra spaces.
 */
export function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Strips the scheme so an apply link reads as plain text on the board. */
export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * The rank a HYPOTHETICAL bid would take, 1-indexed, against a board sorted
 * highest first. Ties go to the listing already there — you have to beat a
 * bid, not match it.
 *
 * Only for bids that aren't on the board yet. For a listing that already
 * exists, use `rankOf` — passing a real listing's own bid through here counts
 * it as its own competitor and reports one place too low.
 */
export function rankFor(rows: Pick<BoardRow, "bidCents">[], bidCents: number) {
  const beaten = rows.findIndex((row) => row.bidCents < bidCents);
  return beaten === -1 ? rows.length + 1 : beaten + 1;
}

/** The rank a listing already on the board holds. Null if it isn't there. */
export function rankOf(rows: Pick<BoardRow, "id">[], id: string) {
  const index = rows.findIndex((row) => row.id === id);
  return index === -1 ? null : index + 1;
}
