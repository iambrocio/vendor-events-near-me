/**
 * The board. One row per market, sorted highest bid first — that ordering *is*
 * the ranking, so whatever fills this array must come back sorted by `bid`
 * descending.
 *
 * Empty until bids are wired to a real source; the leaderboard renders its
 * empty state off `BOARD.length`.
 */
export type BoardRow = {
  name: string;
  category: string;
  /** Current bid in whole dollars. */
  bid: number;
  /** Vendor clicks since the listing went up — feeds the trending rate. */
  clicks: number;
  blurb: string;
};

export const BOARD: BoardRow[] = [];

/** The most recent position changes, newest first. */
export type ActivityEntry = { name: string; move: string; ago: string };

export const ACTIVITY: ActivityEntry[] = [];

/** Cheapest bid that gets you onto the board, in whole dollars. */
export const MIN_BID = 5;

/** Rows shown before "Show all". */
export const PREVIEW_COUNT = 12;

export function formatUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

/**
 * The apply URL we show under each listing — derived from the market name so
 * a row doesn't need a hand-written link.
 */
export function applyLink(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z ]/g, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .join("") + ".com/apply"
  );
}
