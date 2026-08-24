import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import { rankOf } from "@/lib/board";
import { getBoard, getPaidConfirmation, getRecentBids } from "@/lib/listings";
import { Leaderboard } from "./Leaderboard";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await pageMetadata({
    key: "home",
    canonical: "/",
    defaultTitle: "Vendor Events Leaderboard — List Your Market",
    defaultDescription:
      "A board of markets, fairs and festivals, sorted by what organizers paid for their spot. Every price is public, and vendors go straight to your application.",
  });
  return {
    ...metadata,
    verification: {
      google: "BlxmLAALVyzFwyxHJSzzgH6VzWgtJD5Iw21dp65WCJY",
    },
  };
}

/**
 * Runs a query whose failure the page can survive, degrading to `fallback`.
 *
 * The board itself is the page, so if `getBoard` fails there is nothing worth
 * rendering and the error boundary should take over. Everything else here is
 * secondary — but because all three ran inside one `Promise.all`, a transient
 * Supabase error on the decorative activity strip used to reject the whole
 * render and take the paid listings down with it.
 */
async function survivable<T>(
  label: string,
  run: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`Homepage: ${label} failed; rendering without it.`, error);
    return fallback;
  }
}

/** `2026-08-22T18:04:00Z` → `18 min ago`. */
function timeAgo(iso: string) {
  const minutes = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string; bid?: string }>;
}) {
  const { paid: paidSession, bid } = await searchParams;

  const [rows, recent, confirmation] = await Promise.all([
    getBoard(),
    survivable("latest activity", () => getRecentBids(), null),
    paidSession
      ? survivable("paid confirmation", () => getPaidConfirmation(paidSession), null)
      : null,
  ]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />
      <Leaderboard
        rows={rows}
        activity={(recent ?? []).map((r) => ({
          id: r.id,
          name: r.name,
          bidCents: r.bidCents,
          ago: timeAgo(r.at),
        }))}
        // Distinct from an empty list: the query failed, so say so rather
        // than implying the board has been quiet.
        activityUnavailable={recent === null}
        paid={
          confirmation && {
            name: confirmation.name,
            totalCents: confirmation.totalCents,
            // `rankOf`, not `rankFor`: the listing is already on the board by
            // now, and asking what rank its bid *would* take counts it as its
            // own competitor — which reported everyone one place too low.
            // Null when the webhook hasn't landed yet; the screen says so.
            rank: confirmation.listing ? rankOf(rows, confirmation.listing.id) : null,
          }
        }
        cancelled={bid === "cancelled"}
      />
      <SiteFooter />
    </div>
  );
}
