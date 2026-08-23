"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// One header for every indexable page. Add a link here and it appears
// site-wide. The auth screens and the organizer dashboard are noindex and keep
// their own minimal chrome.
const NAV_LINKS = [
  { href: "/why-list-your-market", label: "Why list" },
  { href: "/about", label: "About" },
  { href: "/rules", label: "Rules" },
];

export function LogoMark() {
  return (
    <Image
      src="/logo-mark.svg"
      alt="Vendor Events Near Me"
      width={60}
      height={60}
      priority
      // The artwork sits in the middle ~57% of its square viewBox, so it needs
      // to render larger than its optical size to match the nav's weight.
      className="h-[42px] w-auto"
    />
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="px-6">
      <div className="container-site flex items-center justify-between gap-6 py-[18px]">
        <Link href="/" aria-label="Vendor Events Near Me — home" className="flex">
          <LogoMark />
        </Link>
        {/* Below sm the header is the mark alone — the nav drops away. */}
        <div className="hidden items-center gap-6 sm:flex">
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[15px] font-bold text-ink hover:text-accent-deep ${
                  pathname === link.href ? "text-accent-deep" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
