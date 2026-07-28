import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import { client } from "@/sanity/lib/client";
import { SITEMAP_POSTS_QUERY } from "@/sanity/lib/queries";
import { pageMetadata } from "@/sanity/lib/pageSeo";
import {
  getStaticRouteSections,
  SECTION_LABELS,
  type SiteSection,
} from "@/lib/site-routes";
import { SiteFooter } from "@/app/SiteFooter";
import { SiteHeader } from "@/app/SiteHeader";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    key: "sitemap",
    canonical: "/sitemap",
    defaultTitle: "Sitemap · Vendor Events Near Me",
    defaultDescription:
      "Every page on Vendor Events Near Me, in one list — markets, blog posts, and account pages.",
  });
}

type SitemapPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Blog posts live in Sanity, so they can't be found by walking the app
// directory — `/blog/[slug]` is one file. Pull them separately and merge them
// into the section the static routes already created for `/blog`.
async function getPostSection(): Promise<SiteSection | null> {
  const posts = await client.fetch<SitemapPost[]>(
    SITEMAP_POSTS_QUERY,
    {},
    { cache: "no-store" },
  );
  if (posts.length === 0) return null;
  return {
    key: "blog",
    title: SECTION_LABELS.blog,
    links: posts.map((post) => ({
      href: `/blog/${post.slug}`,
      label: post.title,
      date: post.publishedAt,
    })),
  };
}

function mergeSections(
  staticSections: SiteSection[],
  contentSections: SiteSection[],
): SiteSection[] {
  const merged = staticSections.map((section) => ({
    ...section,
    links: [...section.links],
  }));
  for (const content of contentSections) {
    const existing = merged.find((section) => section.key === content.key);
    if (existing) {
      existing.links.push(...content.links);
    } else {
      merged.push(content);
    }
  }
  return merged;
}

export default async function SitemapPage() {
  // Render per request so a page added to `app/` or a post published in Sanity
  // shows up on the next load, with no rebuild.
  await connection();

  const [staticSections, postSection] = await Promise.all([
    getStaticRouteSections(),
    getPostSection(),
  ]);
  const sections = mergeSections(
    staticSections,
    postSection ? [postSection] : [],
  );
  const total = sections.reduce((sum, s) => sum + s.links.length, 0);

  return (
    <>
      <div className="flex w-full flex-1 flex-col bg-paper text-ink">
        <SiteHeader />

        <main className="container-site px-6 py-14 sm:px-10">
          <div className="mb-10 flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-clay">
              {total} {total === 1 ? "page" : "pages"}
            </span>
            <h1 className="font-sans text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em]">
              Sitemap
            </h1>
            <p className="max-w-[62ch] text-[17px] leading-[1.55] text-sage text-pretty">
              Everything on Vendor Events Near Me, in one place.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <section key={section.key} className="flex flex-col gap-4">
                <h2 className="border-b-[1.5px] border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
                  {section.title}
                </h2>
                <ul className="flex flex-col divide-y divide-hairline">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                      >
                        <span className="flex min-w-0 flex-col gap-1">
                          <span className="font-sans text-[19px] font-semibold leading-[1.25] tracking-[-0.015em] group-hover:text-clay">
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="max-w-[62ch] text-[15px] leading-[1.5] text-sage text-pretty">
                              {link.description}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-sage">
                          {link.date ? formatDate(link.date) : link.href}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
