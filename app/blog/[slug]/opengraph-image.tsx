import { client } from "@/sanity/lib/client";
import { POST_OG_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `Blog post on ${SITE_NAME}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type PostOg = {
  title: string;
  publishedAt: string | null;
  description: string | null;
  authorName: string | null;
} | null;

// Prerender a card for every post, matching the page's own static params.
export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(POST_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<PostOg>(
    POST_OG_QUERY,
    { slug },
    { next: { revalidate: 60 } },
  );

  // An unknown slug still renders a valid card rather than failing the route.
  if (!post) {
    return renderOgImage({ eyebrow: "Blog", title: SITE_NAME });
  }

  return renderOgImage({
    eyebrow: "Blog",
    title: post.title,
    description: post.description,
    facts: [formatDate(post.publishedAt), post.authorName],
  });
}
