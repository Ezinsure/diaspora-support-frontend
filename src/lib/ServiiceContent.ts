// src/lib/service-content.ts
// Content for /services/[slug]. Fields marked TODO must be verified before publishing.

export type ServiceContent = {
  slug: string;
  name: string;
  intro: string;
  helpWith: string[];
  official: { label: string; url: string | null }; // url stays null until verified
  prepare: { verified: boolean; items: string[] }; // only shown when verified: true
  governmentFee: string; // e.g. "Set by the institution" or a verified amount
};

export const sharedContent = {
  usefulWhen: [
    "Your schedule is busy and you can't spend time on the process",
    "You're unsure about the requirements",
    "Previous attempts ran into repeated errors",
    "You'd like your documents checked before submitting",
    "You want one dedicated person following your case",
  ],
  includes: [
    "Initial review of your case",
    "A document checklist for your situation",
    "Step-by-step guidance",
    "Application assistance, where we are authorized",
    "Follow-up on your request",
    "Progress updates",
    "Direct WhatsApp access to our team",
  ],
  notIncluded: [
    "Guaranteed government approval",
    "Bypassing any government requirement",
    "Unofficial shortcuts",
    "Preferential treatment",
  ],
};

export const serviceContent: ServiceContent[] = [
  {
    slug: "passport",
    name: "Passport Services",
    intro:
      "Help with passport applications, renewals, replacements and related travel documents, from understanding what's required to following up on your request.",
    helpWith: ["New passport applications", "Renewals", "Replacements", "Related travel documents"],
    official: { label: "Official passport service", url: 'irembo.com' }, // TODO: verified official link
    prepare: { verified: false, items: [] }, // TODO: verified list
    governmentFee: "Set by the institution",
  },
  {
    slug: "birth-certificate",
    name: "Birth Certificate Services",
    intro:
      "Help with requesting a birth certificate, getting certified copies, and correcting or updating an existing record.",
    helpWith: ["New applications", "Certified copies", "Corrections", "Updates to records"],
    official: { label: "Official civil registration service", url: null }, // TODO
    prepare: { verified: false, items: [] }, // TODO
    governmentFee: "Set by the institution",
  },
  {
    slug: "national-id",
    name: "National ID Services",
    intro:
      "Help with national ID applications, replacing a lost or damaged ID, and correcting or updating your details.",
    helpWith: ["New applications", "Replacements", "Corrections", "Updates to your details"],
    official: { label: "Official national ID service", url: null }, // TODO
    prepare: { verified: false, items: [] }, // TODO
    governmentFee: "Set by the institution",
  },
  {
    slug: "notification",
    name: "Notification Services",
    intro:
      "Help with notifications, attestations and other official communications you may need while living abroad.",
    helpWith: ["Notifications", "Attestations", "Other official communications"],
    official: { label: "Official service", url: null }, // TODO
    prepare: { verified: false, items: [] }, // TODO
    governmentFee: "Set by the institution",
  },
];

export const getServiceContent = (slug: string) => serviceContent.find((s) => s.slug === slug);