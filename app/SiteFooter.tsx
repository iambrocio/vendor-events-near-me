import Link from "next/link";

// One footer for every public page. Add a link here and it appears site-wide.
const FOOTER_LINKS = [
  { href: "/why-list-your-market", label: "Why list" },
  { href: "/about", label: "About" },
  { href: "/rules", label: "Rules" },
  { href: "/blog", label: "Blog" },
  { href: "/sitemap", label: "Sitemap" },
];

/**
 * `tagline` is the one line that changes per page — the running pot on the
 * board, a one-liner on the reading pages.
 */
export function SiteFooter({ tagline }: { tagline?: React.ReactNode }) {
  return (
    <footer className="mt-auto px-6">
      <div className="container-site flex flex-wrap items-baseline justify-between gap-6 border-t border-line pb-10 pt-[26px]">
        <div className="font-mono text-xs text-muted">
          {tagline ?? "Paid listings only. No scraping, no fake events."}
        </div>
        <div className="flex flex-wrap gap-5 font-mono text-xs">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="text-muted hover:text-accent-deep">
              {link.label}
            </Link>
          ))}
          <a href="mailto:hello@vendoreventsnearme.com" className="text-muted hover:text-accent-deep">
            Contact
          </a>
          <span className="text-faint">vendoreventsnearme.com</span>
        </div>
      </div>
    </footer>
  );
}
