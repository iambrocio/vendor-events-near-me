"use client";

import Link from "next/link";

export const NAV = [
  { label: "Dashboard", badge: "" },
  { label: "My markets", badge: "3" },
  { label: "Vendors", badge: "" },
] as const;

export type Section = (typeof NAV)[number]["label"];

/**
 * Shared organizer-dashboard sidebar.
 *
 * - Pass `onNavigate` for the in-page section switching used on the dashboard
 *   home (nav items render as buttons).
 * - Omit `onNavigate` on sub-pages (e.g. List a market); nav items render as
 *   links back to the dashboard home, with `active` still highlighting the
 *   relevant section.
 */
export function Sidebar({
  active,
  onNavigate,
}: {
  active: Section;
  onNavigate?: (s: Section) => void;
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
            const isActive = item.label === active;
            const cls = `flex items-center justify-between gap-[10px] rounded-[9px] px-3 py-[11px] transition-colors ${
              isActive ? "bg-market-green text-paper" : "text-[#C4CFC7] hover:bg-white/5"
            }`;
            const inner = (
              <>
                <span className="text-[15px] font-medium">{item.label}</span>
                {item.badge && (
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      isActive
                        ? "rounded-[5px] bg-amber px-[7px] py-[2px] text-ink"
                        : "text-amber"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            );

            return onNavigate ? (
              <button key={item.label} onClick={() => onNavigate(item.label)} className={cls}>
                {inner}
              </button>
            ) : (
              <Link key={item.label} href="/dashboard" className={cls}>
                {inner}
              </Link>
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
