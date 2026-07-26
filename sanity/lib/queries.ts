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
      "description": coalesce(seo.metaDescription, overview, pt::text(body))
    }
  }
`);

// For generateStaticParams.
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);
