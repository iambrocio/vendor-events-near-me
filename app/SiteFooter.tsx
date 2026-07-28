import Link from "next/link";

// One footer for every public page. Add a link here and it appears site-wide.
const FOOTER_LINKS = [
  { href: "/", label: "All markets" },
  { href: "/blog", label: "Blog" },
  { href: "/sitemap", label: "Sitemap" },
  { href: "/", label: "Contact" },
  { href: "/", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#46584F] bg-ink px-6 py-6 sm:px-10">
      <div className="container-site flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <span className="text-sm text-sage-muted">
          Markets worth showing up for.
        </span>
        <nav className="flex flex-wrap gap-[22px]">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-paper hover:text-amber"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
