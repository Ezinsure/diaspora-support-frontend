import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "../providers/Providers";
import { SITE_URL } from "../lib/site";

const figtree = localFont({
  src: [{ path: "./fonts/figtree-latin-wght-normal.woff2", weight: "300 900", style: "normal" }],
  variable: "--font-figtree",
  display: "swap",
});

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/fraunces-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Diaspora Services | Support with Rwandan government-service processes",
    template: "%s | Diaspora Services",
  },
  description:
    "Optional, professional support for Rwandans abroad with passport, birth certificate, national ID and notification processes. A private service, not a government website.",
  applicationName: "Diaspora Services",
  openGraph: {
    type: "website",
    siteName: "Diaspora Services",
    locale: "en",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}