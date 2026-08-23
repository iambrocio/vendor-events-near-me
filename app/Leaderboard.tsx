"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  type BoardRow,
  MIN_BID_CENTS,
  PREVIEW_COUNT,
  displayUrl,
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
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
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
  const visible = showAll ? rows : rows.slice(0, PREVIEW_COUNT);
  const potCents = rows.reduce((sum, row) => sum + row.bidCents, 0);

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
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="applyUrl" value={url} />
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
                <span className="text-sm font-semibold text-muted">Vendor application link</span>
                <span className="break-all text-right text-sm font-semibold">
                  {displayUrl(url.trim()) || "yourmarket.com/apply"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t-[1.5px] border-line-soft pt-[14px]">
                <span className="text-sm font-semibold text-muted">Position this takes</span>
                <span className="rounded-full bg-accent px-[13px] py-1.5 text-[13.5px] font-bold text-white">
                  #{wouldBeRank}
                </span>
              </div>
            </div>

            <div className="eyebrow mb-3.5 text-faint">How it shows on the board</div>
            <div className="flex flex-col gap-[14px]">
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
                <span className={FIELD_LABEL}>Where it happens</span>
                <input
                  name="location"
                  required
                  maxLength={80}
                  placeholder="Asheville, NC"
                  className={INPUT}
                />
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
      {/* Hero + the form it's selling */}
      <div className="mt-2 rounded-[26px] bg-lav px-6 py-[54px] sm:px-12">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <div className="mb-5 inline-flex items-center gap-[7px] rounded-full bg-white px-3.5 py-[7px] text-[12.5px] font-bold text-accent-ink">
              <span className="h-[7px] w-[7px] rounded-full bg-live" />
              {rows.length > 0
                ? `${rows.length} ${rows.length === 1 ? "market" : "markets"} on the board`
                : "Nothing on the board yet"}
            </div>
            <h1 className="mb-[18px] text-balance text-[38px] font-extrabold leading-[1.0] tracking-[-0.035em] sm:text-[56px]">
              List Your Vendor Event. Pay What It&rsquo;s Worth to You.
            </h1>
            <p className="mb-[26px] max-w-[48ch] text-pretty text-[17.5px] leading-[1.55] text-body">
              Reach more vendors and grow your event. List your market in under 5 minutes and
              pay whatever price you think it&rsquo;s worth. Markets that pay more show up
              higher on the leaderboard and get seen by more vendors.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="#how-it-works"
                className="rounded-full bg-white px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-white/60"
              >
                How it works
              </a>
              <Link
                href="/why-list-your-market"
                className="rounded-full border-[1.5px] border-line px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-white"
              >
                Why list your market
              </Link>
            </div>
          </div>

          <div id="list-form" className="rounded-[20px] bg-white p-[26px]">
            <div className="mb-5 flex items-baseline justify-between gap-3">
              <div className="text-[19px] font-extrabold tracking-[-0.02em]">
                List your market
              </div>
              <div className="rounded-full bg-lav-chip px-[11px] py-[5px] text-[12.5px] font-bold text-accent-ink">
                from {formatUsd(MIN_BID_CENTS)}
              </div>
            </div>

            {cancelled && (
              <p className="mb-4 rounded-xl bg-lav px-3.5 py-2.5 text-[13px] leading-[1.5] text-muted">
                Checkout cancelled — nothing was charged.
              </p>
            )}

            <label className={FIELD_LABEL} htmlFor="market-name">
              Market name
            </label>
            <input
              id="market-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Riverbend Makers Market"
              className={`${INPUT} mb-3.5`}
            />

            <label className={FIELD_LABEL} htmlFor="market-url">
              Vendor application link
            </label>
            <input
              id="market-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourmarket.com/apply"
              className={`${INPUT} mb-3.5`}
            />

            <label className={FIELD_LABEL} htmlFor="market-price">
              What you&rsquo;ll pay
            </label>
            <div className="mb-2.5 flex items-stretch overflow-hidden rounded-xl border-[1.5px] border-line bg-lav-tint">
              <span className="flex items-center pl-3.5 pr-0.5 font-mono text-[22px] text-faint">
                $
              </span>
              <input
                id="market-price"
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
                className="min-w-0 flex-1 border-none bg-transparent px-1.5 py-3 font-mono text-[22px] font-bold text-ink outline-none"
              />
              <button
                aria-label="Lower the price by a dollar"
                onClick={() => setPriceInput(Math.max(MIN_BID_CENTS, priceCents - 100))}
                className="w-10 shrink-0 text-xl text-muted hover:bg-lav-chip hover:text-ink"
              >
                −
              </button>
              <button
                aria-label="Raise the price by a dollar"
                onClick={() => setPriceInput(priceCents + 100)}
                className="w-10 shrink-0 text-xl text-muted hover:bg-lav-chip hover:text-ink"
              >
                +
              </button>
            </div>
            <div className="mb-[18px] text-[12.5px] font-semibold leading-[1.5] text-accent-ink">
              {rows.length === 0
                ? "Nothing on the board yet — this puts you at #1."
                : priceCents > topCents
                  ? "That puts you at #1."
                  : `That sits at #${wouldBeRank}. ${formatUsd(topCents + 100)} would put you at the top.`}
            </div>

            <button onClick={() => setView("checkout")} className={PILL_BUTTON}>
              List my market
            </button>
            <div className="mt-3 text-center text-[12.5px] leading-[1.5] text-muted">
              Already listed? Same name, bigger number. You pay the difference.
            </div>
          </div>
        </div>
      </div>

      {/* The board */}
      <div
        id="board"
        className="flex flex-wrap items-end justify-between gap-5 pb-[22px] pt-14"
      >
        <div>
          <h2 className="mb-2 text-[34px] font-extrabold tracking-[-0.03em]">The board</h2>
          <p className="text-[15.5px] text-muted">
            Sorted by one thing only.
            {rows.length > 0 &&
              ` Showing ${showAll ? rows.length : Math.min(PREVIEW_COUNT, rows.length)} of ${rows.length}.`}
          </p>
        </div>
        {potCents > 0 && (
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full bg-lav-chip px-[15px] py-[9px] text-[13px] font-bold">
              {rows.length} {rows.length === 1 ? "market" : "markets"} listed
            </div>
            <div className="rounded-full bg-lav-chip px-[15px] py-[9px] text-[13px] font-bold">
              {formatUsd(potCents)} paid to date
            </div>
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
          {visible.map((row, i) => {
            const rank = i + 1;
            const isTop = rank <= 3;
            return (
              <div
                key={row.id}
                className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-5 rounded-[20px] border-[1.5px] border-line px-6 py-[22px] transition-colors hover:border-accent sm:grid-cols-[56px_minmax(0,1fr)_minmax(0,140px)]"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-[19px] font-extrabold tracking-[-0.02em] ${
                    isTop ? "bg-accent text-white" : "bg-chip text-muted"
                  }`}
                >
                  {rank}
                </div>
                <div>
                  <div className="mb-[7px] flex flex-wrap items-center gap-[9px]">
                    <span className="text-[20px] font-extrabold tracking-[-0.025em]">
                      {row.name}
                    </span>
                    <span className="rounded-full bg-lav-chip px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.03em] text-accent-ink">
                      {row.category}
                    </span>
                    {isTop && (
                      <span className="rounded-full bg-accent px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.03em] text-white">
                        Front page
                      </span>
                    )}
                  </div>
                  {row.blurb && (
                    <p className="mb-2.5 max-w-[60ch] text-pretty text-[14.5px] leading-[1.5] text-body">
                      {row.blurb}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-[7px]">
                    {row.location && <span className={CHIP}>{row.location}</span>}
                    <a
                      href={row.applyUrl}
                      target="_blank"
                      rel="nofollow noopener external"
                      className="rounded-full bg-lav-chip px-[11px] py-[5px] text-[12.5px] font-bold text-accent-ink hover:bg-accent hover:text-white"
                    >
                      {displayUrl(row.applyUrl)} →
                    </a>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:text-right">
                  <div className="font-mono text-2xl font-bold tracking-[-0.03em]">
                    {formatUsd(row.bidCents)}
                  </div>
                </div>
              </div>
            );
          })}
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
            title: "List your market",
            body: "Market name, application link, where it happens, and what a spot is worth to you. Takes about nine seconds.",
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
          Your booths won&rsquo;t fill themselves.
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
