import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Shared renderer for every `opengraph-image` route, so the default card and
// the per-post cards stay identical apart from their copy.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Hex equivalents of the `oklch()` tokens in globals.css. Satori resolves a
// narrow set of colour functions and `oklch` is not among it, so these are
// converted rather than referenced.
const BRAND = {
  paper: "#ffffff",
  ink: "#1e1814",
  accent: "#7472f4", // --color-accent
  lav: "#eff2ff", // --color-lav
  line: "rgba(30, 24, 20, 0.1)", // --color-line
  body: "rgba(30, 24, 20, 0.74)", // --color-body
  faint: "rgba(30, 24, 20, 0.55)", // --color-faint
} as const;

const FONT_DIR = path.join(process.cwd(), "assets");

// Satori needs raw font bytes; `next/font` only emits CSS, so the files are
// committed and read here. Roboto to match the site's own type.
async function loadFonts() {
  const [regular, extraBold] = await Promise.all([
    readFile(path.join(FONT_DIR, "Roboto-Regular.ttf")),
    readFile(path.join(FONT_DIR, "Roboto-ExtraBold.ttf")),
  ]);
  return [
    { name: "Roboto", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Roboto", data: extraBold, weight: 800 as const, style: "normal" as const },
  ];
}

function clamp(text: string, max: number) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed;
}

// Long titles step down a size so they still fit in two or three lines.
function titleSize(title: string) {
  if (title.length > 70) return 54;
  if (title.length > 45) return 64;
  return 76;
}

export type OgImageProps = {
  /** Small tracked label above the title, e.g. "Blog". */
  eyebrow: string;
  title: string;
  description?: string | null;
  /** Optional short facts rendered as chips under the description. */
  facts?: (string | null | undefined)[];
};

export async function renderOgImage({
  eyebrow,
  title,
  description,
  facts,
}: OgImageProps) {
  const heading = clamp(title, 90);
  const body = description ? clamp(description, 150) : null;
  const chips = (facts ?? []).filter((fact): fact is string => Boolean(fact?.trim()));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BRAND.paper,
          fontFamily: "Roboto",
          padding: "72px 80px 64px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 14,
            backgroundColor: BRAND.accent,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: BRAND.accent,
            }}
          >
            {clamp(eyebrow, 40)}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: titleSize(heading),
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: BRAND.ink,
            }}
          >
            {heading}
          </div>

          {body && (
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.4,
                color: BRAND.body,
              }}
            >
              {body}
            </div>
          )}

          {chips.length > 0 && (
            <div style={{ display: "flex", marginTop: 32, gap: 12 }}>
              {chips.slice(0, 3).map((fact) => (
                <div
                  key={fact}
                  style={{
                    display: "flex",
                    padding: "10px 18px",
                    borderRadius: 999,
                    backgroundColor: BRAND.lav,
                    fontSize: 22,
                    color: BRAND.ink,
                  }}
                >
                  {clamp(fact, 32)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderTop: `1px solid ${BRAND.line}`,
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 16,
              height: 16,
              borderRadius: 999,
              backgroundColor: BRAND.accent,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: BRAND.ink,
            }}
          >
            vendoreventsnearme.com
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
