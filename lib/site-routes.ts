import { readdir } from "node:fs/promises";
import path from "node:path";

const APP_DIR = path.join(process.cwd(), "app");
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

// Routes kept out of the public sitemap: the Studio, anything behind auth, and
// the sitemap itself.
const EXCLUDED = [/^\/studio(\/|$)/, /^\/dashboard(\/|$)/, /^\/sitemap$/];

// Human copy for the discovered routes. A route missing from here still shows
// up — the label falls back to a title-cased version of its last segment — so
// adding a page never requires touching this file.
const ROUTE_META: Record<string, { label: string; description?: string }> = {
  "/": {
    label: "Home",
    description: "Search markets by city, state, or market type.",
  },
  "/blog": {
    label: "Blog",
    description: "Notes on running and selling at markets.",
  },
  "/signin": { label: "Sign in", description: "Organizer account log-in." },
  "/signup": {
    label: "Sign up",
    description: "Create an organizer account and list your market.",
  },
};

// Section a route belongs to, keyed by its first path segment.
const SECTION_LABELS: Record<string, string> = {
  "": "Main pages",
  blog: "Blog",
  events: "Markets",
};

export type SiteLink = {
  href: string;
  label: string;
  description?: string;
  date?: string | null;
};

export type SiteSection = {
  key: string;
  title: string;
  links: SiteLink[];
};

function titleCase(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isRouteGroup(name: string) {
  return name.startsWith("(") && name.endsWith(")");
}

function isDynamic(name: string) {
  return name.startsWith("[");
}

// Walks the `app` directory and returns every statically addressable route —
// one per `page` file. Route groups `(group)` collapse away, dynamic segments
// `[slug]` are skipped because their URLs come from the content source instead.
async function discoverStaticRoutes(
  dir = APP_DIR,
  segments: string[] = [],
): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes: string[] = [];

  if (entries.some((e) => e.isFile() && PAGE_FILE.test(e.name))) {
    routes.push("/" + segments.join("/"));
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const { name } = entry;
    // `_private` folders, `@parallel` slots, and dynamic segments are not
    // static URLs.
    if (name.startsWith("_") || name.startsWith("@") || isDynamic(name)) {
      continue;
    }
    const child = await discoverStaticRoutes(
      path.join(dir, name),
      isRouteGroup(name) ? segments : [...segments, name],
    );
    routes.push(...child);
  }

  return routes;
}

// Top-level routes (`/`, `/blog`, `/signup`) all sit under "Main pages";
// anything nested is grouped by its first segment (`/events/…` → Markets).
function sectionKey(route: string) {
  const segments = route.split("/").filter(Boolean);
  return segments.length > 1 ? segments[0] : "";
}

/**
 * Every public static route in the app, sorted. Backs both the HTML sitemap
 * and `sitemap.xml`, so a new page lands in both without being registered.
 */
export async function getPublicStaticRoutes(): Promise<string[]> {
  return (await discoverStaticRoutes())
    .filter((route) => !EXCLUDED.some((pattern) => pattern.test(route)))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * The same routes, grouped into sections and ready to render. New pages appear
 * here automatically the next time the page renders — nothing to register by
 * hand.
 */
export async function getStaticRouteSections(): Promise<SiteSection[]> {
  const routes = await getPublicStaticRoutes();

  const sections = new Map<string, SiteSection>();

  for (const route of routes) {
    const key = sectionKey(route);
    const meta = ROUTE_META[route];
    const lastSegment = route === "/" ? "home" : route.split("/").pop()!;
    const section = sections.get(key) ?? {
      key,
      title: SECTION_LABELS[key] ?? titleCase(key),
      links: [],
    };
    section.links.push({
      href: route,
      label: meta?.label ?? titleCase(lastSegment),
      description: meta?.description,
    });
    sections.set(key, section);
  }

  // "Main pages" first, then the rest alphabetically.
  return [...sections.values()].sort((a, b) => {
    if (a.key === "") return -1;
    if (b.key === "") return 1;
    return a.title.localeCompare(b.title);
  });
}

export { SECTION_LABELS };
