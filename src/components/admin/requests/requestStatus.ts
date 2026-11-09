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

// Money 
export const quotationTotal = (items: any[] = []) =>
  items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unitPrice || 0), 0);

export const hasQuotation = (r: any) => !!r?.quotation;

export const amountDue = (r: any) =>
  r?.quotation ? Number(r.quotation.total ?? quotationTotal(r.quotation.items)) : 0;

export const balanceOf = (r: any) => Math.max(amountDue(r) - Number(r?.amountPaid ?? 0), 0);

export const currencyOf = (r: any) => r?.quotation?.currency ?? r?.currency ?? "USD";

export const isPaid = (r: any) => !!r?.payment?.paid;

export const canEdit = (r: any) => isOpen(r) && !isPaid(r);

export const canUpload = (r: any) => isOpen(r);

export const canPay = (r: any) => isOpen(r) && hasQuotation(r) && balanceOf(r) > 0;

export const hasReceipt = (r: any) => isPaid(r);

export const formatMoney = (n: number, currency = "USD") =>
  `${currency} ${Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Kigali",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDay = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short", year: "numeric" }) : "";

// YYYY-MM-DD, n days from today (Kigali)
export const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-CA", { timeZone: "Africa/Kigali" });
};