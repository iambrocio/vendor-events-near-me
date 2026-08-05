import { defineQuery } from "next-sanity";

// Listing — newest first. `excerpt` flattens the body to plain text for previews.
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": coalesce(overview, pt::text(body)),
    author->{ name, image }
  }
`);

// Single post. SEO fields coalesce to sensible fallbacks so the frontend never
// has to branch on null.
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    overview,
    body,
    author->{ name, image, bio },
    "seo": {
      "title": coalesce(seo.metaTitle, title),
      "description": coalesce(seo.metaDescription, overview, pt::text(body)),
      "noIndex": seo.noIndex == true
    }
  }
`);

// For generateStaticParams.
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);

// Sitemaps (HTML and XML) — every indexable post, newest first. Posts flagged
// `noIndex` are left out so the sitemaps only list pages we want crawled.
// `_updatedAt` is the last-edit stamp `sitemap.xml` reports as `lastmod`.
export const SITEMAP_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && seo.noIndex != true]
    | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }
`);

// SEO overrides for a code-built static page, keyed by route.
export const PAGE_SEO_QUERY = defineQuery(`
  *[_type == "page" && key == $key][0]{
    "seo": {
      "title": seo.metaTitle,
      "description": seo.metaDescription,
      "noIndex": seo.noIndex == true
    }
  }
`);
