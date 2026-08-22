import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import { formatUsd, rankFor } from "@/lib/board";
import { getBoard, getPaidConfirmation, getRecentBids } from "@/lib/listings";
import { Leaderboard } from "./Leaderboard";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await pageMetadata({
    key: "home",
    canonical: "/",
    defaultTitle: "Vendor Events Leaderboard — Buy Your Way to #1",
    defaultDescription:
      "A pay-to-win board for markets, fairs and festivals. Highest bid sits at #1, every bid is public, and vendors go straight to your application.",
  });
  return {
    ...metadata,
    verification: {
      google: "BlxmLAALVyzFwyxHJSzzgH6VzWgtJD5Iw21dp65WCJY",
    },
  };
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
    getRecentBids(),
    paidSession ? getPaidConfirmation(paidSession) : null,
  ]);

  const pot = rows.reduce((sum, row) => sum + row.bidCents, 0);

  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />
      <Leaderboard
        rows={rows}
        activity={recent.map((r) => ({
          id: r.id,
          name: r.name,
          bidCents: r.bidCents,
          ago: timeAgo(r.at),
        }))}
        paid={
          confirmation && {
            name: confirmation.name,
            totalCents: confirmation.totalCents,
            // The webhook may not have landed yet, in which case there's no
            // listing to rank and the confirmation says so instead.
            rank: confirmation.listing
              ? rankFor(rows, confirmation.listing.bidCents)
              : null,
          }
        }
        cancelled={bid === "cancelled"}
      />
      <SiteFooter
        tagline={
          pot > 0 ? (
            <>
              Organizers have spent{" "}
              <span className="font-bold text-ink">{formatUsd(pot)}</span> on this
              board so far
            </>
          ) : undefined
        }
      />
    </div>
  );
}
