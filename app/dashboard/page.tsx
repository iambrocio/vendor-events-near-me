"use client";

import Link from "next/link";
import { useState } from "react";

type MarketStatus = "Live" | "Draft" | "Waitlist";

type Market = {
  name: string;
  place: string;
  status: MarketStatus;
  when: string;
  booths: string;
  views: string;
  applied: string;
};

const MARKETS: Market[] = [
  {
    name: "Clintonville Farmers Market",
    place: "North High St lot, Columbus",
    status: "Live",
    when: "SAT 8–12",
    booths: "52 / 60",
    views: "712",
    applied: "14",
  },
  {
    name: "Bexley Maker Fair",
    place: "Capital Ave gym, Bexley",
    status: "Draft",
    when: "SUN 11–16",
    booths: "0 / 40",
    views: "48",
    applied: "6",
  },
  {
    name: "Grandview Flea",
    place: "Grandview Heights",
    status: "Waitlist",
    when: "SUN 10–15",
    booths: "34 / 34",
    views: "524",
    applied: "6",
  },
];

const NAV = [
  { label: "Dashboard", badge: "" },
  { label: "My markets", badge: "3" },
  { label: "Vendors", badge: "" },
] as const;

type Section = (typeof NAV)[number]["label"];

const statusBadge: Record<MarketStatus, string> = {
  Live: "text-paper bg-market-green",
  Draft: "text-ink bg-amber",
  Waitlist: "text-sage bg-transparent border border-hairline",
};

function StatusTag({ status }: { status: MarketStatus }) {
  return (
    <span
      className={`font-mono text-[10px] font-medium uppercase tracking-[0.08em] rounded px-[7px] py-[3px] ${statusBadge[status]}`}
    >
      {status}
    </span>
  );
}

function Sidebar({
  section,
  onNavigate,
}: {
  section: Section;
  onNavigate: (s: Section) => void;
}) {
  return (
    <aside className="flex flex-col justify-between gap-8 bg-black px-[18px] py-[22px]">
      <div className="flex flex-col gap-7">
        {/* Wordmark */}
        <div className="flex items-baseline gap-[7px] px-[10px] py-1">
          <span className="font-sans text-[19px] font-extrabold tracking-[-0.02em] text-paper">
            Vendor Events
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber">
            near me
          </span>
        </div>

        {/* Org switcher */}
        <button className="flex items-center gap-[11px] rounded-[10px] border border-[#2E2E2E] bg-[#121212] px-3 py-[11px] text-left transition-colors hover:border-sage-muted">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-amber text-sm font-bold text-ink">
            CD
          </span>
          <span className="flex flex-1 flex-col gap-px">
            <span className="text-sm font-semibold text-paper">Clintonville CDC</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-sage-muted">
              3 markets
            </span>
          </span>
          <span className="text-[13px] text-sage-muted">▾</span>
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-[3px]">
          <span className="px-[10px] pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-sage-muted">
            Manage
          </span>
          {NAV.map((item) => {
            const active = item.label === section;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.label)}
                className={`flex items-center justify-between gap-[10px] rounded-[9px] px-3 py-[11px] transition-colors ${
                  active ? "bg-market-green text-paper" : "text-[#C4CFC7] hover:bg-white/5"
                }`}
              >
                <span className="text-[15px] font-medium">{item.label}</span>
                {item.badge && (
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      active
                        ? "rounded-[5px] bg-amber px-[7px] py-[2px] text-ink"
                        : "text-amber"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Account */}
      <div className="flex items-center gap-[11px] px-[10px] py-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2E2E2E] text-xs font-bold text-paper">
          AV
        </span>
        <span className="flex flex-1 flex-col gap-px">
          <span className="text-[13px] font-semibold text-paper">Ada Vinh</span>
          <span className="text-xs text-sage-muted">Organizer</span>
        </span>
        <Link
          href="/signin"
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-sage-muted hover:text-paper"
        >
          Out
        </Link>
      </div>
    </aside>
  );
}

function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
      {children}
    </span>
  );
}

function MyMarkets() {
  return (
    <section className="flex flex-col overflow-hidden rounded-[14px] border border-hairline bg-surface">
      <header className="flex items-center justify-between gap-5 border-b border-hairline px-[22px] py-5">
        <h2 className="font-sans text-[19px] font-bold tracking-[-0.015em]">
          Your markets
        </h2>
        <a href="#" className="font-sans text-sm font-semibold text-market-green hover:text-clay">
          Add a market →
        </a>
      </header>

      {/* Column headers */}
      <div className="grid grid-cols-[2fr_1fr_1fr_0.9fr_auto] gap-5 bg-paper px-[22px] py-3">
        <ColHead>Market</ColHead>
        <ColHead>When</ColHead>
        <ColHead>Booths</ColHead>
        <ColHead>Views</ColHead>
        <span />
      </div>

      {MARKETS.map((m) => (
        <div
          key={m.name}
          className="grid grid-cols-[2fr_1fr_1fr_0.9fr_auto] items-center gap-5 border-t border-hairline px-[22px] py-[18px] transition-colors hover:bg-paper"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-[10px]">
              <span className="font-sans text-[17px] font-bold tracking-[-0.01em]">
                {m.name}
              </span>
              <StatusTag status={m.status} />
            </div>
            <span className="text-sm text-sage">{m.place}</span>
          </div>
          <span className="font-mono text-[13px] font-medium">{m.when}</span>
          <span className="font-mono text-[13px] font-medium">{m.booths}</span>
          <span className="font-mono text-[13px] font-medium">{m.views}</span>
          <button className="rounded-[7px] border-[1.5px] border-ink px-[14px] py-2 font-sans text-[13px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper">
            Edit
          </button>
        </div>
      ))}
    </section>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-hairline bg-surface px-8 py-20 text-center">
      <h2 className="font-sans text-[19px] font-bold tracking-[-0.015em]">{title}</h2>
      <p className="max-w-sm text-[15px] text-sage">{body}</p>
    </div>
  );
}

export default function OrganizerDashboard() {
  const [section, setSection] = useState<Section>("My markets");

  return (
    <div className="grid min-h-screen grid-cols-[264px_1fr] text-ink">
      <Sidebar section={section} onNavigate={setSection} />

      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-6 border-b border-hairline bg-paper px-9 py-[22px]">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-sans text-[26px] font-extrabold leading-[1.1] tracking-[-0.025em]">
              Good morning, Ada
            </h1>
            <span className="text-[15px] text-sage">
              Your listings pulled 1,284 views in the last 30 days.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border-[1.5px] border-hairline px-[18px] py-[11px] font-sans text-sm font-semibold text-ink transition-colors hover:border-ink">
              View public page
            </button>
            <button className="rounded-lg bg-market-green px-[18px] py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-market-green-dark">
              Add a market
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="flex flex-col gap-7 px-9 pb-14 pt-8">
          {section === "My markets" && <MyMarkets />}
          {section === "Dashboard" && (
            <EmptyState
              title="Dashboard overview"
              body="Traffic, applications, and booth fill-rate across all your markets will show up here."
            />
          )}
          {section === "Vendors" && (
            <EmptyState
              title="Vendors"
              body="Applications and vendor rosters across your markets. Nothing to review right now."
            />
          )}
        </main>
      </div>
    </div>
  );
}
