import Link from "next/link";
import type { Metadata } from "next";

type NearbyMarket = {
  slug: string;
  name: string;
  location: string;
  date: string;
  cost: string;
};

type Market = {
  slug: string;
  name: string;
  location: string;
  date: string;
  cost: string;
  about: string[];
  nearby: NearbyMarket[];
};

const FALLBACK_SLUG = "clintonville-farmers-market-1";

const MARKETS: Record<string, Market> = {
  [FALLBACK_SLUG]: {
    slug: FALLBACK_SLUG,
    name: "Clintonville Farmers Market",
    location: "North High St lot, Columbus, OH",
    date: "Saturdays, May 2 – Oct 25",
    cost: "$35 per week",
    about: [
      "Clintonville has run every Saturday morning on the North High lot since 2009, and it pulls the biggest regular market crowd in Columbus — roughly 2,000 shoppers on a clear weekend. Produce growers get first pick of the north row, where the foot traffic enters.",
      "We keep the mix intentionally food-heavy: growers, bakers, and prepared food fill most of the booths, with craft capped at four a week so the market stays a grocery run rather than a gift fair. Bring your own 10 × 10 tent and weights; there is no electric on site.",
    ],
    nearby: [
      {
        slug: "short-north-night-market-2",
        name: "Short North Night Market",
        location: "Short North, Columbus, OH",
        date: "Fridays, Jun 5 – Sep 25",
        cost: "$60 per week",
      },
      {
        slug: "grandview-flea-4",
        name: "Grandview Flea",
        location: "Grandview Heights, OH",
        date: "Sundays, Apr 12 – Nov 22",
        cost: "$25 per week",
      },
      {
        slug: "franklinton-third-friday-5",
        name: "Franklinton Third Friday",
        location: "Franklinton, Columbus, OH",
        date: "Third Friday, Mar – Dec",
        cost: "$30 per week",
      },
    ],
  },
};

function getMarket(slug: string): Market {
  return MARKETS[slug] ?? MARKETS[FALLBACK_SLUG];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const market = getMarket(slug);
  return {
    title: `${market.name} · Vendor Events Near Me`,
    description: market.about[0],
  };
}

function Wordmark() {
  return (
    <div className="flex items-baseline gap-[7px]">
      <span className="font-sans text-[21px] font-extrabold tracking-[-0.02em] text-ink">
        Vendor Events
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
        near me
      </span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-b-[1.5px] border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
      {children}
    </span>
  );
}

function FactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 bg-surface px-6 py-[22px]">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
        {label}
      </span>
      <span className="font-mono text-[19px] font-medium leading-[1.3]">
        {value}
      </span>
    </div>
  );
}

function SidebarRow({
  label,
  value,
  border,
}: {
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 ${
        border ? "border-t border-hairline pt-4" : ""
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
        {label}
      </span>
      <span className="text-base leading-[1.45] text-ink">{value}</span>
    </div>
  );
}

export default async function MarketDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const market = getMarket(slug);

  return (
    <div className="flex w-full flex-1 flex-col bg-paper text-ink">
      {/* Header */}
      <header className="border-b border-hairline">
        <div className="container-site flex items-center justify-between gap-6 px-6 py-5 sm:px-10">
        <div className="flex items-center gap-8 sm:gap-[34px]">
          <Link href="/">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-[22px] md:flex">
            <Link href="/" className="text-[15px] font-medium text-ink">
              Markets
            </Link>
            <Link href="/" className="text-[15px] font-medium text-ink">
              By state
            </Link>
            <Link href="/dashboard" className="text-[15px] font-medium text-ink">
              For organizers
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/signin"
            className="text-[15px] font-medium text-ink hover:text-clay"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-market-green px-[18px] py-[11px] font-sans text-sm font-semibold text-white transition-colors hover:bg-market-green-dark"
          >
            List your market
          </Link>
        </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container-site flex items-center gap-[9px] px-6 pt-5 sm:px-12">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-sage hover:text-clay"
        >
          Markets
        </Link>
        <span className="font-mono text-[11px] text-[#A6AFA8]">/</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
          {market.name}
        </span>
      </div>

      {/* Body */}
      <div className="container-site grid grid-cols-1 items-start gap-12 px-6 pb-16 pt-8 sm:px-12 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-9">
          <div className="flex flex-col gap-3">
            <h1 className="font-sans text-[44px] font-extrabold leading-[0.99] tracking-[-0.04em] sm:text-[60px]">
              {market.name}
            </h1>
            <span className="text-[19px] text-sage">{market.location}</span>
          </div>

          {/* Quick facts */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-hairline bg-hairline sm:grid-cols-2">
            <FactCell label="Date" value={market.date} />
            <FactCell label="Cost per booth" value={market.cost} />
          </div>

          {/* About */}
          <section className="flex flex-col gap-[14px]">
            <SectionHeading>About this market</SectionHeading>
            {market.about.map((para, i) => (
              <p
                key={i}
                className="max-w-[62ch] text-[18px] leading-[1.6] text-ink text-pretty"
              >
                {para}
              </p>
            ))}
          </section>

          {/* Location */}
          <section className="flex flex-col gap-[14px]">
            <SectionHeading>Location</SectionHeading>
            <div className="relative h-[260px] overflow-hidden rounded-[12px] border border-hairline bg-[#E7EDE6] bg-[linear-gradient(#DCE5DA_1px,transparent_1px),linear-gradient(90deg,#DCE5DA_1px,transparent_1px)] bg-[length:44px_44px]">
              <div className="absolute inset-0 bg-[linear-gradient(108deg,transparent_46%,#D5E0D2_46%,#D5E0D2_49%,transparent_49%),linear-gradient(24deg,transparent_66%,#D5E0D2_66%,#D5E0D2_68%,transparent_68%)]" />
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[9px] rounded-full bg-ink py-2 pl-[9px] pr-4 shadow-[0_8px_20px_rgba(20,35,28,0.24)]">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-amber font-mono text-[11px] font-medium text-ink">
                  1
                </span>
                <span className="font-mono text-[12px] font-medium uppercase text-paper">
                  {market.location.split(",")[0]}
                </span>
              </div>
            </div>
            <span className="text-base text-sage">{market.location}</span>
          </section>

          {/* Nearby */}
          <section className="flex flex-col gap-4">
            <SectionHeading>Other markets nearby</SectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {market.nearby.map((m) => (
                <Link
                  key={m.slug}
                  href={`/events/${m.slug}`}
                  className="flex flex-col gap-[10px] rounded-[12px] border border-hairline bg-surface p-5 text-ink transition-colors hover:border-ink"
                >
                  <span className="font-sans text-[17px] font-bold leading-[1.2] tracking-[-0.01em]">
                    {m.name}
                  </span>
                  <span className="text-sm text-sage">{m.location}</span>
                  <div className="flex flex-col gap-[3px] border-t border-hairline pt-[10px]">
                    <span className="font-mono text-xs text-sage">{m.date}</span>
                    <span className="font-mono text-[13px] font-medium">
                      {m.cost}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky apply sidebar */}
        <aside className="flex flex-col gap-[18px] rounded-2xl border-[1.5px] border-ink bg-surface p-[26px] shadow-[0_14px_40px_rgba(20,35,28,0.08)] lg:sticky lg:top-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
              Cost per booth
            </span>
            <span className="font-sans text-[40px] font-extrabold leading-none tracking-[-0.03em]">
              {market.cost}
            </span>
          </div>
          <SidebarRow label="Date" value={market.date} border />
          <SidebarRow label="Location" value={market.location} border />
          <button className="mt-1 rounded-[9px] bg-clay py-[15px] font-sans text-base font-semibold text-white transition-colors hover:bg-clay-dark">
            Apply to sell here
          </button>
          <span className="text-center text-[13px] leading-[1.45] text-sage">
            Opens the organizer&apos;s application form.
          </span>
        </aside>
      </div>

      {/* For organizers */}
      <section className="flex flex-col gap-6 bg-ink px-6 py-14 sm:px-10">
        <div className="container-site grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-[14px]">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-amber">
              For organizers
            </span>
            <h2 className="font-sans text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] text-paper">
              Get your market on the map.
            </h2>
          </div>
          <div className="flex flex-col gap-[18px]">
            <p className="text-[17px] leading-[1.55] text-sage-muted">
              Your first market is free to list. Vendor applications run through
              Marketlly, so the spreadsheet stays closed.
            </p>
            <div className="flex gap-3">
              <Link
                href="/signup"
                className="rounded-lg bg-clay px-[22px] py-[13px] font-sans text-[15px] font-semibold text-white transition-colors hover:bg-clay-dark"
              >
                List your market
              </Link>
              <button className="rounded-lg border-[1.5px] border-[#46584F] px-5 py-3 font-sans text-[15px] font-semibold text-paper transition-colors hover:border-paper">
                See how it works
              </button>
            </div>
          </div>
        </div>
        <div className="container-site flex flex-col items-start justify-between gap-4 border-t border-[#46584F] pt-6 sm:flex-row sm:items-center">
          <span className="text-sm text-sage-muted">
            Markets worth showing up for. Run by Marketlly.
          </span>
          <div className="flex flex-wrap gap-[22px]">
            <Link href="/" className="text-sm text-paper">
              All markets
            </Link>
            <Link href="/" className="text-sm text-paper">
              Marketlly
            </Link>
            <Link href="/" className="text-sm text-paper">
              Contact
            </Link>
            <Link href="/" className="text-sm text-paper">
              Privacy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
