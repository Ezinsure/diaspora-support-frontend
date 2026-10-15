import { Ban, CheckCircle2, Clock, Inbox, Loader } from "lucide-react";

// Flow: pending -> in_progress -> completed   (cancelled can happen before completed)
export const REQUEST_STATUSES: any[] = [
  {
    key: "pending",
    label: "Pending",
    hint: "Sent by the customer, not started yet",
    icon: Clock,
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
    card: "bg-white",
    iconBox: "bg-amber-100 text-amber-700",
    text: "text-amber-800 uppercase",
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
    text: "text-blue-800 uppercase",
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
    text: "text-emerald-800  uppercase",
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
    text: "text-red-800 uppercase",
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

// Customer can change the request until we start on it
export const canEdit = (r: any) => r.status === "pending";

// Documents can be added while the request is open
export const canUpload = (r: any) => isOpen(r);

// ---------- Quotation (optional) ----------
// Only when the customer asked for one. Otherwise the price is agreed on WhatsApp/phone.
export const hasQuotation = (r: any) => !!r.quotation;
export const wantsQuotation = (r: any) => !!r.quotationRequested;
export const canMakeQuotation = (r: any) => isOpen(r) && !r.payment?.paid;

export const quotationTotal = (items: any[] = []) =>
  items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unitPrice || 0), 0);

// ---------- Payment ----------
// Amount comes from the quotation, or is typed in (price agreed another way)
export const amountDue = (r: any) => (r.quotation ? quotationTotal(r.quotation.items) : Number(r.payment?.amount ?? 0));
export const isPaid = (r: any) => !!r.payment?.paid;
export const canPay = (r: any) => isOpen(r) && !isPaid(r);

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