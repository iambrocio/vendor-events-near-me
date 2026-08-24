import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { clerkAppearance } from "./clerk-appearance";
import { Roboto, Space_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import {
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const GA_ID = "G-NY33C1MRF1";
const HOTJAR_ID = 6766136;
const HOTJAR_SNIPPET_VERSION = 6;

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Site-wide defaults. Every route inherits these unless it overrides them, so
// a page that sets nothing still shares with a sensible title, description and
// card image (supplied by `app/opengraph-image.tsx`).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // No `dynamic` prop: that would opt every route into dynamic rendering and
  // cost the homepage and blog posts their prerendering. Authed sections take
  // `<ClerkProvider dynamic>` in their own layout instead.
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>
      </body>
      {/* Production only: localhost and preview deploys would otherwise report
          into the same property as real organizers. */}
      {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId={GA_ID} />}
      {/* Same gate as GA above. Shipped as Hotjar's own loader snippet rather
          than a plain `src`: the stub it installs on `window.hj` has to exist
          before the remote script arrives, so splitting the two would race. */}
      {process.env.NODE_ENV === "production" && (
        <Script id="hotjar" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${HOTJAR_ID},hjsv:${HOTJAR_SNIPPET_VERSION}};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
      )}
    </html>
  );
}
