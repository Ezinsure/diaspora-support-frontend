import DashboardShell from "@/src/components/shared/DashboardShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell area="admin">{children}</DashboardShell>;
}