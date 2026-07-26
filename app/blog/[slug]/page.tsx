import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import { TableOfContents, type Heading } from "./TableOfContents";

type ImageValue = SanityImageSource & { alt?: string };
type PortableValue = React.ComponentProps<typeof PortableText>["value"];

type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
  overview: string | null;
  body: PortableValue | null;
  author: {
    name: string;
    image: ImageValue | null;
    bio: string | null;
  } | null;
  seo: { title: string; description: string; noIndex: boolean };
};

const fetchOptions = { next: { revalidate: 60 } };

async function getPost(slug: string) {
  return client.fetch<Post | null>(POST_QUERY, { slug }, fetchOptions);
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(POST_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.seo.title,
    description: post.seo.description?.slice(0, 160),
    alternates: { canonical: `/blog/${slug}` },
    robots: post.seo.noIndex ? { index: false, follow: false } : undefined,
  };
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Build the "On this page" list from h2/h3 blocks. Each block's stable `_key`
// doubles as the heading id, so TOC anchors always match the rendered headings.
type HeadingBlock = {
  _type: string;
  _key: string;
  style?: string;
  children?: { text?: string }[];
};

function getHeadings(body: PortableValue | null): Heading[] {
  if (!Array.isArray(body)) return [];
  return (body as HeadingBlock[])
    .filter(
      (b) => b?._type === "block" && (b.style === "h2" || b.style === "h3"),
    )
    .map((b) => ({
      id: b._key,
      level: b.style === "h3" ? 3 : 2,
      text: (b.children ?? [])
        .map((c) => c.text ?? "")
        .join("")
        .trim(),
    }))
    .filter((h) => Boolean(h.id) && h.text.length > 0);
}

const portableComponents: React.ComponentProps<
  typeof PortableText
>["components"] = {
  types: {
    image: ({ value }: { value: ImageValue }) => (
      <Image
        src={urlFor(value).width(1400).fit("max").auto("format").url()}
        alt={value.alt || ""}
        width={1400}
        height={933}
        sizes="(max-width: 720px) 100vw, 720px"
        className="my-8 h-auto w-full rounded-xl border border-hairline"
      />
    ),
  },
  block: {
    h2: ({ value, children }) => (
      <h2 id={value?._key} className="scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ value, children }) => (
      <h3 id={value?._key} className="scroll-mt-24">
        {children}
      </h3>
    ),
  },
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const headings = getHeadings(post.body);

  return (
    <div className="flex w-full flex-1 flex-col bg-paper text-ink">
      <header className="border-b border-hairline">
        <div className="container-site flex items-center justify-between gap-6 px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-baseline gap-[7px]">
          <span className="font-sans text-[21px] font-extrabold tracking-[-0.02em]">
            Vendor Events
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
            near me
          </span>
        </Link>
        <Link href="/blog" className="text-[15px] font-medium hover:text-clay">
          ← All posts
        </Link>
        </div>
      </header>

      <article className="container-site px-6 py-14 sm:px-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-[9px] font-mono text-[11px] uppercase tracking-[0.1em]"
        >
          <Link href="/" className="text-sage hover:text-clay">
            Home
          </Link>
          <span className="text-[#A6AFA8]">/</span>
          <Link href="/blog" className="text-sage hover:text-clay">
            Blog
          </Link>
          <span className="text-[#A6AFA8]">/</span>
          <span className="text-ink">{post.title}</span>
        </nav>

        {/* Hero */}
        <div className="mb-12 flex flex-col gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-sage">
            {formatDate(post.publishedAt)}
          </span>
          <h1 className="font-sans text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[54px]">
            {post.title}
          </h1>
          {post.overview && (
            <p className="max-w-[62ch] text-[21px] leading-[1.5] text-sage text-pretty">
              {post.overview}
            </p>
          )}
          {post.author && (
            <div className="flex items-center gap-3 border-t border-hairline pt-5">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image)
                    .width(96)
                    .height(96)
                    .fit("crop")
                    .url()}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              )}
              <div className="flex flex-col">
                <span className="font-sans text-[15px] font-semibold">
                  {post.author.name}
                </span>
                {post.author.bio && (
                  <span className="text-[14px] leading-[1.4] text-sage">
                    {post.author.bio}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Body + table of contents */}
        <div className="grid grid-cols-1 gap-x-14 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0 max-w-[62ch]">
            {post.body && (
              <div className="flex flex-col gap-5 text-[18px] leading-[1.7] text-ink [&_a]:text-market-green [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-clay [&_blockquote]:pl-4 [&_blockquote]:text-sage [&_h2]:mt-6 [&_h2]:font-sans [&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_h3]:mt-4 [&_h3]:font-sans [&_h3]:text-[22px] [&_h3]:font-bold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
                <PortableText
                  value={post.body}
                  components={portableComponents}
                />
              </div>
            )}
          </div>

          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>
      </article>
    </div>
  );
}
