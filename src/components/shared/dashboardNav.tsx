import {
  FileText,
  FolderLock,
  Inbox,
  LayoutDashboard,
  Receipt,
  Settings,
  UserCog,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };
export type DashboardArea = "portal" | "admin";

export const dashboardNav: Record<DashboardArea, { title: string; items: NavItem[] }> = {
  portal: {
    title: "My account",
    items: [
      { label: "Overview", href: "/portal", icon: LayoutDashboard },
      { label: "My requests", href: "/portal/requests", icon: FileText },
      { label: "Documents", href: "/portal/documents", icon: FolderLock },
      { label: "Payments", href: "/portal/payments", icon: Receipt },
      { label: "Profile", href: "/portal/profile", icon: UserRound },
    ],
  },
  admin: {
    title: "Admin",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Requests", href: "/admin/requests", icon: Inbox },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Payments", href: "/admin/payments", icon: Receipt },
      { label: "Staff", href: "/admin/users", icon: UserCog },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
};