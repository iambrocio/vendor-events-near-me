import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "./clerk-appearance";
import { Libre_Franklin, Space_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
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
      className={`${libreFranklin.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>
      </body>
    </html>
  );
}
