import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    key: "rules",
    canonical: "/rules",
    defaultTitle: "Rules of the Board",
    defaultDescription:
      "Ten rules for listing a market on the board: real in-person events, one listing each, payments are final.",
  });
}

const LAST_UPDATED = "12 August 2026";

const RULES: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Real, in-person markets only",
    body: "The listing has to point at an actual event vendors can physically attend — a market, fair, festival, flea, bazaar or pop-up with a date and an address. No online-only marketplaces, no dropship storefronts, no directories of other events.",
  },
  {
    n: "02",
    title: "One listing per market",
    body: "One spot per event. Running your market under three fake names to squat the whole top 5 gets all three pulled, refunded once, and then you're out.",
  },
  {
    n: "03",
    title: "The link goes where you say it goes",
    body: "Your link must land on that market's own page or vendor application. No redirect chains, no affiliate wrappers, no pop-up on arrival, no page that asks for a vendor's payment details before it says what the event is.",
  },
  {
    n: "04",
    title: "Payments are final",
    body: "Money's spent the second the payment clears. Somebody pays more an hour later and moves above you? That's not a bug, that's the entire premise. You keep whatever rank your money still holds.",
  },
  {
    n: "05",
    title: "Being passed never deletes you",
    body: "You lose the position, never the listing. A $5 listing from launch day is still sitting on this board somewhere.",
  },
  {
    n: "06",
    title: "Moving up costs the difference",
    body: "Pay again under the same market name and you pay the gap between your old and new amount, not the full price twice.",
  },
  {
    n: "07",
    title: "Cancelled events come down",
    body: "If your market is cancelled or postponed, email us and we'll pull or update the listing. Leaving a dead event on the board while vendors apply and pay booth fees is the one thing that gets a permanent ban.",
  },
  {
    n: "08",
    title: "No MLM, no vendor-recruitment schemes",
    body: "Events that exist to sell booths to downline recruits, or that charge vendors for training, leads or territory, aren't markets. Removed without refund.",
  },
  {
    n: "09",
    title: "Nothing that puts vendors at risk",
    body: "No events requiring vendors to pay in cryptocurrency or gift cards, no unpermitted street setups sold as sanctioned markets, no adult or weapons events in general-audience listings.",
  },
  {
    n: "10",
    title: "We can refuse anything",
    body: "Rare, but the call exists. If we pull your listing for a reason not on this list, you get your money back.",
  },
];

export default function Rules() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />

      <div className="container-prose px-6 pt-[72px]">
        <div className="mb-[18px] font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">
          Rules
        </div>
        <h1 className="mb-3.5 text-balance text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[46px]">
          Ten rules. Enforced by one guy.
        </h1>
        <p className="mb-11 font-mono text-[15px] leading-[1.6] text-muted">
          Last updated {LAST_UPDATED}
        </p>

        <div className="flex flex-col gap-px border-y border-line bg-line">
          {RULES.map((rule) => (
            <div
              key={rule.n}
              className="grid grid-cols-[46px_minmax(0,1fr)] items-start gap-4 bg-paper py-6 sm:grid-cols-[62px_minmax(0,1fr)]"
            >
              <div className="pt-0.5 font-mono text-[15px] font-bold text-accent">{rule.n}</div>
              <div>
                <div className="mb-[7px] text-[18px] font-bold tracking-[-0.015em]">
                  {rule.title}
                </div>
                <p className="text-pretty text-[15px] leading-[1.6] text-body">{rule.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-11 border border-line-strong bg-panel px-6 py-[22px]">
          <p className="text-pretty text-[14.5px] leading-[1.6] text-muted">
            Anything not covered here gets decided by one person reading your email. If a call
            goes against you and you think it was wrong, say so and it gets looked at again.{" "}
            <a href="mailto:hello@vendoreventsnearme.com" className="text-accent-deep underline">
              hello@vendoreventsnearme.com
            </a>
          </p>
        </div>
      </div>

      <SiteFooter tagline="Break one and you hear from us, not a bot." />
    </div>
  );
}
