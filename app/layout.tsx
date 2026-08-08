import type { Metadata } from "next";
import { Libre_Franklin, Newsreader } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// Body: Libre Franklin — a Franklin Gothic revival. American, newspaper-adjacent,
// warmer and less uniform than the geometric grotesques every product site uses.
const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Headings: Newsreader — a transitional serif drawn for reading rather than for
// display. Enough character to feel edited, not so much that it turns fashion.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Realtor Insider — New Jersey new construction",
    template: "%s · Realtor Insider",
  },
  description:
    "An independent guide to New Jersey new construction: which builders are worth your time, what the incentives actually mean, and where the value is right now. Demo prototype with sample data.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${libreFranklin.variable} ${newsreader.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
