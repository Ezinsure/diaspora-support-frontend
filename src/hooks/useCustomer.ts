"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomerService } from "@/services/customerServices";
import { getErrorMessage } from "@/lib/admin/httpRequest";

export const CUSTOMERS_KEY = ["customers"];

const OPEN = ["pending", "in_progress"];

export interface CustomerRequest {
  id: string;
  reference: string;
  status: string;
  service: string; 
  serviceName: string;
  description: string;
  note: string;
  amountDue: number | null;
  amountPaid: number;
  currency: string;
  createdAt: string;
  proforma: any | null;
}

export interface CustomerRow {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string; 
  country: string | null;
  timezone: string | null;
  createdAt: string;
  // from the list 
  total: number;
  open: number;
  paid: number;
  unpaid: number;
  lastRequestAt: string | null;
  // only on the details 
  requests: CustomerRequest[];
  byStatus: Record<string, number>;
  lastService: string | null;
}

const toRequest = (r: any): CustomerRequest => ({
  id: r.id,
  reference: r.reference,
  status: r.status,
  service: r.serviceName ?? "",
  serviceName: r.serviceName ?? "",
  description: r.description ?? "",
  note: r.description ?? "",
  amountDue: r.amountDue === null || r.amountDue === undefined ? null : Number(r.amountDue),
  amountPaid: Number(r.amountPaid ?? 0),
  currency: r.currency ?? "USD",
  createdAt: r.createdAt,
  proforma: r.proforma ?? null,
});

export const toCustomerRow = (c: any): CustomerRow => {
  const requests: CustomerRequest[] = (c.requests ?? []).map(toRequest);
  const byStatus: Record<string, number> = {};
  for (const r of requests) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;


  const hasList = c.requestCount !== undefined;
  const open = hasList ? Number(c.openCount ?? 0) : requests.filter((r) => OPEN.includes(r.status)).length;
  const paid = hasList ? Number(c.totalPaid ?? 0) : requests.reduce((s, r) => s + r.amountPaid, 0);
  const unpaid = hasList
    ? Number(c.balance ?? 0)
    : requests.filter((r) => OPEN.includes(r.status)).reduce((s, r) => s + Math.max((r.amountDue ?? 0) - r.amountPaid, 0), 0);

  return {
    id: c.id,
    firstName: c.firstName ?? "",
    lastName: c.lastName ?? "",
    name: `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim(),
    email: c.email ?? "",
    phone: c.phone ?? "",
    whatsapp: c.phone ?? "",
    country: c.country ?? null,
    timezone: c.timezone ?? null,
    createdAt: c.createdAt,
    total: hasList ? Number(c.requestCount ?? 0) : requests.length,
    open,
    paid,
    unpaid,
    lastRequestAt: c.lastRequestAt ?? requests[0]?.createdAt ?? null,
    requests,
    byStatus,
    lastService: requests[0]?.serviceName ?? null,
  };
};

const SORT_PARAMS: Record<string, { sortBy: string; order: "ASC" | "DESC" }> = {
  recent: { sortBy: "lastRequestAt", order: "DESC" },
  most: { sortBy: "requestCount", order: "DESC" },
  name: { sortBy: "lastName", order: "ASC" },
  newest: { sortBy: "createdAt", order: "DESC" },
};

export const useDebouncedValue = <T,>(value: T, delay = 350) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};


export const useCustomers = (filters: any = {}) => {
  const params: any = { page: filters.page ?? 1, limit: filters.limit ?? 25, ...(SORT_PARAMS[filters.sort ?? "recent"] ?? SORT_PARAMS.recent) };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.activity && filters.activity !== "all") params.activity = filters.activity;

  return useQuery({
    queryKey: [...CUSTOMERS_KEY, "list", params],
    queryFn: () => CustomerService.getAll(params).then((r) => r.data),
    select: (res: any) => ({
      customers: (res?.data ?? []).map(toCustomerRow) as CustomerRow[],
      total: Number(res?.total ?? 0),
      page: Number(res?.page ?? 1),
      totalPages: Number(res?.totalPages ?? 1),
    }),
    placeholderData: keepPreviousData,
  });
};

// Find existing customers
export const useCustomerLookup = (term: string, enabled = true) => {
  const q = term.trim();
  return useQuery({
    queryKey: [...CUSTOMERS_KEY, "lookup", q.toLowerCase()],
    queryFn: () => CustomerService.getAll({ search: q, limit: 5, page: 1, sortBy: "lastRequestAt", order: "DESC" }).then((r) => r.data),
    select: (res: any) => (res?.data ?? []).map(toCustomerRow) as CustomerRow[],
    enabled: enabled && q.length >= 3,
    staleTime: 30_000,
  });
};

export const useCustomerStats = () =>
  useQuery({
    queryKey: [...CUSTOMERS_KEY, "stats"],
    queryFn: () => CustomerService.getStats().then((r) => r.data),
    select: (s: any) => ({
      total: Number(s?.total ?? 0),
      active: Number(s?.active ?? 0),
      newThisMonth: Number(s?.newThisMonth ?? 0),
      totalPaid: Number(s?.totalPaid ?? 0),
    }),
  });

// One customer + all their requests
export const useCustomer = (id?: string | null) =>
  useQuery({
    queryKey: [...CUSTOMERS_KEY, "one", id],
    queryFn: () => CustomerService.getOne(id as string).then((r) => toCustomerRow(r.data)),
    enabled: !!id,
  });

//  Mutations 

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Record<string, unknown> }) => CustomerService.update(id, values).then((r) => toCustomerRow(r.data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      qc.invalidateQueries({ queryKey: ["requests"] }); 
      toast.success("Customer updated");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};