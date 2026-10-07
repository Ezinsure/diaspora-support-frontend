import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import Providers from "../providers/Providers";
import { SITE_URL } from "../lib/site";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

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
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], // TODO: add to /public
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