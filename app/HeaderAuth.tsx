"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

/**
 * Auth controls for the public site header.
 *
 * Deliberately a Client Component. Rendering `<Show>` from a Server Component
 * reads auth state at request time, which opts the whole route into dynamic
 * rendering — that costs the homepage and every blog post its prerendering.
 * Behind a client boundary the auth state resolves in the browser and the
 * pages stay static. Verify with `yarn build`: `/` must stay `○`.
 *
 * Clerk's buttons run in modal mode so they work before /signin and /signup
 * are wired up to Clerk.
 */
export function HeaderAuth() {
  return (
    <div className="flex items-center gap-5">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="text-[15px] font-medium text-ink hover:text-clay">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="rounded-lg bg-market-green px-[18px] py-[11px] font-sans text-sm font-semibold text-white transition-colors hover:bg-market-green-dark">
            List your market
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Link
          href="/dashboard/list-market"
          className="rounded-lg bg-market-green px-[18px] py-[11px] font-sans text-sm font-semibold text-white transition-colors hover:bg-market-green-dark"
        >
          List your market
        </Link>
        <UserButton />
      </Show>
    </div>
  );
}
