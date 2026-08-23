"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderAuth } from "./HeaderAuth";

// One header for every indexable page. Add a link here and it appears
// site-wide. The auth screens and the organizer dashboard are noindex and keep
// their own minimal chrome.
const NAV_LINKS = [
  { href: "/why-list-your-market", label: "Why list" },
  { href: "/about", label: "About" },
  { href: "/rules", label: "Rules" },
];

export function Wordmark() {
  return (
    <span className="flex items-center gap-[9px] text-[17px] font-extrabold tracking-[-0.02em] text-ink">
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-accent text-[15px] font-extrabold text-white">
        V
      </span>
      Vendor Events Near Me
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="px-6">
      <div className="container-site flex items-center justify-between gap-6 py-[18px]">
        <Link href="/">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-2 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                // The current page keeps the chip filled; the rest fill on hover.
                className={`rounded-full px-[14px] py-[9px] text-sm font-semibold text-ink hover:bg-lav-chip ${
                  pathname === link.href ? "bg-lav-chip" : ""
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
