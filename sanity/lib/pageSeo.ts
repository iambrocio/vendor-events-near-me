import type { Metadata } from "next";
import { client } from "./client";
import { PAGE_SEO_QUERY } from "./queries";
import { shareMetadata } from "@/lib/site";

type PageSeo = {
  seo: {
    title: string | null;
    description: string | null;
    noIndex: boolean;
  } | null;
} | null;

// Builds metadata for a code-built static page, letting a matching Sanity
// `page` document override title / description / index status, with code
// defaults as the fallback.
export async function pageMetadata({
  key,
  canonical,
  defaultTitle,
  defaultDescription,
}: {
  key: string;
  canonical: string;
  defaultTitle?: string;
  defaultDescription?: string;
}): Promise<Metadata> {
  // These overrides are optional by design — `defaultTitle` and
  // `defaultDescription` are the fallbacks. Letting a Sanity outage throw here
  // would take down the whole page over its <title>, since `generateMetadata`
  // runs as part of the render.
  let page: PageSeo = null;
  try {
    page = await client.fetch<PageSeo>(
      PAGE_SEO_QUERY,
      { key },
      { next: { revalidate: 60 } },
    );
  } catch (error) {
    console.error(`Metadata: Sanity lookup for "${key}" failed; using defaults.`, error);
  }
  const seo = page?.seo;
  const title = seo?.title ?? defaultTitle;
  const description = seo?.description ?? defaultDescription;
  return {
    title,
    description,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    // Mirror the resolved title/description onto the share tags so a Sanity
    // override drives the social card too, not just the search snippet.
    ...shareMetadata({ title, description, url: canonical }),
  };
}
