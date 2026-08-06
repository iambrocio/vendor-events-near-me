import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "../Sidebar";

export const metadata: Metadata = {
  title: "List a market · Vendor Events Near Me",
};

const fieldBase =
  "rounded-[9px] border-[1.5px] border-hairline bg-paper px-[15px] py-[14px] font-sans text-[17px] text-ink outline-none transition-colors placeholder:text-[#A6AFA8] focus:border-market-green focus:bg-surface";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
      {children}
    </span>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <span className="text-[13px] text-sage">{children}</span>;
}

export default async function ListMarket() {
  // Every protected file checks for itself — see the note in ../page.tsx.
  await auth.protect();

  return (
    <div className="grid min-h-screen grid-cols-[264px_1fr] text-ink">
      <Sidebar active="My markets" />

      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-6 border-b border-hairline bg-paper px-9 py-[22px]">
          <div className="flex flex-col gap-0.5">
            <Link
              href="/dashboard"
              className="font-mono text-[11px] uppercase tracking-[0.1em] text-sage hover:text-clay"
            >
              ← My markets
            </Link>
            <h1 className="mt-1 font-sans text-[26px] font-extrabold leading-[1.1] tracking-[-0.025em]">
              List a market
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border-[1.5px] border-hairline px-[18px] py-[11px] font-sans text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              Save draft
            </button>
            <button
              type="submit"
              form="list-market-form"
              className="rounded-lg bg-clay px-5 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-clay-dark"
            >
              Publish listing
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="px-9 pb-16 pt-8">
          <form
            id="list-market-form"
            className="flex max-w-[760px] flex-col gap-[26px] rounded-2xl border border-hairline bg-surface p-8"
          >
            <label className="flex flex-col gap-2">
              <Label>Title</Label>
              <input
                type="text"
                placeholder="Clintonville Farmers Market"
                className={fieldBase}
              />
              <Hint>Use the name vendors already call it.</Hint>
            </label>

            <label className="flex flex-col gap-2">
              <Label>Description</Label>
              <textarea
                placeholder="Who sells here, what the crowd is like, and anything a vendor should know before applying."
                className={`${fieldBase} min-h-[140px] resize-y text-[16px] leading-[1.55]`}
              />
            </label>

            <label className="flex flex-col gap-2">
              <Label>Location</Label>
              <input
                type="text"
                placeholder="North High St lot, Columbus, OH"
                className={fieldBase}
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <Label>Date</Label>
                <input
                  type="text"
                  placeholder="Saturdays, May 2 – Oct 25"
                  className={fieldBase}
                />
              </label>
              <label className="flex flex-col gap-2">
                <Label>Cost per booth</Label>
                <input
                  type="text"
                  placeholder="$35 per week"
                  className={`${fieldBase} font-mono`}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <Label>Link to application</Label>
              <input
                type="url"
                placeholder="https://marketlly.com/apply/clintonville"
                className={fieldBase}
              />
              <Hint>Vendors go straight here when they hit Apply.</Hint>
            </label>

            <div className="flex flex-col items-start justify-between gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center">
              <span className="text-sm text-sage">
                Listings publish right away. You can edit any field later.
              </span>
              <div className="flex gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-lg border-[1.5px] border-hairline px-5 py-3 font-sans text-[15px] font-semibold text-ink transition-colors hover:border-ink"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="rounded-lg bg-clay px-6 py-[13px] font-sans text-[15px] font-semibold text-white transition-colors hover:bg-clay-dark"
                >
                  Publish listing
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
