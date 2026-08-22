import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

// Organizer app — keep it out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * `dynamic` reads auth state on the server so `useUser()` in the dashboard
 * hydrates with the organizer already populated — no name-shaped hole on
 * first paint. The root provider deliberately omits it: setting it there
 * would opt the homepage and every blog post out of prerendering.
 *
 * The `protect()` here is a backstop, not the protection — layouts don't
 * re-render on every navigation to their children, so each page checks too.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  return <ClerkProvider dynamic>{children}</ClerkProvider>;
}
