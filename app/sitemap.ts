import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { client } from "@/sanity/lib/client";
import { SITEMAP_POSTS_QUERY } from "@/sanity/lib/queries";
import { getPublicStaticRoutes } from "@/lib/site-routes";
import { absoluteUrl } from "@/lib/site";

type SitemapPost = {
  slug: string;
  publishedAt: string | null;
  _updatedAt: string;
};

type RouteHints = {
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

// Crawl hints per route. Anything not listed falls back to DEFAULT_HINTS, so a
// new page still lands in the sitemap with sane values.
const ROUTE_HINTS: Record<string, RouteHints> = {
  "/": { changeFrequency: "daily", priority: 1 },
  "/blog": { changeFrequency: "weekly", priority: 0.8 },
  "/signin": { changeFrequency: "yearly", priority: 0.2 },
  "/signup": { changeFrequency: "yearly", priority: 0.4 },
};

const DEFAULT_HINTS: RouteHints = {
  changeFrequency: "monthly",
  priority: 0.5,
};

async function getPosts(): Promise<SitemapPost[]> {
  return client.fetch<SitemapPost[]>(
    SITEMAP_POSTS_QUERY,
    {},
    { cache: "no-store" },
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generated per request, like the HTML sitemap: a page added to `app/` or a
  // post published in Sanity is listed on the next crawl, with no rebuild.
  await connection();

  const [routes, posts] = await Promise.all([
    getPublicStaticRoutes(),
    getPosts(),
  ]);

  const now = new Date();

  const staticEntries = routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    ...(ROUTE_HINTS[route] ?? DEFAULT_HINTS),
  }));

  const postEntries = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post._updatedAt ?? post.publishedAt ?? now),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
