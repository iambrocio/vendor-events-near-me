import Link from "next/link";

const X_HANDLE = "ivanambrociooo";

/**
 * One line under every public page. The four-column block it replaced was
 * mostly restating the header; the links that actually get used are here.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto px-6">
      <div className="container-site border-t-[1.5px] border-line-soft pb-11 pt-[30px] text-center text-[14.5px] leading-[1.7] text-muted">
        Created by the team at{" "}
        <a
          href="https://marketlly.com"
          className="font-medium text-accent-deep hover:underline"
        >
          Marketlly
        </a>{" "}
        and{" "}
        <a
          href={`https://x.com/${X_HANDLE}`}
          rel="me noopener"
          className="font-medium text-accent-deep hover:underline"
        >
          @{X_HANDLE}
        </a>{" "}
        ·{" "}
        <Link href="/why-list-your-market" className="font-medium text-accent-deep hover:underline">
          Why list
        </Link>{" "}
        ·{" "}
        <Link href="/about" className="font-medium text-accent-deep hover:underline">
          About
        </Link>{" "}
        ·{" "}
        <Link href="/rules" className="font-medium text-accent-deep hover:underline">
          Rules
        </Link>{" "}
        ·{" "}
        <Link href="/blog" className="font-medium text-accent-deep hover:underline">
          Blog
        </Link>{" "}
        ·{" "}
        <Link href="/sitemap" className="font-medium text-accent-deep hover:underline">
          Sitemap
        </Link>{" "}
        ·{" "}
        <a
          href="mailto:ivan@marketlly.com"
          className="font-medium text-accent-deep hover:underline"
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
