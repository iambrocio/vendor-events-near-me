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

const LABEL = "font-mono text-[11px] uppercase tracking-[0.14em] text-muted";
const FIELD_LABEL =
  "mb-[7px] block font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted";
const INPUT =
  "w-full border border-line-input bg-paper px-3 py-[11px] text-[14.5px] text-ink outline-none focus:border-accent";
const PRIMARY_BUTTON =
  "w-full bg-accent px-4 py-[14px] font-sans text-[15px] font-bold tracking-[0.01em] text-white transition-colors hover:bg-accent-hover disabled:opacity-60";

const CATEGORIES = [
  "Craft", "Farmers", "Flea", "Vintage", "Holiday",
  "Night market", "Art", "Music", "Pop-up", "Festival",
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
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  // null means "nothing typed yet" — the field then opens a dollar over the
  // top bid rather than at a hardcoded number.
  const [bidInput, setBidInput] = useState<number | null>(null);

  const [state, formAction, pending] = useActionState<BidFormState, FormData>(
    startCheckout,
    { error: null },
  );

  const topBidCents = rows.length > 0 ? rows[0].bidCents : 0;
  const bidCents = bidInput ?? (rows.length > 0 ? topBidCents + 100 : MIN_BID_CENTS);

  const wouldBeRank = rankFor(rows, bidCents);
  const feeCents = processingFeeCents(bidCents);
  const visible = showAll ? rows : rows.slice(0, PREVIEW_COUNT);

  if (paid) {
    return (
      <div className="mx-auto w-full max-w-[620px] px-6 pt-24 text-center">
        <div className="mb-[18px] font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">
          Paid
        </div>
        <h1 className="mb-[18px] text-balance text-[32px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[42px]">
          {paid.rank
            ? `You're at #${paid.rank}. Go tell your vendors.`
            : "Payment received. Your listing is going up."}
        </h1>
        <p className="mb-8 text-pretty text-[16.5px] leading-[1.6] text-body">
          {paid.name} is on the board for {formatUsd(paid.totalCents)}. Receipt is on its
          way. If you landed in the top 10 you&rsquo;ll go out in this week&rsquo;s vendor
          email and on our socials.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent px-6 py-[13px] font-sans text-[15px] font-bold text-white transition-colors hover:bg-accent-hover"
        >
          See your spot
        </Link>
      </div>
    );
  }

  if (view === "checkout") {
    return (
      <form action={formAction} className="mx-auto w-full max-w-[940px] px-6 pt-14">
        {/* What the bid panel collected, carried to the server as-is. The
            server re-prices from these; it never trusts the total below. */}
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="applyUrl" value={url} />
        <input type="hidden" name="bid" value={String(bidCents / 100)} />

        <button
          type="button"
          onClick={() => setView("board")}
          className="font-mono text-xs uppercase tracking-[0.06em] text-muted hover:text-accent-deep"
        >
          ← Back to the board
        </button>
        <h1 className="mb-10 mt-[22px] text-balance text-[32px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[42px]">
          {bidCents > topBidCents
            ? "One charge and the top spot is yours."
            : `Your spot: #${wouldBeRank}.`}
        </h1>

        <div className="grid grid-cols-1 items-start gap-11 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <div className={`${LABEL} mb-4`}>Your listing</div>
            <div className="mb-[34px] flex flex-col gap-[14px] border border-line-strong bg-panel p-[22px]">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-muted">Market</span>
                <span className="text-right text-[14.5px] font-bold">
                  {name.trim() || "Your market"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-muted">Vendor application link</span>
                <span className="break-all text-right font-mono text-[13px]">
                  {displayUrl(url.trim()) || "yourmarket.com/apply"}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-[14px]">
                <span className="text-sm text-muted">Position this takes</span>
                <span className="font-mono text-[15px] font-bold text-accent">
                  #{wouldBeRank}
                </span>
              </div>
            </div>

            <div className={`${LABEL} mb-4`}>How it shows on the board</div>
            <div className="flex flex-col gap-[14px]">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                  Email for the receipt
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@yourmarket.com"
                  className={`${INPUT} bg-panel`}
                />
                <span className="mt-1.5 block text-[12px] leading-[1.5] text-muted">
                  This is what owns the listing. Bid again with the same market name and
                  email to raise it and pay only the difference.
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                  Where it happens
                </span>
                <input
                  name="location"
                  required
                  maxLength={80}
                  placeholder="Asheville, NC"
                  className={`${INPUT} bg-panel`}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                  Type of market
                </span>
                <select name="category" className={`${INPUT} bg-panel`} defaultValue="Craft">
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                  What vendors should know
                </span>
                <textarea
                  name="blurb"
                  rows={3}
                  maxLength={400}
                  placeholder="Ninth year on the French Broad. 120 booths, juried handmade only."
                  className={`${INPUT} resize-y bg-panel`}
                />
              </label>
            </div>
          </div>

          <div className="border border-line-strong bg-panel p-[26px]">
            <div className="mb-5 text-[19px] font-bold tracking-[-0.01em]">Order</div>
            <div className="flex flex-col gap-3 border-b border-line pb-4">
              <div className="flex justify-between gap-3">
                <span className="text-[14.5px]">Listing for {name.trim() || "your market"}</span>
                <span className="font-mono text-[14.5px] font-bold">
                  {formatUsd(bidCents)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-sm text-muted">Processing</span>
                <span className="font-mono text-sm text-muted">{formatUsd(feeCents)}</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-3 pb-1 pt-[18px]">
              <span className="text-[15px] font-bold">Charged today</span>
              <span className="font-mono text-[28px] font-bold tracking-[-0.02em]">
                {formatUsd(bidCents + feeCents)}
              </span>
            </div>
            <div className="mb-5 font-mono text-[11.5px] leading-[1.5] text-muted">
              One charge. No subscription, no renewal. Raising an existing listing costs only
              the difference, so the total may come out lower on Stripe.
            </div>

            {state.error && (
              <p className="mb-4 border border-accent bg-panel px-3 py-2 text-[13px] leading-[1.5] text-accent-deep">
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending} className={PRIMARY_BUTTON}>
              {pending ? "Taking you to Stripe…" : "Continue to payment"}
            </button>
            <div className="mt-[14px] text-[12.5px] leading-[1.55] text-muted">
              Card details are handled by Stripe, not us. Payments are final: somebody paying
              more later moves your rank down but never removes your listing. See the{" "}
              <a href="/rules" className="text-accent-deep underline">
                rules
              </a>
              .
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="container-site px-6 pt-14">
      {/* Pitch + the bid form it's selling */}
      <div className="grid grid-cols-1 items-start gap-14 border-b border-line pb-[52px] md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <div className="mb-[18px] font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">
            Name-your-price event listings
          </div>
          <h1 className="mb-5 text-balance text-[40px] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[58px]">
            Pay what a spot is worth. That&rsquo;s the whole website.
          </h1>
          <p className="mb-[26px] max-w-[46ch] text-pretty text-[17px] leading-[1.55] text-body">
            No ads. No algorithm. No 40-minute onboarding call. You decide what a spot on
            this board is worth, and the board sorts by it — most paid sits at the top, gets
            seen by every vendor who lands here, and goes out to our socials and the homepage.
          </p>
          <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 font-mono text-[12.5px] text-muted">
            <span>
              <span className="text-live">●</span>{" "}
              {rows.length > 0
                ? `${rows.length} markets on the board`
                : "Nobody on the board yet"}
            </span>
            <span>Cheapest spot: {formatUsd(MIN_BID_CENTS)}</span>
          </div>
        </div>

        <div id="bid-form" className="border border-line-strong bg-panel p-[26px]">
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <div className="text-[19px] font-bold tracking-[-0.01em]">List your market</div>
            <div className="font-mono text-xs text-muted">
              from {formatUsd(MIN_BID_CENTS)}
            </div>
          </div>

          {cancelled && (
            <p className="mb-4 border border-line-strong bg-paper px-3 py-2 text-[13px] leading-[1.5] text-muted">
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
            className={`${INPUT} mb-4`}
          />

          <label className={FIELD_LABEL} htmlFor="market-url">
            Vendor application link
          </label>
          <input
            id="market-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourmarket.com/apply"
            className={`${INPUT} mb-4`}
          />

          <label className={FIELD_LABEL} htmlFor="market-bid">
            What you&rsquo;ll pay
          </label>
          <div className="mb-2 flex items-stretch border border-line-input bg-paper">
            <span className="flex items-center pl-[13px] pr-1 font-mono text-[22px] text-muted">
              $
            </span>
            <input
              id="market-bid"
              inputMode="numeric"
              value={String(Math.round(bidCents / 100))}
              onChange={(e) =>
                setBidInput(
                  Math.max(
                    MIN_BID_CENTS,
                    (parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0) * 100,
                  ),
                )
              }
              className="min-w-0 flex-1 border-none bg-transparent px-2 py-3 font-mono text-[22px] font-bold text-ink outline-none"
            />
            <button
              aria-label="Lower the price by a dollar"
              onClick={() => setBidInput(Math.max(MIN_BID_CENTS, bidCents - 100))}
              className="w-9 shrink-0 border-l border-line-input text-lg text-muted hover:bg-line hover:text-ink"
            >
              −
            </button>
            <button
              aria-label="Raise the price by a dollar"
              onClick={() => setBidInput(bidCents + 100)}
              className="w-9 shrink-0 border-l border-line-input text-lg text-muted hover:bg-line hover:text-ink"
            >
              +
            </button>
          </div>
          <div className="mb-[18px] font-mono text-[11.5px] leading-[1.5] text-muted">
            {rows.length === 0
              ? "Nothing on the board yet — this puts you at #1."
              : bidCents > topBidCents
                ? "That puts you at #1."
                : `That sits at #${wouldBeRank}. ${formatUsd(topBidCents + 100)} would put you at the top.`}
          </div>

          <button onClick={() => setView("checkout")} className={PRIMARY_BUTTON}>
            List my market
          </button>
          <div className="mt-3 text-[12.5px] leading-[1.5] text-muted">
            Already listed? Same market name, bigger number, and you only pay the difference.
          </div>
        </div>
      </div>

      {activity.length > 0 && (
        <div className="border-b border-line py-[30px]">
          <div className={`${LABEL} mb-4`}>Latest activity</div>
          <div className="grid grid-cols-1 gap-[11px] sm:grid-cols-2 sm:gap-x-[34px]">
            {activity.map((a) => (
              <div key={a.id} className="flex items-baseline gap-3">
                <span className="flex-1 text-[14.5px] font-semibold">{a.name}</span>
                <span className="font-mono text-xs text-body">{formatUsd(a.bidCents)}</span>
                <span className="font-mono text-xs text-muted">{a.ago}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The board */}
      <div className="flex items-baseline justify-between gap-4 pb-[18px] pt-11">
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em]">The board</h2>
        {rows.length > 0 && (
          <div className="font-mono text-xs text-muted">
            {(showAll ? rows.length : Math.min(PREVIEW_COUNT, rows.length)) +
              " of " +
              rows.length +
              " markets"}
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="border-y border-line py-16 text-center">
          <p className="mb-2 text-[19px] font-bold tracking-[-0.015em]">
            No markets on the board yet.
          </p>
          <p className="text-[14.5px] leading-[1.5] text-body">
            The first listing takes #1 and holds it until somebody pays more.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-px border-y border-line bg-line">
          {visible.map((row, i) => {
            const rank = i + 1;
            return (
              <div
                key={row.id}
                className="grid grid-cols-[52px_minmax(0,1fr)] gap-5 bg-paper py-[22px] pr-5 hover:bg-panel sm:grid-cols-[74px_minmax(0,1fr)_minmax(0,176px)]"
              >
                <div
                  className={`pl-1 font-mono text-[26px] font-bold tracking-[-0.02em] ${
                    rank <= 3 ? "text-accent" : "text-faint"
                  }`}
                >
                  #{rank}
                </div>
                <div>
                  <div className="mb-1.5 flex flex-wrap items-baseline gap-2.5">
                    <span className="text-[19px] font-bold tracking-[-0.015em]">
                      {row.name}
                    </span>
                    <span className="border border-line-strong px-[7px] py-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
                      {row.category}
                    </span>
                  </div>
                  {row.location && (
                    <div className="mb-1.5 font-mono text-[12px] text-muted">
                      {row.location}
                    </div>
                  )}
                  {row.blurb && (
                    <p className="mb-[9px] max-w-[62ch] text-pretty text-[14.5px] leading-[1.5] text-body">
                      {row.blurb}
                    </p>
                  )}
                  <a
                    href={row.applyUrl}
                    target="_blank"
                    rel="nofollow noopener external"
                    className="font-mono text-[12.5px] text-accent-deep hover:underline"
                  >
                    {displayUrl(row.applyUrl)} →
                  </a>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:text-right">
                  <div className="font-mono text-[22px] font-bold tracking-[-0.02em]">
                    {formatUsd(row.bidCents)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rows.length > PREVIEW_COUNT && (
        <div className="flex justify-center pt-7">
          <button
            onClick={() => setShowAll(!showAll)}
            className="border border-line-strong px-[22px] py-3 font-mono text-xs uppercase tracking-[0.08em] text-ink hover:bg-panel"
          >
            {showAll ? `Show top ${PREVIEW_COUNT} only` : `Show all ${rows.length} markets`}
          </button>
        </div>
      )}

      {/* How it works */}
      <div className="mt-16 grid grid-cols-1 gap-[34px] border-y border-line py-[34px] sm:grid-cols-3">
        <div>
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            01 / List
          </div>
          <p className="text-pretty text-[14.5px] leading-[1.55] text-body">
            Market name, application link, and what a spot is worth to you. Takes about nine
            seconds.
          </p>
        </div>
        <div>
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            02 / Get shared everywhere
          </div>
          <p className="text-pretty text-[14.5px] leading-[1.55] text-body">
            Top 10 goes out to our Facebook, Instagram and the weekly vendor email. Top 3 takes
            over the homepage. The more you put in, the further up you sit.
          </p>
        </div>
        <div>
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            03 / Fill your booths
          </div>
          <p className="text-pretty text-[14.5px] leading-[1.55] text-body">
            Vendors go straight to your own form. We take zero percent of your booth fees and we
            will never email your applicants.
          </p>
        </div>
      </div>
    </div>
  );
}
