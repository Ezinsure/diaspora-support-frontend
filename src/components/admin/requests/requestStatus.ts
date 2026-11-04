import { Ban, CheckCircle2, Clock, Inbox, Loader } from "lucide-react";

export const REQUEST_STATUSES: any[] = [
  {
    key: "pending",
    label: "Pending",
    hint: "New, or still talking to the customer",
    icon: Clock,
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
    card: "bg-white",
    iconBox: "bg-amber-100 text-amber-700",
    text: "text-amber-800",
  },
  {
    key: "in_progress",
    label: "In progress",
    hint: "We are working on it",
    icon: Loader,
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
    card: "bg-white",
    iconBox: "bg-blue-100 text-blue-700",
    text: "text-blue-800",
  },
  {
    key: "completed",
    label: "Completed",
    hint: "Done",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
    card: "bg-white",
    iconBox: "bg-emerald-100 text-emerald-700",
    text: "text-emerald-800",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    hint: "Stopped before completion",
    icon: Ban,
    badge: "bg-red-50 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
    card: "bg-white",
    iconBox: "bg-red-100 text-red-700",
    text: "text-red-800",
  },
];

export const TOTAL_CARD = {
  key: "all",
  label: "Created",
  hint: "All requests",
  icon: Inbox,
  card: "border-gray-200 bg-white",
  iconBox: "bg-primary/10 text-primary",
  text: "text-gray-900",
};

export const statusInfo = (key: string) =>
  REQUEST_STATUSES.find((s: any) => s.key === key) ?? {
    key,
    label: String(key).replace(/_/g, " "),
    badge: "bg-gray-100 text-gray-700 ring-gray-500/20",
    dot: "bg-gray-400",
  };

export const CLOSED_STATUSES = ["completed", "cancelled"];
export const isOpen = (r: any) => !CLOSED_STATUSES.includes(r.status);

// ---------- Money ----------
export const quotationTotal = (items: any[] = []) =>
  items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unitPrice || 0), 0);

// What the customer has to pay: the quotation total, or the amount agreed on the phone/WhatsApp
export const amountDue = (r: any) =>
  r.quotationRequested && r.quotation ? quotationTotal(r.quotation.items) : Number(r.agreedAmount ?? 0);

export const currencyOf = (r: any) => r.quotation?.currency ?? r.currency ?? "RWF";

export const isPaid = (r: any) => !!r.payment?.paid;

// ---------- What can be done ----------
// Details, amount and quotation can change until the customer pays
export const canEdit = (r: any) => isOpen(r) && !isPaid(r);

// Documents can be added while the request is open
export const canUpload = (r: any) => isOpen(r);

// Pay once we told them how much (amount or quotation is set)
export const canPay = (r: any) => isOpen(r) && !isPaid(r) && amountDue(r) > 0;

export const hasQuotation = (r: any) => !!(r.quotationRequested && r.quotation);

// Receipt: available after payment, printed / sent when the customer asks
export const hasReceipt = (r: any) => isPaid(r);

export const SERVICES = [
  "Passport application",
  "Driving licence",
  "Visa application",
  "Business registration",
  "Land title",
  "Other",
];

export const formatMoney = (n: number, currency = "RWF") => `${currency} ${Number(n ?? 0).toLocaleString()}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Kigali",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short", year: "numeric" });

// YYYY-MM-DD, n days from today (Kigali)
export const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-CA", { timeZone: "Africa/Kigali" });
};