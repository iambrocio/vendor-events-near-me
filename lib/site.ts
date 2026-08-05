/** Canonical origin for the public site — no trailing slash. */
export const SITE_URL = "https://vendoreventsnearme.com";

/** Absolute URL for an app-relative path (`/blog` → `https://…/blog`). */
export function absoluteUrl(path: string) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
