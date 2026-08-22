import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    key: "about",
    canonical: "/about",
    defaultTitle: "About the Board",
    defaultDescription:
      "A free directory of markets since 2023, with one paid leaderboard bolted on. One input: your bid.",
  });
}

export default function About() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />

      <div className="container-prose px-6 pt-[72px]">
        <div className="mb-[18px] font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">
          About
        </div>
        <h1 className="mb-7 text-balance text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[46px]">
          It&rsquo;s a leaderboard. The scoreboard is money.
        </h1>

        <div className="flex flex-col gap-[22px] text-[17px] leading-[1.6] text-body">
          <p className="text-pretty">
            Vendor Events Near Me has been a free directory of markets, fairs and festivals
            since 2023. Organizers post an event, vendors browse it, nobody pays a cent. That
            still works and it isn&rsquo;t going anywhere.
          </p>
          <p className="text-pretty">
            But a free directory sorts by date, so your October craft fair sits under this
            Saturday&rsquo;s flea market no matter how many empty booths you&rsquo;re staring
            at. Organizers kept asking how to jump the line. Here it is, in the crudest form we
            could think of.
          </p>
          <p className="text-pretty">
            One input: your bid. Highest bid is #1. Second highest is #2. No algorithm, no
            quality score, no ad dashboard, no &ldquo;let&rsquo;s hop on a quick call.&rdquo;
            Want the top? Pay a dollar more than whoever&rsquo;s sitting there.
          </p>

          <h2 className="-mb-1.5 mt-3.5 text-[22px] font-bold tracking-[-0.015em] text-ink">
            What the money actually buys
          </h2>
          <p className="text-pretty">
            The board, which vendors find through search, our newsletter and our socials. Top 10
            goes into the weekly vendor email and gets posted to Facebook and Instagram. Top 3
            takes the banner on the main homepage. That&rsquo;s it. That&rsquo;s the product.
          </p>
          <p className="text-pretty">
            You&rsquo;re buying eyeballs, not vendors. We hand people your application link and
            then get out of the way. Zero percent of your booth fees, zero access to your vendor
            list, zero emails to your applicants.
          </p>

          <h2 className="-mb-1.5 mt-3.5 text-[22px] font-bold tracking-[-0.015em] text-ink">
            Everything is public on purpose
          </h2>
          <p className="text-pretty">
            Every bid and every position change is visible to everyone, your competitors
            included. You can see what a spot costs before you spend a dollar. Try getting that
            out of a Facebook ad.
          </p>

          <h2 className="-mb-1.5 mt-3.5 text-[22px] font-bold tracking-[-0.015em] text-ink">
            Who&rsquo;s behind it
          </h2>
          <p className="text-pretty">
            One person and the free directory. Questions, refunds and complaints all land in the
            same inbox:{" "}
            <a
              href="mailto:hello@vendoreventsnearme.com"
              className="text-accent-deep underline"
            >
              hello@vendoreventsnearme.com
            </a>
            .
          </p>
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-5 border border-line-strong bg-panel p-[26px]">
          <div className="text-base font-semibold">Cheapest spot on the board: $5.</div>
          <Link
            href="/"
            className="bg-accent px-5 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-accent-hover"
          >
            Go get it
          </Link>
        </div>
      </div>

      <SiteFooter tagline="A free directory with one paid board bolted on." />
    </div>
  );
}
