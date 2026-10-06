// src/lib/site.ts — one place for links, services and contact details
import { BellRing, BookUser, FileBadge, IdCard } from "lucide-react";

// TODO: your real WhatsApp number, international format, digits only
export const WHATSAPP_NUMBER = "250700000000";
export const WHATSAPP_DISPLAY = "+250 700 000 000"; // TODO: same number, formatted for reading
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello, I would like help with a service.",
)}`;

export const SUPPORT = {
  // Only set to true if the team can genuinely answer around the clock.
  is24x7: false,
  // TODO: your real hours, or null to hide. Example: "Monday to Saturday, 8:00 to 20:00 (Kigali time)"
  hours: null as string | null,
  // TODO: match the response time you have agreed internally
  // responseTime: "We usually reply within a few hours.",
};

export const WHATSAPP_LABEL = SUPPORT.is24x7
  ? "Chat on WhatsApp 24/7"
  : "Chat on WhatsApp";

export const CONTACT = {
  email: "support@gmail.com", // TODO
  phone: null as string | null, // optional, e.g. "+250 788 000 000"
  // TODO: add the exact address ONLY after the team confirms the formal wording
  address: null as string | null,
  city: "Kigali, Rwanda",
};

// TODO: add the images to /public/images/services/
export const services = [
  {
    title: "Passport Services",
    href: "/services/passport",
    icon: BookUser,
    image: "/images/passpoort.png",
    description: "New application, renewal, replacement and travel documents.",
  },
  {
    title: "Birth Certificate Services",
    href: "/services/birth-certificate",
    icon: FileBadge,
    image: "/images/passpoort.png",
    description: "Application, certified copies, corrections and updates.",
  },
  {
    title: "National ID Services",
    href: "/services/national-id",
    icon: IdCard,
    image: "/images/passpoort.png",
    description: "New application, replacement, corrections and updates.",
  },
  {
    title: "Notification Services",
    href: "/services/notification",
    icon: BellRing,
    image: "/images/passpoort.png",
    description:
      "Notifications, attestations and other official communications.",
  },
];

export const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Fees", href: "/fees" },
  { label: "Contact", href: "/contact" },
];

// WhatsApp link with a custom first message (e.g. for a specific service)
export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const PRICING = {
  // Launch wording: "from", not a fixed price for every service
  supportFrom: "USD 50",
};

export const GUARANTEE_TEXT =
  "Our guarantee applies to the support service we provide, not to the decision or processing time of any government institution. If we fail to provide the agreed support service, our service-fee refund terms will apply.";
