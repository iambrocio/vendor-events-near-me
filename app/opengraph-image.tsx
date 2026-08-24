import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// Site-wide fallback share card. Any route without its own `opengraph-image`
// inherits this one.
export const alt = `${SITE_NAME} — ${SITE_DESCRIPTION}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Vendor events near me",
    title: "The board of markets, fairs and festivals",
    description: SITE_DESCRIPTION,
    facts: ["Every price public", "Apply direct", "List your market"],
  });
}
