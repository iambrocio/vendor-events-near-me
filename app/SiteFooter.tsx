import Link from "next/link";

// One footer for every public page. Add a link here and it appears site-wide.
const BOARD_LINKS = [
  { href: "/", label: "The board" },
  { href: "/why-list-your-market", label: "Why list" },
  { href: "/rules", label: "Rules" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/sitemap", label: "Sitemap" },
];

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="eyebrow mb-3 text-faint">{title}</div>
      <div className="flex flex-col gap-[9px] text-sm">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="text-muted hover:text-accent-deep">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * `tagline` is the one line that changes per page — the running total on the
 * board, a one-liner on the reading pages.
 */
export function SiteFooter({ tagline }: { tagline?: React.ReactNode }) {
  return (
    <footer className="mt-auto px-6 pt-16">
      <div className="container-site rounded-t-[26px] bg-lav-tint px-6 pb-[34px] pt-11 sm:px-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="mb-2.5 flex items-center gap-[9px] text-base font-extrabold tracking-[-0.02em]">
              <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-accent text-sm font-extrabold text-white">
                V
              </span>
              Vendor Events Near Me
            </div>
            <p className="max-w-[34ch] text-sm leading-[1.55] text-muted">
              {tagline ?? "Paid listings only. No scraping, no fake events."}
            </p>
          </div>
          <Column title="The board" links={BOARD_LINKS} />
          <Column title="Company" links={COMPANY_LINKS} />
          <div>
            <div className="eyebrow mb-3 text-faint">Get in touch</div>
            <div className="flex flex-col gap-[9px] text-sm">
              <a
                href="mailto:hello@vendoreventsnearme.com"
                className="break-all text-muted hover:text-accent-deep"
              >
                hello@vendoreventsnearme.com
              </a>
            </div>
          </div>
        </div>
        <div className="mt-[34px] border-t border-line-soft pt-5 text-[13px] text-faint">
          © {new Date().getFullYear()} vendoreventsnearme.com
        </div>
      </div>
    </footer>
  );
}
