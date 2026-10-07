// src/lib/mock/settings.ts — sample data for the design phase.
// TODO: replace with API data once the backend is connected.

export type Company = {
  name: string;
  about: string;
  logo: string | null;
  website: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  address: string;
  city: string;
  country: string;
};

export const mockCompany: Company = {
  name: "Diaspora Services",
  about:
    "A private company providing optional professional assistance to Rwandans abroad with selected government-service processes.",
  logo: null,
  website: "https://www.example.com",
  email: "hello@example.com",
  phone: "+250 788 000 000",
  whatsapp: "+250 788 000 000",
  linkedin: "diaspora-services",
  address: "",
  city: "Kigali",
  country: "Rwanda",
};

export type UserRole = "admin" | "staff";
export type UserStatus = "active" | "invited" | "deactivated";

export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastActiveAt: string | null;
};

export const mockUsers: AppUser[] = [
  { id: "u1", firstName: "Aline", lastName: "Uwase", email: "aline@example.com", phone: "+250 788 123 456", role: "admin", status: "active", createdAt: "2026-06-02T08:00:00Z", lastActiveAt: "2026-10-06T09:24:00Z" },
  { id: "u2", firstName: "Eric", lastName: "Mugisha", email: "eric@example.com", phone: "+250 788 234 567", role: "staff", status: "active", createdAt: "2026-07-14T10:30:00Z", lastActiveAt: "2026-10-05T16:02:00Z" },
  { id: "u3", firstName: "Diane", lastName: "Ingabire", email: "diane@example.com", phone: "+250 788 345 678", role: "staff", status: "invited", createdAt: "2026-09-28T12:00:00Z", lastActiveAt: null },
  { id: "u4", firstName: "Patrick", lastName: "Habimana", email: "patrick@example.com", phone: "+250 788 456 789", role: "staff", status: "deactivated", createdAt: "2026-05-20T07:45:00Z", lastActiveAt: "2026-08-11T11:10:00Z" },
];

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  subdescription: string;
  tags: string[];
};

export const mockServices: ServiceItem[] = [
  { id: "s1", name: "Passport Services", description: "Help with passport applications, renewals and replacements.", subdescription: "New application, renewal, replacement and travel documents.", tags: ["New application", "Renewal", "Replacement"] },
  { id: "s2", name: "Birth Certificate Services", description: "Help with birth certificates, certified copies and corrections.", subdescription: "Application, certified copies, corrections and updates.", tags: ["Certified copies", "Corrections"] },
  { id: "s3", name: "National ID Services", description: "Help with national ID applications, replacements and updates.", subdescription: "New application, replacement, corrections and updates.", tags: ["New application", "Replacement"] },
  { id: "s4", name: "Notification Services", description: "Help with notifications, attestations and official communications.", subdescription: "Notifications, attestations and other official communications.", tags: ["Attestations"] },
];

export type StandardFee = { serviceId: string; amount: number; isStartingPrice: boolean };
export type OtherFee = {
  id: string;
  name: string;
  description: string;
  pricing: "fixed" | "negotiable";
  amount: number | null;
};

export const mockStandardFees: StandardFee[] = mockServices.map((s) => ({
  serviceId: s.id,
  amount: 50,
  isStartingPrice: true,
}));

export const mockOtherFees: OtherFee[] = [
  { id: "f1", name: "Complex case support", description: "Additional work for unusually complex cases, agreed with the customer before work continues.", pricing: "negotiable", amount: null },
  { id: "f2", name: "Express follow-up", description: "Priority follow-up and more frequent updates.", pricing: "fixed", amount: 20 },
];

export type FaqItem = { id: string; question: string; answer: string };

export const mockFaqs: FaqItem[] = [
  { id: "q1", question: "Is this a government website?", answer: "No. We are an independent private company. Our services are optional, and you can always apply directly through official channels." },
  { id: "q2", question: "How much does your support cost?", answer: "Support starts from USD 50 per request. Government fees, where applicable, are separate from our fee." },
  { id: "q3", question: "Can you guarantee approval?", answer: "No. Decisions and processing times remain with the relevant government institution. Our guarantee applies to the support service we provide." },
];