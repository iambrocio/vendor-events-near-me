import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await pageMetadata({
    key: "home",
    canonical: "/",
    defaultTitle: "Vendor Events Near Me",
    defaultDescription:
      "Markets worth showing up for. Run by organizers who take vendor applications.",
  });
  return {
    ...metadata,
    verification: {
      google: "BlxmLAALVyzFwyxHJSzzgH6VzWgtJD5Iw21dp65WCJY",
    },
  };
}

type Market = {
  slug: string;
  name: string;
  place: string;
  type: string;
  status: string;
  when: string;
  season: string;
  fee: string;
  organizer: string;
  blurb: string;
};

const FEATURED: Market[] = [
  {
    slug: "clintonville-farmers-market-1",
    name: "Clintonville Farmers Market",
    place: "Clintonville, Columbus",
    type: "Farmers",
    status: "Accepting",
    when: "SAT 8:00–12:00",
    season: "MAY–OCT",
    fee: "$35 / WK",
    organizer: "Clintonville CDC",
    blurb:
      "The biggest Saturday crowd in Columbus, and produce vendors get first pick of the north row.",
  },
  {
    slug: "short-north-night-market-2",
    name: "Short North Night Market",
    place: "Short North, Columbus",
    type: "Craft",
    status: "Accepting",
    when: "FRI 17:00–22:00",
    season: "JUN–SEP",
    fee: "$60 / WK",
    organizer: "Short North Alliance",
    blurb:
      "Evening market with foot traffic from the bar strip. Prepared food and craft do best here.",
  },
  {
    slug: "bexley-maker-fair-3",
    name: "Bexley Maker Fair",
    place: "Bexley",
    type: "Craft",
    status: "Accepting",
    when: "SUN 11:00–16:00",
    season: "SEP 13–14",
    fee: "$85 / DAY",
    organizer: "Ada Vinh",
    blurb:
      "Two-day indoor fair. Juried, so apply early — the organizer caps it at 60 booths.",
  },
];

const POPULAR_STATES = [
  { name: "Ohio", count: "12 markets" },
  { name: "Michigan", count: "3 markets" },
  { name: "Kentucky", count: "2 markets" },
  { name: "Indiana", count: "1 market" },
];

const ORGANIZER_POINTS = [
  { n: "01", text: "One listing page vendors can find, share, and apply from." },
  { n: "02", text: "Applications land in Marketlly, not in your inbox." },
  { n: "03", text: "Update dates and booth fees once, everywhere." },
];

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-baseline gap-[7px]">
      <span
        className={`font-sans text-[21px] font-extrabold tracking-[-0.02em] ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        Vendor Events
      </span>
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.1em] ${
          dark ? "text-amber" : "text-clay"
        }`}
      >
        near me
      </span>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-sage">
        {label}
      </span>
      <span className="font-mono text-[13px] font-medium">{value}</span>
    </div>
  );
}

function MarketCard({ m }: { m: Market }) {
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-hairline bg-paper p-6 transition-colors hover:border-ink">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-[5px] bg-amber px-[9px] py-[5px] font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink">
          {m.type}
        </span>
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-market-green">
          {m.status}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-sans text-[21px] font-bold leading-[1.2] tracking-[-0.015em]">
          <Link href={`/events/${m.slug}`} className="text-ink hover:text-clay">
            {m.name}
          </Link>
        </h3>
        <span className="text-[15px] text-sage">{m.place}</span>
        <p className="mt-1 text-[15px] leading-[1.5] text-sage text-pretty">
          {m.blurb}
        </p>
      </div>
      <div className="flex flex-col gap-[9px] border-y border-hairline py-[14px]">
        <MetaRow label="When" value={m.when} />
        <MetaRow label="Season" value={m.season} />
        <MetaRow label="Booth" value={m.fee} />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="text-[13px] text-sage">{m.organizer}</span>
        <button className="rounded-[7px] bg-clay px-[15px] py-[9px] font-sans text-[13px] font-semibold text-white transition-colors hover:bg-clay-dark">
          Apply
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col bg-paper text-ink">
        {/* Header */}
      <header className="border-b border-hairline">
        <div className="container-site flex items-center justify-between gap-6 px-6 py-5 sm:px-10">
        <div className="flex items-center gap-8 sm:gap-[34px]">
          <Wordmark />
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
        <Link
          href="/signup"
          className="rounded-lg bg-market-green px-[18px] py-[11px] font-sans text-sm font-semibold text-white transition-colors hover:bg-market-green-dark"
        >
          List your market
        </Link>
        </div>
      </header>

      {/* Hero — centered search */}
      <section className="container-site flex flex-col items-center gap-[26px] px-6 py-16 text-center sm:px-10 sm:pb-[72px] sm:pt-[84px]">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-clay">
          18 markets · 4 states · updated weekly
        </span>
        <h1 className="max-w-[20ch] font-sans text-[44px] font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-[72px]">
          Find a market that wants your booth.
        </h1>
        <p className="max-w-[52ch] text-[18px] leading-[1.55] text-sage text-pretty">
          Search by city, state, or market type. Every listing shows the booth
          fee and who to apply to.
        </p>

        <form className="flex w-full max-w-[780px] flex-col items-stretch gap-2 rounded-[14px] border-[1.5px] border-ink bg-surface p-2 shadow-[0_10px_30px_rgba(20,35,28,0.07)] sm:flex-row sm:items-center">
          <label className="flex flex-1 flex-col items-start gap-0.5 px-4 py-1.5 sm:flex-[1.3]">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
              Where
            </span>
            <input
              type="text"
              placeholder="Columbus, OH"
              className="w-full bg-transparent text-[17px] text-ink outline-none placeholder:text-ink/40"
            />
          </label>
          <div className="hidden h-10 w-px bg-hairline sm:block" />
          <label className="flex flex-1 flex-col items-start gap-0.5 px-4 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
              Market type
            </span>
            <select className="w-full cursor-pointer appearance-none bg-transparent text-[17px] text-ink outline-none">
              <option>Any type</option>
              <option>Farmers</option>
              <option>Craft</option>
              <option>Flea</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-[10px] bg-clay px-8 py-4 font-sans text-base font-semibold text-white transition-colors hover:bg-clay-dark"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-[10px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-sage">
            Popular
          </span>
          {POPULAR_STATES.map((s) => (
            <Link
              key={s.name}
              href="/"
              className="rounded-full border border-hairline bg-surface px-[15px] py-[7px] text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              {s.name} · {s.count}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured markets */}
      <section className="border-t border-hairline bg-surface px-6 py-14 sm:px-10 sm:pb-16 sm:pt-11">
        <div className="container-site flex flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-clay">
              Featured this month
            </span>
            <h2 className="font-sans text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em]">
              Markets taking applications now
            </h2>
          </div>
          <Link
            href="/"
            className="font-sans text-[15px] font-semibold text-market-green hover:text-clay"
          >
            See all 18 markets →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURED.map((m) => (
            <MarketCard key={m.name} m={m} />
          ))}
        </div>
        </div>
      </section>

      {/* For organizers */}
      <section className="bg-ink px-6 py-14 sm:px-10">
        <div className="container-site flex flex-col gap-6">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-12">
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
              Listings are free. Vendor applications run through Marketlly, so
              the spreadsheet stays closed.
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

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] bg-[#46584F] sm:grid-cols-3">
          {ORGANIZER_POINTS.map((p) => (
            <div key={p.n} className="flex flex-col gap-2 bg-ink px-[22px] py-6">
              <span className="font-mono text-xs font-medium text-amber">
                {p.n}
              </span>
              <span className="text-base leading-[1.45] text-paper">
                {p.text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-[#46584F] pt-6 sm:flex-row sm:items-center">
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
        </div>
      </section>
    </div>
  );
}
