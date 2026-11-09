"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ServiceFeeService } from "@/services/feesService";
import { getErrorMessage } from "@/lib/admin/httpRequest";

export const FEES_KEY = ["service-fees"];

export const CURRENCIES = ["USD", "RWF", "EUR", "GBP", "CAD"];

export interface ServiceFeeItem {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  isActive: boolean;
  serviceId: string | null; 
  serviceName: string | null;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: { id: string; names: string } | null;
}

export type ServiceFeeFormValues = {
  name: string;
  amount: number;
  currency: string;
  description: string;
  isActive: boolean;
  serviceId: string | null;
};

// ---------- Helpers ----------

export const formatFee = (amount: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "RWF" ? 0 : 2,
      maximumFractionDigits: currency === "RWF" ? 0 : 2,
    }).format(Number(amount ?? 0));
  } catch {
    return `${currency} ${Number(amount ?? 0).toLocaleString("en-US")}`;
  }
};

export const toFeeItem = (f: any): ServiceFeeItem => ({
  id: f.id,
  name: f.name ?? "",
  amount: Number(f.amount ?? 0),
  currency: f.currency ?? "USD",
  description: f.description ?? "",
  isActive: f.isActive !== false,
  serviceId: f.serviceId ?? null,
  serviceName: f.service?.name ?? null,
  createdAt: f.createdAt,
  updatedAt: f.updatedAt,
  updatedBy: f.updatedBy ?? null,
});

const toApiFee = (v: Partial<ServiceFeeFormValues>) => {
  const body: any = {};
  if (v.name !== undefined) body.name = v.name.trim();
  if (v.amount !== undefined) body.amount = Math.round(Number(v.amount) * 100) / 100;
  if (v.currency !== undefined) body.currency = v.currency.toUpperCase();
  if (v.description !== undefined) body.description = v.description.trim() || null;
  if (v.isActive !== undefined) body.isActive = v.isActive;
  if (v.serviceId !== undefined) body.serviceId = v.serviceId || null;
  return body;
};

export const useServiceFees = (filters: any = {}) => {
  const params: any = { page: 1, limit: 100, sortBy: filters.sortBy ?? "amount", order: filters.order ?? "ASC" };
  if (filters.serviceId && filters.serviceId !== "all") params.serviceId = filters.serviceId;
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.isActive !== undefined && filters.isActive !== "all") params.isActive = filters.isActive;

  return useQuery({
    queryKey: [...FEES_KEY, "list", params],
    queryFn: () => ServiceFeeService.getAll(params).then((r) => r.data),
    select: (res: any) => ({
      fees: (res?.data ?? []).map(toFeeItem) as ServiceFeeItem[],
      total: Number(res?.total ?? 0),
    }),
    placeholderData: keepPreviousData,
  });
};

export const useServiceFee = (id?: string | null) =>
  useQuery({
    queryKey: [...FEES_KEY, "one", id],
    queryFn: () => ServiceFeeService.getOne(id as string).then((r) => toFeeItem(r.data)),
    enabled: !!id,
  });

const useRefresh = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: FEES_KEY });
};

export const useCreateServiceFee = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (values: ServiceFeeFormValues) => ServiceFeeService.create(toApiFee(values)).then((r) => toFeeItem(r.data)),
    onSuccess: (fee) => {
      refresh();
      toast.success(`${fee.name} added`);
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateServiceFee = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<ServiceFeeFormValues> }) =>
      ServiceFeeService.update(id, toApiFee(values)).then((r) => toFeeItem(r.data)),
    onSuccess: () => {
      refresh();
      toast.success("Fee updated");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useToggleServiceFee = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      ServiceFeeService.update(id, { isActive }).then((r) => toFeeItem(r.data)),
    onSuccess: (fee) => {
      refresh();
      toast.success(fee.isActive ? `${fee.name} is active` : `${fee.name} is turned off`);
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteServiceFee = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (id: string) => ServiceFeeService.remove(id).then((r) => r.data),
    onSuccess: () => {
      refresh();
      toast.success("Fee deleted");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};