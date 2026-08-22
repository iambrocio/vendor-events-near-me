import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import { BOARD, formatUsd } from "@/lib/board";
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

export default function Home() {
  const pot = BOARD.reduce((sum, row) => sum + row.bid, 0);

  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />
      <Leaderboard />
      <SiteFooter
        // The running pot is the footer's line once there's a pot to report.
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
