import {
  CircleHelp,
  FileText,
  FolderLock,
  Inbox,
  LayoutDashboard,
  Receipt,
  Settings,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string; // small label on the right, e.g. "New" or a count
};
export type NavSection = { label: string; items: NavItem[] };
export type DashboardArea = "portal" | "admin";

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
  portal: {
    title: "My account",
    home: "/portal",
    searchPlaceholder: "Search your requests…",
    action: { label: "New request", href: "/portal/requests/new" },
    sections: [
      {
        label: "Menu",
        items: [
          { label: "Overview", href: "/portal", icon: LayoutDashboard },
          { label: "My requests", href: "/portal/requests", icon: FileText },
          { label: "Documents", href: "/portal/documents", icon: FolderLock },
          { label: "Payments", href: "/portal/payments", icon: Receipt },
        ],
      },
      {
        label: "Account",
        items: [
          { label: "Profile", href: "/portal/profile", icon: UserRound },
        ],
      },
    ],
  },
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
          { label: "Payments", href: "/admin/payments", icon: Receipt },
        ],
      },
      {
        label: "System",
        items: [
          { label: "Settings", href: "/admin/settings", icon: Settings },
        ],
      },
    ],
  },
};