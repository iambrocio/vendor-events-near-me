"use client";

import { useEffect, useState } from "react";

export type Heading = { id: string; text: string; level: number };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Highlight the heading nearest the top of the viewport.
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActive(topmost.target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage">
        On this page
      </span>
      <ul className="flex flex-col">
        {headings.map((h) => {
          const isActive = h.id === active;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`-ml-px block border-l-2 py-1.5 text-[13px] leading-snug transition-colors ${
                  h.level >= 3 ? "pl-6" : "pl-4"
                } ${
                  isActive
                    ? "border-market-green font-medium text-ink"
                    : "border-hairline text-sage hover:text-ink"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
