import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    key: "rules",
    canonical: "/rules",
    defaultTitle: "Rules",
    defaultDescription:
      "How the leaderboard works, what you can list, and what happens after you pay. Minimum $5, no refunds, listings run until the day of your event.",
  });
}

const LAST_UPDATED = "22 August 2026";

const SECTIONS: { title: string; points: string[] }[] = [
  {
    title: "How it works",
    points: [
      "The minimum price to list your market is $5. After that, it all depends on the price you want to pay.",
      "Your event will stay in its ranking until someone surpasses it. They can surpass you by paying more than what you paid.",
      "Listings don't expire until the day of your event. Once your event day has passed, we will no longer show it. We want to keep relevant results.",
      "You can bid as many times as you'd like.",
    ],
  },
  {
    title: "What can you list",
    points: [
      "You can list an event application form or event page.",
      "Chat and invite links are not allowed — Telegram, WhatsApp, Discord, Messenger, Signal, and similar. The board is for products and profiles, not group chats.",
      "Links to sexual content are not allowed. If it is porn, NSFW, or an adult platform, it does not belong on the board.",
    ],
  },
  {
    title: "After you pay",
    points: [
      "Your listing goes live. Clicks go to the link you provided.",
      "No refunds — since you dictate the price, all sales are final.",
      "Rankings go into effect right away. If you don't see the change, feel free to reach out at ivan@marketlly.com.",
    ],
  },
];

export default function Rules() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />

      <div className="container-prose px-6 pb-4 pt-[72px]">
        <h1 className="mb-5 text-balance text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[46px]">
          Rules
        </h1>

        <p className="mb-2.5 text-pretty text-[17px] leading-[1.6] text-body">
          Vendor Events Near Me is a public leaderboard and directory. You pay to list your
          vendor event or market. The event with the highest bid gets the most visibility and
          is featured at the top. To surpass them, you just need to bid higher.
        </p>
        <p className="mb-10 text-sm text-faint">Last updated {LAST_UPDATED}</p>

        {SECTIONS.map((section) => (
          <section key={section.title} className="mb-9">
            <h2 className="mb-3.5 text-[22px] font-extrabold tracking-[-0.02em]">
              {section.title}
            </h2>
            <ul className="list-disc space-y-2.5 pl-5 text-[17px] leading-[1.6] text-body marker:text-accent">
              {section.points.map((point) => (
                <li key={point} className="text-pretty pl-1">
                  {point}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
