import type { Metadata } from "next";

/** Canonical origin for the public site — no trailing slash. */
export const SITE_URL = "https://vendoreventsnearme.com";

/** Absolute URL for an app-relative path (`/blog` → `https://…/blog`). */
export function absoluteUrl(path: string) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export const SITE_NAME = "Vendor Events Near Me";
export const SITE_DESCRIPTION =
  "A board of markets, fairs and festivals, sorted by what organizers paid to be there.";
export const SITE_LOCALE = "en_US";

/** The site-wide card rendered by `app/opengraph-image.tsx`. */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
};

type ShareOptions = {
  title?: string;
  description?: string;
  /** Route-relative path, e.g. `/blog/my-post`. */
  url: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  /**
   * Set when the segment has its own `opengraph-image` route. An explicit
   * `images` array here would win over that file, so we omit it and let the
   * generated card apply.
   */
  ownImage?: boolean;
};

/**
 * Builds the `openGraph` / `twitter` half of a page's metadata.
 *
 * A route that declares its own `openGraph` block *replaces* the one it
 * inherits from the root layout rather than merging into it — so any page
 * setting a custom OG title would otherwise silently drop the site-wide image
 * and locale. Routing every page through this helper keeps those defaults
 * attached. Segments that generate their own card pass `ownImage` so this
 * helper leaves the image slot alone.
 */
export function shareMetadata({
  title,
  description,
  url,
  type = "website",
  publishedTime,
  authors,
  ownImage = false,
}: ShareOptions): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type,
      url,
      title: title ?? SITE_NAME,
      description: description ?? SITE_DESCRIPTION,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      ...(ownImage ? {} : { images: [DEFAULT_OG_IMAGE] }),
      ...(type === "article" ? { publishedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? SITE_NAME,
      description: description ?? SITE_DESCRIPTION,
      ...(ownImage ? {} : { images: [DEFAULT_OG_IMAGE] }),
    },
  };
}
