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
 * The buttons route to /signin and /signup (default redirect mode) — the
 * targets come from NEXT_PUBLIC_CLERK_SIGN_IN_URL / _SIGN_UP_URL.
 */
export function HeaderAuth() {
  return (
    <div className="flex items-center gap-4">
      <Show when="signed-out">
        <SignInButton>
          <button className="text-[13.5px] font-semibold tracking-[0.01em] text-ink opacity-50 hover:text-accent-deep hover:opacity-100">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="bg-accent px-[15px] py-[9px] font-sans text-[13.5px] font-bold text-white transition-colors hover:bg-accent-hover">
            List a market
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Link
          href="/dashboard/list-market"
          className="bg-accent px-[15px] py-[9px] font-sans text-[13.5px] font-bold text-white transition-colors hover:bg-accent-hover"
        >
          List a market
        </Link>
        <UserButton />
      </Show>
    </div>
  );
}
