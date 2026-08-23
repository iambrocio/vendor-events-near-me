import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import { formatUsd, MIN_BID_CENTS } from "@/lib/board";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    key: "why-list-your-market",
    canonical: "/why-list-your-market",
    defaultTitle: "Why List Your Event or Market",
    defaultDescription:
      "Search traffic that already looks for vendor events, pricing built around what the platform is worth to you, and no free listings inviting spam.",
  });
}

type Reason = {
  n: string;
  title: string;
  body: string;
  /** Evidence for the claim, shown under it. */
  proof?: { src: string; alt: string; caption: string; width: number; height: number };
};

const REASONS: Reason[] = [
  {
    n: "01",
    title: "Our domain name gets searched a lot.",
    body: "People type “vendor events near me” into Google every day. Listing with us puts your market in front of that search traffic.",
    proof: {
      src: "/ahrefs-metrics.png",
      alt: "Ahrefs keyword overview for “vendor events near me”: 3.8K monthly searches in the United States, 4.0K globally, and a keyword difficulty score of 0.",
      caption: "Ahrefs, August 2026 — 3.8K US searches a month, 4.0K worldwide.",
      width: 2522,
      height: 848,
    },
  },
  {
    n: "02",
    title: "We know what the right audience can do for your event.",
    body: "Getting your market in front of the right vendors and shoppers can turn a slow weekend into a packed one.",
  },
  {
    n: "03",
    title: "We only make money if you see value.",
    body: "Our pricing is built around what the platform is worth to you. If it doesn't bring you results, it doesn't make sense for either of us.",
  },
  {
    n: "04",
    title: "The right vendors make it pay for itself.",
    body: "A single listing that brings in a few solid vendors can pay for itself many times over.",
  },
  {
    n: "05",
    title: "No spam, ever.",
    body: "This is why we charge. Free listings invite fake events, fake applications, and low-quality submissions that waste everyone's time. Paid listings keep the platform clean.",
  },
  {
    n: "06",
    title: "Built for local city markets.",
    body: "Vendors and shoppers can find markets happening in their own city, not three states away.",
  },
];

export default function WhyListYourMarket() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />

      <div className="container-prose px-6 pt-[72px]">
        <div className="mb-[18px] font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">
          Why list
        </div>
        <h1 className="mb-3.5 text-balance text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[46px]">
          Why list your market
        </h1>
        <p className="mb-11 text-pretty text-[17px] leading-[1.6] text-body">
          There are a million directories out there, so what makes us different?
        </p>

        <div className="flex flex-col gap-px border-y border-line bg-line">
          {REASONS.map((reason) => (
            <div
              key={reason.n}
              className="grid grid-cols-[46px_minmax(0,1fr)] items-start gap-4 bg-paper py-6 sm:grid-cols-[62px_minmax(0,1fr)]"
            >
              <div className="pt-0.5 font-mono text-[15px] font-bold text-accent">{reason.n}</div>
              <div>
                <div className="mb-[7px] text-[18px] font-bold tracking-[-0.015em]">
                  {reason.title}
                </div>
                <p className="text-pretty text-[15px] leading-[1.6] text-body">{reason.body}</p>
                {reason.proof && (
                  <figure className="mt-4">
                    <Image
                      src={reason.proof.src}
                      alt={reason.proof.alt}
                      width={reason.proof.width}
                      height={reason.proof.height}
                      className="h-auto w-full border border-line"
                      sizes="(max-width: 720px) 100vw, 658px"
                    />
                    <figcaption className="mt-2 font-mono text-[11.5px] leading-[1.5] text-muted">
                      {reason.proof.caption}
                    </figcaption>
                  </figure>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-5 border border-line-strong bg-panel p-[26px]">
          <div className="text-base font-semibold">
            Cheapest spot on the board: {formatUsd(MIN_BID_CENTS)}.
          </div>
          <Link
            href="/"
            className="bg-accent px-5 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-accent-hover"
          >
            List your market
          </Link>
        </div>
      </div>

      <SiteFooter tagline="One listing that fills a few booths has already paid for itself." />
    </div>
  );
}
