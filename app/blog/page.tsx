import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Blog · Vendor Events Near Me",
  description: "Notes on running and selling at markets.",
};

type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
  excerpt: string | null;
  author: { name: string; image: SanityImageSource | null } | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndex() {
  const posts = await client.fetch<PostListItem[]>(
    POSTS_QUERY,
    {},
    { next: { revalidate: 60 } },
  );

  return (
    <div className="flex w-full flex-1 flex-col bg-paper text-ink">
      <header className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-baseline gap-[7px]">
          <span className="font-sans text-[21px] font-extrabold tracking-[-0.02em]">
            Vendor Events
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
            near me
          </span>
        </Link>
        <Link href="/" className="text-[15px] font-medium hover:text-clay">
          ← Home
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[820px] px-6 py-14 sm:px-10">
        <div className="mb-10 flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-clay">
            Blog
          </span>
          <h1 className="font-sans text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em]">
            Notes from the market
          </h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-[17px] text-sage">No posts yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-hairline border-y border-hairline">
            {posts.map((post) => (
              <li key={post._id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-3 py-8"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-sage">
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.author?.name && (
                      <>
                        <span className="text-[#A6AFA8]">/</span>
                        <span>{post.author.name}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-sans text-[26px] font-bold leading-[1.15] tracking-[-0.02em] group-hover:text-clay">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="max-w-[62ch] text-[17px] leading-[1.55] text-sage text-pretty">
                      {post.excerpt.slice(0, 180)}
                      {post.excerpt.length > 180 ? "…" : ""}
                    </p>
                  )}
                  <div className="flex items-center gap-2.5 pt-1">
                    {post.author?.image && (
                      <Image
                        src={urlFor(post.author.image)
                          .width(64)
                          .height(64)
                          .fit("crop")
                          .url()}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    )}
                    <span className="font-sans text-[14px] font-semibold text-market-green group-hover:text-clay">
                      Read →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
