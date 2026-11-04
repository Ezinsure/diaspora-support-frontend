import { Inbox, LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react";
import { hasRole, type AuthRole, type AuthUser } from "@/hooks/useAuth";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  roles?: AuthRole[];
};
export type NavSection = { label: string; items: NavItem[] };
export type DashboardArea = "admin";

export const SETTINGS_ROLES: AuthRole[] = ["admin", "hr", "finance"];

export const dashboardNav: Record<
  DashboardArea,
  {
    title: string;
    home: string;
    searchPlaceholder: string;
    action: { label: string; href: string };
    sections: NavSection[];
  }
> = {
  admin: {
    title: "Admin",
    home: "/admin",
    searchPlaceholder: "Search requests, customers…",
    action: { label: "Add customer", href: "/admin/customers/new" },
    sections: [
      {
        label: "Menu",
        items: [
          { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
          { label: "Requests", href: "/admin/requests", icon: Inbox },
          { label: "Customers", href: "/admin/customers", icon: Users },
        ],
      },
      {
        label: "System",
        items: [{ label: "Settings", href: "/admin/settings", icon: Settings, roles: SETTINGS_ROLES }],
      },
    ],
  },
};

export const visibleSections = (sections: NavSection[], user: AuthUser | null | undefined) =>
  sections
    .map((s) => ({ ...s, items: s.items.filter((i) => !i.roles || hasRole(user, ...i.roles)) }))
    .filter((s) => s.items.length > 0);