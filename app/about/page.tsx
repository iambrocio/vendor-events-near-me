import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    key: "about",
    canonical: "/about",
    defaultTitle: "About Vendor Events Near Me",
    defaultDescription:
      "Why Ivan built a place to find every vendor market in your area, how organizers list on it, and why it isn't scraped.",
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
          I kept wishing this existed. So I built it.
        </h1>

        <div className="flex flex-col gap-[22px] text-[17px] leading-[1.6] text-body">
          <p className="text-pretty">
            My name is Ivan, and I&rsquo;m the founder of Vendor Events Near Me. I&rsquo;ve
            been attending vendor markets and events for a few years now. I usually find them
            through Facebook or a Google search. It&rsquo;s not hard, but it&rsquo;s definitely
            unconventional.
          </p>
          <p className="text-pretty">
            For the longest time, I wished someone would build something like Vendor Events
            Near Me, a place where you can see all the markets happening in your area. So I
            decided to take action and create the resource myself.
          </p>
          <p className="text-pretty">
            Event organizers can list their vendor markets on the platform for a fee. I&rsquo;ve
            seen how much organizers can grow their events when they reach more vendors and
            attendees, and this makes that easier.
          </p>
          <p className="text-pretty">
            This project is part of Marketlly, which helps event organizers run vendor events
            and manage their vendors. Not every organizer needs help managing vendors, but they
            all need a place to share their markets and events.
          </p>
          <p className="text-pretty">
            I also stay away from scraping websites and event pages, because a lot of that
            content is fake or spam. That&rsquo;s why we charge. You can pay based on how much
            value the platform brings you. If it helps you sign up two or three vendors,
            it&rsquo;s already worth it.
          </p>
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-5 border border-line-strong bg-panel p-[26px]">
          <div className="text-base font-semibold">Cheapest spot on the board: $5.</div>
          <Link
            href="/"
            className="bg-accent px-5 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-accent-hover"
          >
            List your market
          </Link>
        </div>
      </div>

      <SiteFooter tagline="Part of Marketlly. Built so organizers have somewhere to put a market." />
    </div>
  );
}
