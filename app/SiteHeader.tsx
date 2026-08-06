import Link from "next/link";
import { HeaderAuth } from "./HeaderAuth";

// One header for every indexable page. Add a link here and it appears
// site-wide. The auth screens and the organizer dashboard are noindex and keep
// their own minimal chrome.
const NAV_LINKS = [
  { href: "/", label: "Markets" },
  { href: "/", label: "By state" },
  { href: "/dashboard", label: "For organizers" },
];

export function Wordmark() {
  return (
    <div className="flex items-baseline gap-[7px]">
      <span className="font-sans text-[21px] font-extrabold tracking-[-0.02em] text-ink">
        Vendor Events
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
        near me
      </span>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-hairline">
      <div className="container-site flex items-center justify-between gap-6 px-6 py-5 sm:px-10">
        <div className="flex items-center gap-8 sm:gap-[34px]">
          <Link href="/">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-[22px] md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] font-medium text-ink hover:text-clay"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <HeaderAuth />
      </div>
    </header>
  );
}
