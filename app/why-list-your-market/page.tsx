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
  title: string;
  body: string;
  /** Evidence for the claim, shown under it. */
  proof?: { src: string; alt: string; caption: string; width: number; height: number };
};

const REASONS: Reason[] = [
  {
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
    title: "We know what the right audience can do for your event.",
    body: "Getting your market in front of the right vendors and shoppers can turn a slow weekend into a packed one.",
  },
  {
    title: "We only make money if you see value.",
    body: "Our pricing is built around what the platform is worth to you. If it doesn't bring you results, it doesn't make sense for either of us.",
  },
  {
    title: "The right vendors make it pay for itself.",
    body: "A single listing that brings in a few solid vendors can pay for itself many times over.",
  },
  {
    title: "No spam, ever.",
    body: "This is why we charge. Free listings invite fake events, fake applications, and low-quality submissions that waste everyone's time. Paid listings keep the platform clean.",
  },
  {
    title: "Built for local city markets.",
    body: "Vendors and shoppers can find markets happening in their own city, not three states away.",
  },
];

export default function WhyListYourMarket() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />

      <div className="container-prose px-6 pb-4 pt-[72px]">
        <h1 className="mb-5 text-balance text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[46px]">
          Why list your market
        </h1>
        <p className="mb-9 text-pretty text-[17px] leading-[1.6] text-body">
          There are a million directories out there, so what makes us different?
        </p>

        <ul className="list-disc space-y-5 pl-5 text-[17px] leading-[1.6] text-body marker:text-accent">
          {REASONS.map((reason) => (
            <li key={reason.title} className="pl-1">
              <span className="font-bold text-ink">{reason.title}</span> {reason.body}
              {reason.proof && (
                <figure className="mt-4">
                  <Image
                    src={reason.proof.src}
                    alt={reason.proof.alt}
                    width={reason.proof.width}
                    height={reason.proof.height}
                    className="h-auto w-full rounded-xl border-[1.5px] border-line"
                    sizes="(max-width: 720px) 100vw, 658px"
                  />
                  <figcaption className="mt-2 text-[12px] leading-[1.5] text-faint">
                    {reason.proof.caption}
                  </figcaption>
                </figure>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-9 text-[17px] leading-[1.6] text-body">
          The cheapest spot on the board is {formatUsd(MIN_BID_CENTS)}.{" "}
          <Link href="/" className="font-semibold text-accent-deep hover:underline">
            List your market
          </Link>
          .
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}
