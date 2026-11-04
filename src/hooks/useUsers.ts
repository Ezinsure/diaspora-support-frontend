"use client";

import { useEffect, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { UserService } from "@/services/userService";
import { getErrorMessage } from "@/lib/admin/httpRequest";
import { USER_ROLES } from "@/components/shared/FormValidation";

export const USERS_KEY = ["users"];

export type UserRole = (typeof USER_ROLES)[number];
export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admin" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "user", label: "User" },
];
export type UserStatus = "active" | "deactivated";
export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  names: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string | null;
  passwordSetAt: string | null;
  inviteSent?: boolean;
  createdBy?: { id: string; names: string } | null;
  updatedBy?: { id: string; names: string } | null;
}

export type UserFormValues = Pick<
  AppUser,
  "firstName" | "lastName" | "email" | "phone" | "role" | "status"
>;

const toApiStatus = (s: UserStatus) =>
  s === "deactivated" ? "inactive" : "active";

export const toAppUser = (u: any): AppUser => {
  const parts = String(u?.names ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return {
    id: u.id,
    names: u.names ?? "",
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
    email: u.email ?? "",
    phone: u.phoneNumber ?? "",
    role: u.role,
    status: u.status === "inactive" ? "deactivated" : "active",
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    lastActiveAt: u.lastActiveAt ?? null,
    passwordSetAt: u.passwordSetAt ?? null,
    inviteSent: u.inviteSent,
    createdBy: u.createdBy ?? null,
    updatedBy: u.createdBy ?? null,
  };
};

const toApiUser = (v: Partial<UserFormValues>) => {
  const body: any = {};
  if (v.firstName !== undefined || v.lastName !== undefined) {
    body.names = `${v.firstName ?? ""} ${v.lastName ?? ""}`
      .trim()
      .replace(/\s+/g, " ");
  }
  if (v.email !== undefined) body.email = v.email.trim().toLowerCase();
  if (v.phone !== undefined) body.phoneNumber = v.phone.replace(/[\s()-]/g, "");
  if (v.role !== undefined) body.role = v.role;
  if (v.status !== undefined) body.status = toApiStatus(v.status);
  return body;
};

export const useDebouncedValue = <T>(value: T, delay = 350) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

export const useUsers = (filters: any = {}) => {
  const params: any = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 100,
    sortBy: "createdAt",
    order: "DESC",
  };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.status && filters.status !== "all")
    params.status = toApiStatus(filters.status);
  if (filters.role && filters.role !== "all") params.role = filters.role;

  return useQuery({
    queryKey: [...USERS_KEY, "list", params],
    queryFn: () => UserService.getAll(params).then((r) => r.data),
    select: (res: any) => ({
      users: (res?.data ?? []).map(toAppUser) as AppUser[],
      total: Number(res?.total ?? 0),
      page: Number(res?.page ?? 1),
      totalPages: Number(res?.totalPages ?? 1),
    }),
    placeholderData: keepPreviousData,
  });
};

export const useUserStats = () =>
  useQuery({
    queryKey: [...USERS_KEY, "stats"],
    queryFn: () => UserService.getStats().then((r) => r.data),
    select: (s: any) => ({
      total: Number(s?.total ?? 0),
      active: Number(s?.status?.active ?? 0),
      deactivated: Number(s?.status?.inactive ?? 0),
      role: s?.role ?? {},
    }),
  });

export const useUser = (id?: string | null) =>
  useQuery({
    queryKey: [...USERS_KEY, "one", id],
    queryFn: () =>
      UserService.getOne(id as string).then((r) => toAppUser(r.data)),
    enabled: !!id,
  });

const useRefresh = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: USERS_KEY });
};

export const useCreateUser = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (values: UserFormValues) =>
      UserService.create(toApiUser(values)).then((r) => toAppUser(r.data)),
    onSuccess: (user) => {
      refresh();
      if (user.inviteSent)
        toast.success(
          `${user.firstName} was added. We emailed them a link to set their password.`,
        );
      else
        toast.warning(
          `${user.firstName} was added, but the invitation email wasn't sent. Use "Update password" to send it again.`,
        );
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateUser = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<UserFormValues>;
    }) =>
      UserService.update(id, toApiUser(values)).then((r) => toAppUser(r.data)),
    onSuccess: () => {
      refresh();
      toast.success("User updated");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

// Activate / deactivate
export const useSetUserStatus = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      UserService.setStatus(id, toApiStatus(status)).then((r) =>
        toAppUser(r.data),
      ),
    onSuccess: (user) => {
      refresh();
      toast.success(
        user.status === "active"
          ? `${user.firstName} can access the dashboard again`
          : `${user.firstName} was deactivated`,
      );
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteUser = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (id: string) => UserService.remove(id).then((r) => r.data),
    onSuccess: () => {
      refresh();
      toast.success("User deleted");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};
