"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ServicesService } from "@/services/serviceService";
import { getErrorMessage } from "@/lib/admin/httpRequest";

export const SERVICES_KEY = ["services"];

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  isActive: boolean; 
  createdAt?: string;
  updatedAt?: string;
}

export type ServiceFormValues = Omit<ServiceItem, "id" | "createdAt" | "updatedAt">;

export const toServiceItem = (s: any): ServiceItem => ({
  id: s.id,
  name: s.name ?? "",
  description: s.description ?? "",
  tags: Array.isArray(s.tags) ? s.tags : [],
  isActive: s.isActive !== false,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

const toApiService = (v: Partial<ServiceFormValues>) => {
  const body: any = {};
  if (v.name !== undefined) body.name = v.name.trim();
  if (v.description !== undefined) body.description = v.description.trim() || null;
  if (v.tags !== undefined) body.tags = v.tags.map((t) => t.trim()).filter(Boolean);
  if (v.isActive !== undefined) body.isActive = v.isActive;
  return body;
};

export const useServices = (filters: any = {}) => {
  const params: any = { page: filters.page ?? 1, limit: filters.limit ?? 100, sortBy: "name", order: "ASC" };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.tag && filters.tag !== "all") params.tag = filters.tag;
  if (filters.isActive !== undefined && filters.isActive !== "all") params.isActive = filters.isActive;

  return useQuery({
    queryKey: [...SERVICES_KEY, "list", params],
    queryFn: () => ServicesService.getAll(params).then((r) => r.data),
    select: (res: any) => ({
      services: (res?.data ?? []).map(toServiceItem) as ServiceItem[],
      total: Number(res?.total ?? 0),
      totalPages: Number(res?.totalPages ?? 1),
    }),
    placeholderData: keepPreviousData,
  });
};

export const useServiceTags = () =>
  useQuery({
    queryKey: [...SERVICES_KEY, "tags"],
    queryFn: () => ServicesService.getTags().then((r) => r.data),
    select: (rows: any) => (Array.isArray(rows) ? rows : []).map((r: any) => ({ tag: String(r.tag), count: Number(r.count ?? 0) })),
    staleTime: 60 * 1000,
  });

export const useService = (id?: string | null) =>
  useQuery({
    queryKey: [...SERVICES_KEY, "one", id],
    queryFn: () => ServicesService.getOne(id as string).then((r) => toServiceItem(r.data)),
    enabled: !!id,
  });

const useRefresh = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: SERVICES_KEY });
};

export const useCreateService = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (values: ServiceFormValues) => ServicesService.create(toApiService(values)).then((r) => toServiceItem(r.data)),
    onSuccess: (s) => {
      refresh();
      toast.success(`${s.name} added`);
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateService = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<ServiceFormValues> }) =>
      ServicesService.update(id, toApiService(values)).then((r) => toServiceItem(r.data)),
    onSuccess: () => {
      refresh();
      toast.success("Service updated");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useToggleService = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      ServicesService.update(id, { isActive }).then((r) => toServiceItem(r.data)),
    onSuccess: (s) => {
      refresh();
      toast.success(s.isActive ? `${s.name} is visible on the website` : `${s.name} is hidden from the website`);
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteService = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (id: string) => ServicesService.remove(id).then((r) => r.data),
    onSuccess: () => {
      refresh();
      toast.success("Service deleted");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};