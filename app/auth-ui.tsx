import Link from "next/link";
import { SiteFooter } from "./SiteFooter";

export function Wordmark() {
  return (
    <div className="flex items-baseline gap-[7px]">
      <span className="font-sans text-[22px] font-extrabold tracking-[-0.02em] text-ink">
        Vendor Events
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
        near me
      </span>
    </div>
  );
}

/**
 * Page chrome for /signin and /signup.
 *
 * The card itself is Clerk's `<SignIn>`/`<SignUp>`, themed by
 * `clerkAppearance` — it owns the heading, the fields, and the cross-link
 * between the two flows. This only supplies what sits around it.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-[26px] bg-paper px-6 py-16 text-ink">
        <Wordmark />

        {children}

        <span className="text-sm text-sage">
          Looking for a market to sell at?{" "}
          <Link href="/" className="font-semibold">
            Browse markets
          </Link>
        </span>
      </div>
      <SiteFooter />
    </>
  );
}
