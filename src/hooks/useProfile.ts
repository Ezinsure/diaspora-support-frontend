"use client";

import { useMemo } from "react";
import { hasRole, useMe, type AuthRole, type AuthUser } from "@/hooks/useAuth";

export interface Profile extends AuthUser {
    firstName: string;
    lastName: string;
    initials: string;
    phone: string;
    roleLabel: string;
}

export const ROLE_LABELS: Record<AuthRole, string> = {
    dev: "Developer",
    admin: "Admin",
    hr: "HR",
    finance: "Finance",
    staff: "Staff",
    user: "User",
};

export const toProfile = (u: AuthUser): Profile => {
    const parts = (u.names ?? "").trim().split(/\s+/).filter(Boolean);
    return {
        ...u,
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" "),
        initials: ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?",
        phone: u.phoneNumber ?? "",
        roleLabel: ROLE_LABELS[u.role] ?? u.role,
    };
};

export const useProfile = () => {
    const me = useMe();
    const profile = useMemo(() => (me.data ? toProfile(me.data) : null), [me.data]);
    return { ...me, profile };
};

export const useCan = (...roles: AuthRole[]) => hasRole(useMe().data, ...roles);

export const useIsDev = () => useMe().data?.role === "dev";