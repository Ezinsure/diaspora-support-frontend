import {
  Landmark,
  IdCard,
  Users,
  Fingerprint,
  Stamp,
  Plane,
} from "lucide-react";

export const WHATSAPP_NUMBER = "250794766463";
export const WHATSAPP_DISPLAY = "+250 794 766 463";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello! I need help obtaining a document and would like you to handle it for me. Could you assist?",
)}`;

export const SUPPORT = {
  is24x7: true,
  hours: null as string | null,
};

export const WHATSAPP_LABEL = SUPPORT.is24x7
  ? "Chat on WhatsApp 24/7"
  : "Chat on WhatsApp";

export const CONTACT = {
  email: "diaspora@solektra.co",
  phone: null as string | null,
  address: "KABC 6th Floor ",
  city: "Kigali",
};

export const services = [
  {
    title: "Immigration And Emigration Services",
    href: "/services/immigration-and-emigration",
    icon: Plane,
    description: "e-Passports, laissez-passer and Rwandan nationality.",
  },
  {
    title: "Family Services",
    href: "/services/family",
    icon: Users,
    description:
      "Birth, marriage, divorce, death and other civil status certificates.",
  },
  {
    title: "Identification Services",
    href: "/services/identification-documents",
    icon: IdCard,
    description:
      "National ID applications, replacements, corrections and identity certificates.",
  },
  {
    title: "Criminal Record and Investigation",
    href: "/services/criminal-record-and-investigation",
    icon: Fingerprint,
    description:
      "Criminal record, lost and theft, and fingerprint certificates.",
  },
  {
    title: "Notarisation And Gazette Services",
    href: "/services/notarisation-and-gazette",
    icon: Stamp,
    description: "Notary services and publications in the Official Gazette.",
  },
  {
    title: "Foreign Affairs Consular Services",
    href: "/services/foreign-affairs-consular-services",
    icon: Landmark,
    description: "Legalization of documents for use abroad or in Rwanda.",
  },
];

export const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Fees", href: "/fees" },
  { label: "Faq", href: "/fees#faq" },
  { label: "Contact", href: "/contact" },
];

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const PRICING = {
  supportFeeId: process.env.NEXT_PUBLIC_SUPPORT_FEE_ID ?? "",
  fallback: { amount: 50, currency: "USD" },
  revalidateSeconds: 100,
  fromLabel: "from",
  unitLabel: "per request",
};

export const formatMoney = (amount: number, currency: string) =>
  `${currency} ${Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export const FALLBACK_PRICE = formatMoney(
  PRICING.fallback.amount,
  PRICING.fallback.currency,
);

export const GUARANTEE_TEXT =
  "Our guarantee applies to the support service we provide, not to the decision or processing time of any official designated institution. If we fail to provide the agreed support service, our service-fee refund terms will apply.";

export const SITE_URL = "https://diaspora.solektra.co/";
