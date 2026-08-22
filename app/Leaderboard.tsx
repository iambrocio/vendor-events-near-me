"use client";

import { useMemo, useState } from "react";
import {
  ACTIVITY,
  BOARD,
  MIN_BID,
  PREVIEW_COUNT,
  applyLink,
  formatUsd,
} from "@/lib/board";

const LABEL = "font-mono text-[11px] uppercase tracking-[0.14em] text-muted";
const FIELD_LABEL =
  "mb-[7px] block font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted";
const INPUT =
  "w-full border border-line-input bg-paper px-3 py-[11px] text-[14.5px] text-ink outline-none focus:border-accent";
const PRIMARY_BUTTON =
  "w-full bg-accent px-4 py-[14px] font-sans text-[15px] font-bold tracking-[0.01em] text-white transition-colors hover:bg-accent-hover";

type View = "board" | "checkout" | "done";

/**
 * The whole product: a board sorted by bid, a form that outbids it, and the
 * two screens that follow. One client component because every part of it reads
 * the same in-flight bid.
 */
export function Leaderboard() {
  const [view, setView] = useState<View>("board");
  const [showAll, setShowAll] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  // null means "no bid typed yet" — the field then shows a dollar over the top
  // bid rather than a hardcoded number.
  const [bidInput, setBidInput] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");

  // An empty board has no bid to beat, so the form opens at the floor price.
  const topBid = BOARD.length > 0 ? BOARD[0].bid : 0;
  const bid = bidInput ?? (BOARD.length > 0 ? topBid + 1 : MIN_BID);

  const { wouldBeRank, fee } = useMemo(() => {
    const beaten = BOARD.findIndex((row) => row.bid < bid);
    return {
      wouldBeRank: beaten === -1 ? BOARD.length + 1 : beaten + 1,
      // Card processing, rounded to the dollar the receipt will show.
      fee: Math.max(1, Math.round(bid * 0.029 + 0.3)),
    };
  }, [bid]);

  const trending = BOARD.slice(0, 5).map((row, i) => ({
    n: String(i + 1),
    name: row.name,
    rate: Math.round(row.clicks / 24) + "/h",
  }));

  const visible = showAll ? BOARD : BOARD.slice(0, PREVIEW_COUNT);

  const coName = name.trim() || "Your market";
  const coUrl = url.trim() || "yourmarket.com/apply";
  const coRank = "#" + (bid > topBid ? 1 : wouldBeRank);
  const total = bid + fee;

  // Clicking "Take it for $X" on a row loads the bid that beats it into the
  // form, then brings the form back into view — the rows people click sit well
  // below it.
  function claim(rank: number) {
    setBidInput(BOARD[rank - 1].bid + 1);
    document
      .getElementById("bid-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (view === "checkout") {
    return (
      <div className="mx-auto w-full max-w-[940px] px-6 pt-14">
        <button
          onClick={() => setView("board")}
          className="font-mono text-xs uppercase tracking-[0.06em] text-muted hover:text-accent-deep"
        >
          ← Back to the board
        </button>
        <h1 className="mb-10 mt-[22px] text-balance text-[32px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[42px]">
          {bid > topBid
            ? "One charge and the top spot is yours."
            : `Locking in #${wouldBeRank}.`}
        </h1>

        <div className="grid grid-cols-1 items-start gap-11 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <div className={`${LABEL} mb-4`}>Your listing</div>
            <div className="mb-[34px] flex flex-col gap-[14px] border border-line-strong bg-panel p-[22px]">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-muted">Market</span>
                <span className="text-right text-[14.5px] font-bold">
                  {coName}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-muted">
                  Vendor application link
                </span>
                <span className="break-all text-right font-mono text-[13px]">
                  {coUrl}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-[14px]">
                <span className="text-sm text-muted">
                  Position this bid takes
                </span>
                <span className="font-mono text-[15px] font-bold text-accent">
                  {coRank}
                </span>
              </div>
            </div>

            <div className={`${LABEL} mb-4`}>Pay with card</div>
            <div className="flex flex-col gap-[14px]">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                  Email for the receipt
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourmarket.com"
                  className={`${INPUT} bg-panel`}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                  Card number
                </span>
                <input
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className={`${INPUT} bg-panel font-mono`}
                />
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                    Expiry
                  </span>
                  <input
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    placeholder="09 / 29"
                    className={`${INPUT} bg-panel font-mono`}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                    CVC
                  </span>
                  <input
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className={`${INPUT} bg-panel font-mono`}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-muted">
                    ZIP
                  </span>
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="78702"
                    className={`${INPUT} bg-panel font-mono`}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="border border-line-strong bg-panel p-[26px]">
            <div className="mb-5 text-[19px] font-bold tracking-[-0.01em]">
              Order
            </div>
            <div className="flex flex-col gap-3 border-b border-line pb-4">
              <div className="flex justify-between gap-3">
                <span className="text-[14.5px]">Bid on {coName}</span>
                <span className="font-mono text-[14.5px] font-bold">
                  {formatUsd(bid)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-sm text-muted">Already-paid credit</span>
                <span className="font-mono text-sm text-muted">$0</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-sm text-muted">Processing</span>
                <span className="font-mono text-sm text-muted">
                  {formatUsd(fee)}
                </span>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-3 pb-1 pt-[18px]">
              <span className="text-[15px] font-bold">Charged today</span>
              <span className="font-mono text-[28px] font-bold tracking-[-0.02em]">
                {formatUsd(total)}
              </span>
            </div>
            <div className="mb-5 font-mono text-[11.5px] leading-[1.5] text-muted">
              One charge. No subscription, no renewal.
            </div>
            <button onClick={() => setView("done")} className={PRIMARY_BUTTON}>
              Pay {formatUsd(total)} and take {coRank}
            </button>
            <div className="mt-[14px] text-[12.5px] leading-[1.55] text-muted">
              Bids are final. Getting outbid later moves your rank down but
              never removes your listing. See the{" "}
              <a href="/rules" className="text-accent-deep underline">
                rules
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "done") {
    return (
      <div className="mx-auto w-full max-w-[620px] px-6 pt-24 text-center">
        <div className="mb-[18px] font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">
          Paid
        </div>
        <h1 className="mb-[18px] text-balance text-[32px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[42px]">
          You&rsquo;re at {coRank}. Go tell your vendors.
        </h1>
        <p className="mb-8 text-pretty text-[16.5px] leading-[1.6] text-body">
          {coName} is live on the board for {formatUsd(bid)}. Receipt is on its
          way. If you landed in the top 10 you&rsquo;ll go out in this
          week&rsquo;s vendor email and on our socials.
        </p>
        <button
          onClick={() => setView("board")}
          className="bg-accent px-6 py-[13px] font-sans text-[15px] font-bold text-white transition-colors hover:bg-accent-hover"
        >
          See your spot
        </button>
      </div>
    );
  }

  return (
    <div className="container-site px-6 pt-14">
      {/* Pitch + the bid form it's selling */}
      <div className="grid grid-cols-1 items-start gap-14 border-b border-line pb-[52px] md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <div className="mb-[18px] font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">
            Pay-to-win event listings
          </div>
          <h1 className="mb-5 text-balance text-[40px] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[58px]">
            Buy your way to #1. That&rsquo;s the whole website.
          </h1>
          <p className="mb-[26px] max-w-[46ch] text-pretty text-[17px] leading-[1.55] text-body">
            No ads. No algorithm. No 40-minute onboarding call. Highest bid sits
            at the top, gets seen by every vendor who lands here, and gets
            blasted to our socials and the homepage. Get outbid and you slide
            down. Bid again and you don&rsquo;t.
          </p>
          <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 font-mono text-[12.5px] text-muted">
            <span>
              <span className="text-live">●</span>{" "}
              {BOARD.length > 0
                ? `${BOARD.length} markets fighting for it`
                : "Nobody on the board yet"}
            </span>
            <span>Cheapest spot: {formatUsd(MIN_BID)}</span>
          </div>
        </div>

        <div
          id="bid-form"
          className="border border-line-strong bg-panel p-[26px]"
        >
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <div className="text-[19px] font-bold tracking-[-0.01em]">
              Take the top spot
            </div>
            <div className="font-mono text-xs text-muted">
              from {formatUsd(MIN_BID)}
            </div>
          </div>

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
            Your bid
          </label>
          <div className="mb-2 flex items-stretch border border-line-input bg-paper">
            <span className="flex items-center pl-[13px] pr-1 font-mono text-[22px] text-muted">
              $
            </span>
            <input
              id="market-bid"
              inputMode="numeric"
              value={String(bid)}
              onChange={(e) =>
                setBidInput(
                  Math.max(
                    MIN_BID,
                    parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0,
                  ),
                )
              }
              className="min-w-0 flex-1 border-none bg-transparent px-2 py-3 font-mono text-[22px] font-bold text-ink outline-none"
            />
            <button
              aria-label="Lower the bid by a dollar"
              onClick={() => setBidInput(Math.max(MIN_BID, bid - 1))}
              className="w-9 shrink-0 border-l border-line-input text-lg text-muted hover:bg-line hover:text-ink"
            >
              −
            </button>
            <button
              aria-label="Raise the bid by a dollar"
              onClick={() => setBidInput(bid + 1)}
              className="w-9 shrink-0 border-l border-line-input text-lg text-muted hover:bg-line hover:text-ink"
            >
              +
            </button>
          </div>
          <div className="mb-[18px] font-mono text-[11.5px] leading-[1.5] text-muted">
            {BOARD.length === 0
              ? "Board's empty. Any bid takes #1."
              : bid > topBid
                ? `Takes #1 from ${BOARD[0].name}.`
                : `Lands at #${wouldBeRank}. ${formatUsd(topBid + 1)} takes the top spot.`}
          </div>

          <button
            onClick={() => setView("checkout")}
            className={PRIMARY_BUTTON}
          >
            Outbid them
          </button>
          <div className="mt-3 text-[12.5px] leading-[1.5] text-muted">
            Already up there? Same market name, bigger number. You only pay the
            difference.
          </div>
        </div>
      </div>

      {/* Trending + activity — nothing to report until listings exist */}
      {(trending.length > 0 || ACTIVITY.length > 0) && (
        <div className="grid grid-cols-1 border-b border-line md:grid-cols-2">
          <div className="border-b border-line py-[30px] md:border-b-0 md:border-r md:pr-[34px] lg:pr-[34px]">
            <div className={`${LABEL} mb-4`}>🔥 Vendors are clicking these</div>
            <div className="flex flex-col gap-[11px]">
              {trending.map((t) => (
                <div key={t.name} className="flex items-baseline gap-3">
                  <span className="w-4 font-mono text-xs text-muted">
                    {t.n}
                  </span>
                  <span className="flex-1 text-[14.5px] font-semibold">
                    {t.name}
                  </span>
                  <span className="font-mono text-xs text-live">{t.rate}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="py-[30px] md:pl-[34px]">
            <div className={`${LABEL} mb-4`}>Latest activity</div>
            <div className="flex flex-col gap-[11px]">
              {ACTIVITY.map((a) => (
                <div key={a.name} className="flex items-baseline gap-3">
                  <span className="flex-1 text-[14.5px] font-semibold">
                    {a.name}
                  </span>
                  <span className="font-mono text-xs text-body">{a.move}</span>
                  <span className="font-mono text-xs text-muted">{a.ago}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* The board */}
      <div className="flex items-baseline justify-between gap-4 pb-[18px] pt-11">
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em]">
          The board
        </h2>
        {BOARD.length > 0 && (
          <div className="font-mono text-xs text-muted">
            {(showAll ? BOARD.length : Math.min(PREVIEW_COUNT, BOARD.length)) +
              " of " +
              BOARD.length +
              " markets"}
          </div>
        )}
      </div>

      {BOARD.length === 0 ? (
        <div className="border-y border-line py-16 text-center">
          <p className="mb-2 text-[19px] font-bold tracking-[-0.015em]">
            No markets on the board yet.
          </p>
          <p className="text-[14.5px] leading-[1.5] text-body">
            First bid takes #1 and holds it until somebody pays more.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-px border-y border-line bg-line">
          {visible.map((row, i) => {
            const rank = i + 1;
            return (
              <div
                key={row.name}
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
                  <p className="mb-[9px] max-w-[62ch] text-pretty text-[14.5px] leading-[1.5] text-body">
                    {row.blurb}
                  </p>
                  <span className="font-mono text-[12.5px] text-accent-deep">
                    {applyLink(row.name)} →
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-4 sm:col-span-1 sm:block sm:text-right">
                  <div className="font-mono text-[22px] font-bold tracking-[-0.02em] sm:mb-2.5">
                    {formatUsd(row.bid)}
                  </div>
                  <button
                    onClick={() => claim(rank)}
                    className="border border-line-strong px-2.5 py-[7px] font-mono text-[11px] uppercase tracking-[0.05em] text-body hover:border-accent hover:text-accent-deep"
                  >
                    Take it for {formatUsd(row.bid + 1)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Only worth a toggle once the board runs past the preview */}
      {BOARD.length > PREVIEW_COUNT && (
        <div className="flex justify-center pt-7">
          <button
            onClick={() => setShowAll(!showAll)}
            className="border border-line-strong px-[22px] py-3 font-mono text-xs uppercase tracking-[0.08em] text-ink hover:bg-panel"
          >
            {showAll
              ? `Show top ${PREVIEW_COUNT} only`
              : `Show all ${BOARD.length} markets`}
          </button>
        </div>
      )}

      {/* How it works */}
      <div className="mt-16 grid grid-cols-1 gap-[34px] border-y border-line py-[34px] sm:grid-cols-3">
        <div>
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            01 / Bid
          </div>
          <p className="text-pretty text-[14.5px] leading-[1.55] text-body">
            Market name, application link, a number. Beat the bid above you and
            that spot is yours. Takes about nine seconds.
          </p>
        </div>
        <div>
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            02 / Get shared everywhere
          </div>
          <p className="text-pretty text-[14.5px] leading-[1.55] text-body">
            Top 10 goes out to our Facebook, Instagram and the weekly vendor
            email. Top 3 takes over the homepage. Free promo, bought with money.
          </p>
        </div>
        <div>
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            03 / Fill your booths
          </div>
          <p className="text-pretty text-[14.5px] leading-[1.55] text-body">
            Vendors go straight to your own form. We take zero percent of your
            booth fees and we will never email your applicants.
          </p>
        </div>
      </div>
    </div>
  );
}
