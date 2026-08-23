"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {
  FEATURED_COUNT,
  MIN_BID_CENTS,
  PREVIEW_COUNT,
  US_STATES,
  type BoardRow,
  displayUrl,
  formatEventDate,
  formatUsd,
  processingFeeCents,
  rankFor,
} from "@/lib/board";
import { startCheckout, type BidFormState } from "./bid-actions";

const FIELD_LABEL = "mb-1.5 block text-[12.5px] font-bold text-muted";
const INPUT =
  "w-full rounded-xl border-[1.5px] border-line bg-lav-tint px-[13px] py-3 text-[14.5px] text-ink outline-none focus:border-accent";
const PILL_BUTTON =
  "w-full rounded-full bg-accent px-4 py-[15px] font-sans text-[15.5px] font-bold text-white transition-colors hover:bg-accent-strong disabled:opacity-60";
const CHIP = "rounded-full bg-chip px-[11px] py-[5px] text-[12.5px] font-semibold text-muted";

const CATEGORIES = [
  "Craft", "Farmers", "Flea", "Vintage", "Holiday",
  "Night market", "Art", "Music", "Pop-up", "Festival",
];

// Answers drawn from the rules and the About page — no claim here that isn't
// already made somewhere else on the site.
const FAQS: { q: string; a: string }[] = [
  {
    q: "Who sees my listing?",
    a: "Vendors looking for markets to sell at. They find this board through search, our weekly vendor email and our social accounts. Top 10 goes into the email and the socials; top 3 also takes the homepage banner.",
  },
  {
    q: "What happens when someone pays more than me?",
    a: "You drop one position. That's it — your listing, your link and your blurb stay exactly where they were, one row lower. Pay again any time to climb back, and you only pay the difference between your old amount and the new one.",
  },
  {
    q: "What does a spot near the top actually get me?",
    a: "Top 10 goes into the weekly vendor email and gets posted to our Facebook and Instagram. Top 3 also takes the banner on the homepage. Below that you get the board itself, which is what vendors searching for markets land on.",
  },
  {
    q: "Do you take a cut of my booth fees?",
    a: "Zero percent. Vendors click straight through to your own application form and we never see what happens next. We also never email your applicants.",
  },
  {
    q: "Where do the listings come from?",
    a: "Organizers, one at a time. Nothing here is scraped from other sites or event pages — a lot of scraped listings turn out to be fake or long cancelled, and charging for a spot is what keeps those off the board.",
  },
  {
    q: "Can I get a refund if it doesn't work?",
    a: "Payments are final once they clear. The exception is us pulling your listing for a reason that isn't in the rules, in which case you get your money back.",
  },
];

export type PaidConfirmation = {
  name: string;
  totalCents: number;
  rank: number | null;
};

export type Activity = { id: string; name: string; bidCents: number; ago: string };

export function Leaderboard({
  rows,
  activity,
  paid,
  cancelled,
}: {
  rows: BoardRow[];
  activity: Activity[];
  paid: PaidConfirmation | null;
  cancelled: boolean;
}) {
  const [view, setView] = useState<"board" | "checkout">("board");
  const [showAll, setShowAll] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stateFilter, setStateFilter] = useState("All");
  const [heroError, setHeroError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  // null means "nothing typed yet" — the field then opens a dollar over the
  // top listing rather than at a hardcoded number.
  const [priceInput, setPriceInput] = useState<number | null>(null);

  const [state, formAction, pending] = useActionState<BidFormState, FormData>(
    startCheckout,
    { error: null },
  );

  const topCents = rows.length > 0 ? rows[0].bidCents : 0;
  const priceCents = priceInput ?? (rows.length > 0 ? topCents + 100 : MIN_BID_CENTS);

  const wouldBeRank = rankFor(rows, priceCents);
  const feeCents = processingFeeCents(priceCents);
  // Filter pills are built from the states actually on the board, commonest
  // first — a hardcoded list would offer filters that return nothing.
  const statesOnBoard = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of rows) {
      if (row.location) counts.set(row.location, (counts.get(row.location) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([state]) => state);
  }, [rows]);

  const filtered = stateFilter === "All" ? rows : rows.filter((r) => r.location === stateFilter);
  const visible = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT);
  const featured = visible.slice(0, FEATURED_COUNT);
  const rest = visible.slice(FEATURED_COUNT);
  const potCents = rows.reduce((sum, row) => sum + row.bidCents, 0);

  // "Pass them for $X" loads the amount that clears a row into the form, then
  // brings the form back into view — the rows people click sit below it.
  function passThem(row: BoardRow) {
    setPriceInput(row.bidCents + 100);
    document
      .getElementById("list-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (paid) {
    return (
      <div className="mx-auto w-full max-w-[680px] px-6 pt-[60px]">
        <div className="rounded-[26px] bg-mint px-6 py-[52px] text-center sm:px-11">
          <div className="eyebrow mb-5 inline-block rounded-full bg-paid px-[15px] py-[7px] text-white">
            Paid
          </div>
          <h1 className="mb-4 text-balance text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[40px]">
            {paid.rank
              ? `You're at #${paid.rank}. Go tell your vendors.`
              : "Payment received. Your listing is going up."}
          </h1>
          <p className="mx-auto mb-7 max-w-[46ch] text-pretty text-[16.5px] leading-[1.6] text-body">
            {paid.name} is live on the board for {formatUsd(paid.totalCents)}. Receipt is on
            its way. If you landed in the top 10 you&rsquo;ll go out in this week&rsquo;s
            vendor email and on our socials.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-accent px-7 py-[15px] font-sans text-[15.5px] font-bold text-white transition-colors hover:bg-accent-strong"
          >
            See your spot
          </Link>
        </div>
      </div>
    );
  }

  if (view === "checkout") {
    return (
      <form action={formAction} className="mx-auto w-full max-w-[940px] px-6 pt-10">
        {/* What the form collected, carried to the server as-is. The server
            re-prices from these; it never trusts the total below. */}
        <input type="hidden" name="bid" value={String(priceCents / 100)} />

        <button
          type="button"
          onClick={() => setView("board")}
          className="rounded-full bg-lav-chip px-4 py-[9px] text-[13.5px] font-bold text-accent-ink"
        >
          ← Back to the board
        </button>
        <h1 className="mb-9 mt-6 text-balance text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[40px]">
          {priceCents > topCents
            ? "One charge and the top spot is yours."
            : `Your spot: #${wouldBeRank}.`}
        </h1>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <div className="mb-7 flex flex-col gap-[14px] rounded-[20px] border-[1.5px] border-line px-6 py-[22px]">
              <div className="flex justify-between gap-4">
                <span className="text-sm font-semibold text-muted">Market</span>
                <span className="text-right text-[14.5px] font-bold">
                  {name.trim() || "Your market"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm font-semibold text-muted">State</span>
                <span className="text-right text-[14.5px] font-bold">
                  {location || "Not set"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm font-semibold text-muted">Application link</span>
                <span className="break-all text-right text-sm font-semibold">
                  {displayUrl(url.trim()) || "yourmarket.com/apply"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t-[1.5px] border-line-soft pt-[14px]">
                <span className="text-sm font-semibold text-muted">Position this puts you at</span>
                <span className="rounded-full bg-accent px-[13px] py-1.5 text-[13.5px] font-bold text-white">
                  #{wouldBeRank}
                </span>
              </div>
            </div>

            <div className="eyebrow mb-3.5 text-faint">Where vendors apply</div>
            <div className="mb-7">
              <label className="block">
                <span className={FIELD_LABEL}>Vendor application link</span>
                <input
                  name="applyUrl"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="yourmarket.com/apply"
                  className={INPUT}
                />
              </label>
              <div className="mt-[7px] text-[12.5px] text-muted">
                Vendors click straight through to your own form. We never email your
                applicants.
              </div>
            </div>

            <div className="eyebrow mb-3.5 text-faint">How it shows on the board</div>
            <div className="flex flex-col gap-[14px]">
              <label className="block">
                <span className={FIELD_LABEL}>Market name</span>
                <input
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Riverbend Makers Market"
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={FIELD_LABEL}>Email for the receipt</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@yourmarket.com"
                  className={INPUT}
                />
                <span className="mt-1.5 block text-xs leading-[1.5] text-muted">
                  This is what owns the listing. Pay again with the same market name and email
                  to move up, and you&rsquo;ll only be charged the difference.
                </span>
              </label>
              <label className="block">
                <span className={FIELD_LABEL}>State</span>
                <select
                  name="location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={INPUT}
                >
                  <option value="" disabled>
                    Pick a state
                  </option>
                  {US_STATES.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={FIELD_LABEL}>Event date</span>
                <input type="date" name="eventDate" required className={INPUT} />
                <span className="mt-1.5 block text-xs leading-[1.5] text-muted">
                  Your listing runs until this day, then comes off the board. A recurring
                  market lists its next date — each time it runs is its own listing.
                </span>
              </label>
              <label className="block">
                <span className={FIELD_LABEL}>Type of market</span>
                <select name="category" className={INPUT} defaultValue="Craft">
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={FIELD_LABEL}>What vendors should know</span>
                <textarea
                  name="blurb"
                  required
                  rows={3}
                  maxLength={400}
                  placeholder="Ninth year on the French Broad. 120 booths, juried handmade only."
                  className={`${INPUT} resize-y`}
                />
              </label>
            </div>
          </div>

          <div className="rounded-[20px] bg-lav p-[26px]">
            <div className="mb-5 text-[19px] font-extrabold tracking-[-0.02em]">Order</div>
            <div className="flex flex-col gap-3 border-b-[1.5px] border-line-soft pb-4">
              <div className="flex justify-between gap-3">
                <span className="text-[14.5px] font-semibold">
                  Listing for {name.trim() || "your market"}
                </span>
                <span className="font-mono text-[14.5px] font-bold">
                  {formatUsd(priceCents)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-sm text-muted">Processing</span>
                <span className="font-mono text-sm text-muted">{formatUsd(feeCents)}</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-3 pb-1 pt-[18px]">
              <span className="text-[15px] font-bold">Charged today</span>
              <span className="font-mono text-[28px] font-bold tracking-[-0.03em]">
                {formatUsd(priceCents + feeCents)}
              </span>
            </div>
            <div className="mb-5 text-[12.5px] leading-[1.5] text-muted">
              One charge. No subscription, no renewal. Moving an existing listing up costs
              only the difference, so the total may come out lower on Stripe.
            </div>

            {state.error && (
              <p className="mb-4 rounded-xl bg-white px-3.5 py-2.5 text-[13px] leading-[1.5] font-semibold text-accent-ink">
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending} className={PILL_BUTTON}>
              {pending ? "Taking you to Stripe…" : "Continue to payment"}
            </button>
            <div className="mt-3.5 text-[12.5px] leading-[1.55] text-muted">
              Card details are handled by Stripe, not us. Payments are final: somebody paying
              more later moves your rank down but never removes your listing. See the{" "}
              <Link href="/rules" className="font-semibold text-accent-deep">
                rules
              </Link>
              .
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="container-site px-6">
      {/* Hero — link, state and amount is everything needed to get going */}
      <div id="list-form" className="mx-auto max-w-[900px] pb-2 pt-[34px] text-center md:pt-[60px]">
        <div className="mb-[22px] inline-flex items-center gap-2 rounded-full bg-chip px-[18px] py-[9px] text-sm text-muted md:mb-[34px]">
          <span className="h-2 w-2 shrink-0 rounded-full bg-live" />
          <span className="font-bold text-live">
            {rows.length > 0
              ? `${rows.length} ${rows.length === 1 ? "market" : "markets"} on the board`
              : "Nothing on the board yet"}
          </span>
        </div>

        <h1 className="mb-3.5 text-balance text-[29px] font-extrabold leading-[1.08] tracking-[-0.035em] md:mb-[18px] md:text-[44px]">
          List Your Vendor Event. Pay What It&rsquo;s Worth to You.
        </h1>
        <p className="mx-auto mb-6 max-w-[60ch] text-pretty text-[15px] leading-[1.55] text-body md:mb-[30px] md:text-[18px]">
          Reach more vendors and grow your event. Markets that pay more show up higher on the
          leaderboard and get seen by more vendors.
        </p>
        <p className="mx-auto mb-6 max-w-[60ch] text-[13.5px] leading-[1.55] text-muted md:text-[15.5px]">
          <span className="font-semibold text-accent-deep">
            New spots start at {formatUsd(MIN_BID_CENTS)}.
          </span>{" "}
          Paying less than the #1 price still puts you on the board at whatever place that
          amount can take.
        </p>

        {cancelled && (
          <p className="mx-auto mb-4 max-w-[620px] rounded-2xl bg-lav px-4 py-3 text-[13.5px] text-muted">
            Checkout cancelled — nothing was charged.
          </p>
        )}

        <div className="mb-3 flex flex-wrap items-stretch gap-2 md:flex-nowrap">
          <div className="flex min-w-0 flex-[1_1_100%] items-center gap-[9px] rounded-full border-[1.5px] border-line-input bg-white px-[18px] md:flex-[1_1_auto]">
            <span className="shrink-0 text-[17px] text-faint" aria-hidden="true">
              ◍
            </span>
            <input
              aria-label="Your event link or application URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Your event link or application URL"
              className="min-w-0 flex-1 bg-transparent py-[17px] text-base text-ink outline-none"
            />
          </div>
          <select
            aria-label="State the market happens in"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="min-w-0 flex-[1_1_100%] cursor-pointer rounded-full border-[1.5px] border-line-input bg-white px-3.5 py-[17px] text-[15px] text-ink outline-none md:flex-[0_1_180px]"
          >
            <option value="">Choose a state</option>
            {US_STATES.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>
          <div className="flex flex-[1_1_100%] items-center justify-center gap-[7px] rounded-full border-[1.5px] border-line-input bg-white pl-[13px] pr-2 md:flex-none">
            <span className="whitespace-nowrap text-xs font-bold text-faint">You pay</span>
            <button
              aria-label="Lower the price by a dollar"
              onClick={() => setPriceInput(Math.max(MIN_BID_CENTS, priceCents - 100))}
              className="h-[26px] w-[26px] shrink-0 rounded-full bg-lav-chip text-base font-bold leading-none text-accent-ink hover:bg-accent/25"
            >
              −
            </button>
            <span className="inline-flex items-center text-xl font-extrabold tracking-[-0.02em] text-accent-deep">
              <span>$</span>
              <input
                aria-label="What you'll pay"
                inputMode="numeric"
                value={String(Math.round(priceCents / 100))}
                onChange={(e) =>
                  setPriceInput(
                    Math.max(
                      MIN_BID_CENTS,
                      (parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0) * 100,
                    ),
                  )
                }
                style={{ width: `${Math.max(2, String(Math.round(priceCents / 100)).length)}ch` }}
                className="bg-transparent py-[15px] text-xl font-extrabold tracking-[-0.02em] text-accent-deep outline-none"
              />
            </span>
            <button
              aria-label="Raise the price by a dollar"
              onClick={() => setPriceInput(priceCents + 100)}
              className="h-[26px] w-[26px] shrink-0 rounded-full bg-lav-chip text-base font-bold leading-none text-accent-ink hover:bg-accent/25"
            >
              +
            </button>
          </div>
          <button
            onClick={() => {
              if (!url.trim()) return setHeroError("Add the link vendors should apply through.");
              if (!location) return setHeroError("Pick the state the market happens in.");
              setHeroError(null);
              setView("checkout");
            }}
            className="flex-[1_1_100%] whitespace-nowrap rounded-full bg-accent px-[26px] py-[17px] font-sans text-[15.5px] font-bold text-white transition-colors hover:bg-accent-strong md:flex-none"
          >
            List it
          </button>
        </div>
        {heroError && (
          <p className="mb-2 text-[14.5px] font-semibold text-accent-deep">{heroError}</p>
        )}
        <div className="text-[14.5px] text-muted">
          Already on the board? Enter the same link and raise your amount.{" "}
          {rows.length === 0
            ? "Nothing on the board yet — this puts you at #1."
            : priceCents > topCents
              ? "That puts you at #1."
              : `That puts you at #${wouldBeRank} — ${formatUsd(topCents + 100)} takes the top spot.`}
        </div>
      </div>

      {/* State filters */}
      {statesOnBoard.length > 1 && (
        <div className="flex flex-wrap items-center gap-[7px] pb-1 pt-10">
          {["All", ...statesOnBoard.slice(0, 5)].map((state) => (
            <button
              key={state}
              onClick={() => setStateFilter(state)}
              className={`shrink-0 whitespace-nowrap rounded-full px-[15px] py-[9px] text-[13.5px] font-bold transition-colors ${
                stateFilter === state
                  ? "bg-accent text-white"
                  : "bg-chip text-muted hover:bg-lav-chip"
              }`}
            >
              {state}
            </button>
          ))}
          {statesOnBoard.length > 5 && (
            <select
              aria-label="Filter the board by state"
              value={statesOnBoard.slice(0, 5).includes(stateFilter) ? "" : stateFilter}
              onChange={(e) => setStateFilter(e.target.value || "All")}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-[9px] text-[13.5px] font-bold outline-none ${
                statesOnBoard.slice(0, 5).includes(stateFilter) || stateFilter === "All"
                  ? "bg-chip text-muted"
                  : "bg-accent text-white"
              }`}
            >
              <option value="">All states ▾</option>
              {statesOnBoard.slice(5).map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* The board */}
      <div
        id="board"
        className="flex flex-wrap items-center justify-between gap-4 pb-3.5 pt-[30px]"
      >
        <h2 className="sr-only">The board</h2>
        <p className="text-[14.5px] text-muted">
          Sorted by what organizers pay.
          {filtered.length > 0 &&
            ` Showing ${showAll ? filtered.length : Math.min(PREVIEW_COUNT, filtered.length)} of ${filtered.length}.`}
        </p>
        {potCents > 0 && (
          <div className="rounded-full bg-lav-chip px-3.5 py-2 text-[12.5px] font-bold">
            {formatUsd(potCents)} paid to date
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-[20px] border-[1.5px] border-line px-6 py-16 text-center">
          <p className="mb-2 text-[20px] font-extrabold tracking-[-0.02em]">
            No markets on the board yet.
          </p>
          <p className="text-[14.5px] leading-[1.5] text-body">
            The first listing takes #1 and holds it until somebody pays more.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {featured.map((row, i) => {
            const rank = i + 1;
            // The top of the board is tinted, strongest at #1 and gone by #6.
            // Position is the product, so it should read at a glance.
            const tint = [0.075, 0.055, 0.04, 0.026, 0.014][rank - 1];
            const hashColor =
              rank <= 3
                ? "oklch(0.58 0.2 280)"
                : rank <= 5
                  ? "oklch(0.62 0.15 280)"
                  : "rgba(30,24,20,0.45)";
            const meta = [row.location, row.eventDate && formatEventDate(row.eventDate)].filter(
              Boolean,
            ) as string[];
            return (
              <a
                key={row.id}
                href={row.applyUrl}
                target="_blank"
                rel="nofollow noopener external"
                style={{
                  background: tint ? `oklch(0.62 0.19 280 / ${tint})` : undefined,
                  borderColor:
                    rank === 1
                      ? "oklch(0.62 0.19 280 / 0.5)"
                      : tint
                        ? "oklch(0.62 0.19 280 / 0.2)"
                        : undefined,
                }}
                // The whole card is the link now, so it holds no button — a
                // button inside an anchor is invalid and swallows the click.
                className="block rounded-[18px] border-[1.5px] border-line p-4 transition-colors hover:!border-accent sm:grid sm:grid-cols-[56px_minmax(0,1fr)_minmax(0,178px)] sm:items-center sm:gap-[22px] sm:rounded-[20px] sm:px-6 sm:py-[22px]"
              >
                <div
                  style={{ color: hashColor }}
                  className="hidden text-[22px] font-extrabold tracking-[-0.03em] sm:block"
                >
                  #{rank}
                </div>

                <div className="min-w-0">
                  <div className="mb-2.5 flex items-center gap-2.5 sm:mb-[7px] sm:block">
                    <span
                      style={{ color: hashColor }}
                      className="shrink-0 text-[17px] font-extrabold tracking-[-0.03em] sm:hidden"
                    >
                      #{rank}
                    </span>
                    <span className="min-w-0 flex-1 text-[17.5px] font-extrabold leading-[1.15] tracking-[-0.025em] sm:text-[20px]">
                      {row.name}
                    </span>
                  </div>

                  {meta.length > 0 && (
                    <div className="mb-2.5 text-[12.5px] font-semibold text-muted sm:hidden">
                      {meta.join(" · ")}
                    </div>
                  )}

                  <p className="mb-2.5 line-clamp-3 max-w-[60ch] text-pretty text-[13.5px] leading-[1.45] text-body sm:mb-2.5 sm:line-clamp-2 sm:text-[14.5px] sm:leading-[1.5]">
                    {row.blurb}
                  </p>

                  {meta.length > 0 && (
                    <div className="hidden flex-wrap gap-[7px] sm:flex">
                      {meta.map((item) => (
                        <span key={item} className={CHIP}>
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-2.5 border-t-[1.5px] border-line-soft pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                  <div className="font-mono text-[21px] font-bold leading-none tracking-[-0.03em] sm:text-2xl">
                    {formatUsd(row.bidCents)}
                  </div>
                  <div className="text-[11.5px] font-semibold text-faint sm:mt-1">paid</div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-6 sm:mt-[30px]">
          <div className="eyebrow pb-1.5 text-faint sm:pb-2.5">The rest of the board</div>
          <div className="flex flex-col">
            {rest.map((row, i) => {
              const rank = FEATURED_COUNT + i + 1;
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5 border-t-[1.5px] border-line-soft py-3.5 sm:grid-cols-[48px_minmax(0,1fr)_auto_auto] sm:gap-[18px] sm:px-2 sm:py-4 sm:hover:bg-lav-tint"
                >
                  <div className="font-mono text-[13.5px] font-bold text-faint sm:text-[15px]">
                    #{rank}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2.5">
                      <span className="truncate text-[15.5px] font-bold tracking-[-0.02em] sm:whitespace-nowrap sm:text-[16.5px]">
                        {row.name}
                      </span>
                      {row.blurb && (
                        <span className="hidden truncate text-[13.5px] text-muted sm:inline">
                          {row.blurb}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-[12.5px] font-semibold text-faint">
                      {[
                        row.category,
                        row.location,
                        row.eventDate && formatEventDate(row.eventDate),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[15.5px] font-bold leading-tight tracking-[-0.02em] sm:text-[17px]">
                      {formatUsd(row.bidCents)}
                    </div>
                    <button
                      onClick={() => passThem(row)}
                      className="pt-0.5 text-xs font-bold text-accent-deep sm:hidden"
                    >
                      Pass →
                    </button>
                  </div>
                  <button
                    onClick={() => passThem(row)}
                    className="hidden shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[12.5px] font-bold text-accent-deep hover:bg-lav-chip sm:block"
                  >
                    Pass for {formatUsd(row.bidCents + 100)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {rows.length > PREVIEW_COUNT && (
        <div className="flex justify-center pt-[26px]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="rounded-full border-[1.5px] border-line px-6 py-[13px] text-[14.5px] font-bold text-ink transition-colors hover:bg-lav-chip"
          >
            {showAll ? `Show top ${PREVIEW_COUNT} only` : `Show all ${rows.length} markets`}
          </button>
        </div>
      )}

      {activity.length > 0 && (
        <div className="mt-11 rounded-[20px] bg-lav-tint px-6 py-[26px]">
          <div className="eyebrow mb-3.5 text-faint">Latest activity</div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-x-8">
            {activity.map((a) => (
              <div key={a.id} className="flex items-baseline gap-3">
                <span className="flex-1 text-[14.5px] font-bold">{a.name}</span>
                <span className="font-mono text-[13px]">{formatUsd(a.bidCents)}</span>
                <span className="text-[13px] text-faint">{a.ago}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div id="how-it-works" className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            step: "Step one",
            bg: "bg-sun",
            title: "Pay for a spot",
            body: "Market name, application link, a number. Pay more than the market above you and that spot is yours. Takes about nine seconds.",
          },
          {
            step: "Step two",
            bg: "bg-mint",
            title: "Get shared everywhere",
            body: "Top 10 goes out to our Facebook, Instagram and the weekly vendor email. Top 3 takes over the homepage.",
          },
          {
            step: "Step three",
            bg: "bg-peach",
            title: "Fill your booths",
            body: "Vendors go straight to your own form. We take zero percent of your booth fees and never email your applicants.",
          },
        ].map((card) => (
          <div key={card.step} className={`rounded-[20px] ${card.bg} px-6 py-[26px]`}>
            <div className="eyebrow mb-2.5 text-faint">{card.step}</div>
            <div className="mb-2 text-[20px] font-extrabold tracking-[-0.02em]">
              {card.title}
            </div>
            <p className="text-pretty text-[14.5px] leading-[1.55] text-body">{card.body}</p>
          </div>
        ))}
      </div>

      {/* Why list */}
      <div className="mt-[60px] grid grid-cols-1 items-center gap-11 rounded-[26px] bg-mint px-6 py-11 sm:px-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div>
          <div className="eyebrow mb-4 text-faint">Why list here</div>
          <p className="mb-[22px] text-pretty text-[23px] font-semibold leading-[1.4] tracking-[-0.015em]">
            People type &ldquo;vendor events near me&rdquo; into Google roughly 3,800 times a
            month in the US. This is the page they land on.
          </p>
          <Link
            href="/why-list-your-market"
            className="inline-block rounded-full bg-white px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-white/60"
          >
            See all six reasons
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-white px-5 py-[18px]">
            <div className="font-mono text-[27px] font-bold tracking-[-0.03em]">
              {formatUsd(MIN_BID_CENTS)}
            </div>
            <div className="text-[13.5px] font-semibold text-muted">
              cheapest way onto the board
            </div>
          </div>
          <div className="rounded-2xl bg-white px-5 py-[18px]">
            <div className="font-mono text-[27px] font-bold tracking-[-0.03em]">0%</div>
            <div className="text-[13.5px] font-semibold text-muted">
              of your booth fees, forever
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-[780px] pt-16">
        <h2 className="mb-2 text-center text-[34px] font-extrabold tracking-[-0.03em]">
          Questions, answered
        </h2>
        <p className="mb-[30px] text-center text-[15.5px] text-muted">
          Still deciding? Here&rsquo;s what organizers ask most.
        </p>
        <div className="flex flex-col gap-2.5">
          {FAQS.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={faq.q} className="overflow-hidden rounded-2xl border-[1.5px] border-line">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className={`flex w-full items-center justify-between gap-4 px-[22px] py-[19px] text-left text-[16.5px] font-bold tracking-[-0.015em] text-ink hover:bg-lav-chip ${
                    open ? "bg-lav" : "bg-white"
                  }`}
                >
                  {faq.q}
                  <span className="shrink-0 text-xl font-bold text-accent-deep">
                    {open ? "–" : "+"}
                  </span>
                </button>
                {open && (
                  <p className="max-w-[68ch] px-[22px] pb-5 text-pretty text-[15px] leading-[1.6] text-body">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing CTA */}
      <div className="mt-[60px] rounded-[26px] bg-lav px-6 py-12 text-center sm:px-12">
        <h2 className="mb-3 text-balance text-[28px] font-extrabold tracking-[-0.03em] sm:text-[34px]">
          Somebody&rsquo;s about to pass you.
        </h2>
        <p className="mx-auto mb-6 max-w-[52ch] text-pretty text-[16.5px] text-body">
          The board starts at {formatUsd(MIN_BID_CENTS)} and your listing stays up for good.
          Put your market where vendors are already looking.
        </p>
        <a
          href="#list-form"
          className="inline-block rounded-full bg-accent px-7 py-[15px] text-[15.5px] font-bold text-white transition-colors hover:bg-accent-strong"
        >
          List your market
        </a>
      </div>
    </div>
  );
}
