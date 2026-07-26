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
  const page = await client.fetch<PageSeo>(
    PAGE_SEO_QUERY,
    { key },
    { next: { revalidate: 60 } },
  );
  const seo = page?.seo;
  return {
    title: seo?.title ?? defaultTitle,
    description: seo?.description ?? defaultDescription,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}
