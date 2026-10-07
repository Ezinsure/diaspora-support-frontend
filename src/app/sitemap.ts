import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { serviceContent } from "../lib/ServiiceContent";

// Update a date only when that page's content actually changes
const pages: { path: string; lastModified: string }[] = [
  { path: "", lastModified: "2026-10-05" },
  { path: "/services", lastModified: "2026-10-05" },
  { path: "/how-it-works", lastModified: "2026-10-05" },
  { path: "/fees", lastModified: "2026-10-05" },
  { path: "/faq", lastModified: "2026-10-05" },
  { path: "/contact", lastModified: "2026-10-05" },
  { path: "/privacy", lastModified: "2026-10-05" },
  { path: "/terms", lastModified: "2026-10-05" },
];

const SERVICES_UPDATED = "2026-10-05";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(({ path, lastModified }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(lastModified),
    })),
    ...serviceContent.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: new Date(SERVICES_UPDATED),
    })),
  ];
}