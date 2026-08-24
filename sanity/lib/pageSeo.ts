import type { Metadata } from "next";
import { client } from "./client";
import { PAGE_SEO_QUERY } from "./queries";

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
  return {
    title: seo?.title ?? defaultTitle,
    description: seo?.description ?? defaultDescription,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}
