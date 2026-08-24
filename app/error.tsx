"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * Catches anything a route segment throws during render.
 *
 * Without this file a failed query rendered Next's bare production error
 * screen, which offers a browser reload and no context. The failures worth
 * designing for here are transient — a database blip, an expired credential —
 * so the primary action re-runs the query rather than reloading the tab.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  // `unstable_retry` re-fetches and re-renders the segment. `reset` only
  // clears the error state without re-fetching, which would land straight
  // back on the same failure.
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <div className="eyebrow text-faint">Something went wrong</div>
        <h1 className="font-sans text-[28px] font-bold leading-tight text-ink">
          We couldn&apos;t load the board
        </h1>
        <p className="text-[15px] leading-relaxed text-body">
          This is usually temporary. Try again — if it keeps happening, the
          listings are safe and nothing you paid for has been lost.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-2 rounded-full bg-accent px-6 py-3 font-sans text-[15px] font-bold text-white transition-colors hover:bg-accent-strong"
        >
          Try again
        </button>
        {/* Matches the `digest` in the Vercel runtime logs. */}
        {error.digest && (
          <p className="mt-2 font-mono text-[11px] text-faint">
            Reference: {error.digest}
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
