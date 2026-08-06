import { clerkMiddleware } from "@clerk/nextjs/server";

// Next 16 renamed the `middleware` convention to `proxy`; Clerk's handler is a
// default export, so it carries over unchanged.
//
// Nothing is protected yet — this only makes auth state available to the app.
// Route protection lands with the dashboard.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Everything except Next internals and static assets, unless a file is
    // requested with a search param. `robots.txt` and `sitemap.xml` match, but
    // stay public because nothing here protects them.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Clerk's auto-proxy path.
    "/__clerk/:path*",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
