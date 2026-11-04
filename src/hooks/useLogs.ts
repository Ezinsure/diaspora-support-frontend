"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LogService } from "@/services/logsService";

export const LOGS_KEY = ["activity-logs"];


export const LOG_ACTIONS = [
  { value: "create", label: "Created", badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  { value: "update", label: "Updated", badge: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  { value: "status", label: "Status", badge: "bg-violet-50 text-violet-700 ring-violet-600/20" },
  { value: "delete", label: "Deleted", badge: "bg-red-50 text-red-700 ring-red-600/20" },
  { value: "payment", label: "Payment", badge: "bg-amber-50 text-amber-800 ring-amber-600/20" },
  { value: "upload", label: "Upload", badge: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  { value: "email", label: "Email", badge: "bg-teal-50 text-teal-700 ring-teal-600/20" },
  { value: "reorder", label: "Reorder", badge: "bg-gray-100 text-gray-700 ring-gray-500/20" },
  { value: "login", label: "Login", badge: "bg-gray-100 text-gray-700 ring-gray-500/20" },
];

export const LOG_ENTITIES = [
  { value: "request", label: "Requests" },
  { value: "customer", label: "Customers" },
  { value: "payment", label: "Payments" },
  { value: "proforma", label: "Proformas" },
  { value: "document", label: "Documents" },
  { value: "service", label: "Services" },
  { value: "service_fee", label: "Fees" },
  { value: "faq", label: "FAQ" },
  { value: "company", label: "Company profile" },
  { value: "user", label: "Users" },
];

export const actionInfo = (action: string) =>
  LOG_ACTIONS.find((a) => a.value === action) ?? { value: action, label: action, badge: "bg-gray-100 text-gray-700 ring-gray-500/20" };

export const entityLabel = (entity: string) => LOG_ENTITIES.find((e) => e.value === entity)?.label ?? entity;

export interface LogItem {
  id: string;
  actorId: string | null;
  actorName: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  summary: string;
  changes: { field: string; from: any; to: any }[];
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

const toLogItem = (l: any): LogItem => ({
  id: l.id,
  actorId: l.actorId ?? null,
  actorName: l.actorName ?? null,
  action: l.action,
  entity: l.entity,
  entityId: l.entityId ?? null,
  summary: l.summary ?? "",
  changes: Array.isArray(l.changes) ? l.changes : [],
  ip: l.ip ?? null,
  userAgent: l.userAgent ?? null,
  createdAt: l.createdAt,
});

export const useActivityLogs = (filters: any = {}) => {
  const params: any = { page: filters.page ?? 1, limit: filters.limit ?? 25 };
  for (const key of ["search", "action", "entity", "entityId", "actorId", "from", "to"]) {
    const v = typeof filters[key] === "string" ? filters[key].trim() : filters[key];
    if (v && v !== "all") params[key] = v;
  }

  return useQuery({
    queryKey: [...LOGS_KEY, params],
    queryFn: () => LogService.getAll(params).then((r) => r.data),
    select: (res: any) => ({
      logs: (res?.data ?? []).map(toLogItem) as LogItem[],
      total: Number(res?.total ?? 0),
      page: Number(res?.page ?? params.page),
      limit: Number(res?.limit ?? params.limit),
      totalPages: Math.max(1, Number(res?.totalPages ?? 1)),
    }),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000, 
  });
};

// ---------- Date helpers ----------

export const kigaliDay = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-CA", { timeZone: "Africa/Kigali" }); // YYYY-MM-DD
};

export const formatLogTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Kigali",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// "status" -> "Status", "amountDue" -> "Amount due"
export const fieldLabel = (field: string) =>
  field.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()).replace(/ ([A-Z])/g, (m) => m.toLowerCase());

// Readable value for the "changes" table
export const showValue = (v: any): string => {
  if (v === null || v === undefined || v === "") return "empty";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.length ? v.map(showValue).join(", ") : "none";
  if (typeof v === "object") {
    const parts = Object.entries(v)
      .filter(([, x]) => x !== null && x !== "")
      .map(([k, x]) => `${fieldLabel(k)}: ${showValue(x)}`);
    return parts.length ? parts.join(" · ") : "empty";
  }
  return String(v);
};