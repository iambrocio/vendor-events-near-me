import { auth } from "@clerk/nextjs/server";
import { DashboardHome } from "./DashboardHome";

/**
 * Server shell whose only job is the auth check — the dashboard itself is a
 * Client Component (section switching, `useUser()`), so it can't run
 * `auth.protect()` itself.
 *
 * The check is repeated here and in every other file under /dashboard rather
 * than living once in the layout: layouts don't re-render on every navigation
 * to their children, so layout-only protection is bypassable. This is also why
 * proxy.ts no longer path-matches — Clerk deprecated `createRouteMatcher` in
 * favour of exactly this per-resource check.
 */
export default async function Page() {
  await auth.protect();

  return <DashboardHome />;
}
