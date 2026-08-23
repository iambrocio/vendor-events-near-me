"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderAuth } from "./HeaderAuth";

// One header for every indexable page. Add a link here and it appears
// site-wide. The auth screens and the organizer dashboard are noindex and keep
// their own minimal chrome.
const NAV_LINKS = [
  { href: "/", label: "Leaderboard" },
  { href: "/why-list-your-market", label: "Why list" },
  { href: "/about", label: "About" },
  { href: "/rules", label: "Rules" },
];

export function Wordmark() {
  return (
    <span className="font-mono text-[13px] font-bold uppercase tracking-[0.06em] text-ink">
      vendoreventsnearme<span className="text-accent">.com</span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="px-6">
      <div className="container-site flex items-center justify-between gap-6 border-b border-line py-[22px]">
        <Link href="/">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-[26px]">
          <nav className="hidden items-center gap-[26px] sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                // The current page reads at full strength; the rest sit back.
                className={`text-[13.5px] font-semibold tracking-[0.01em] text-ink hover:text-accent-deep ${
                  pathname === link.href ? "opacity-100" : "opacity-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
