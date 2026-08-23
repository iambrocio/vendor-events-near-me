import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { clerkAppearance } from "./clerk-appearance";
import { Roboto, Space_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const GA_ID = "G-NY33C1MRF1";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vendor Events Near Me",
  description:
    "A board of markets, fairs and festivals, sorted by what organizers paid to be there.",
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
    </html>
  );
}
