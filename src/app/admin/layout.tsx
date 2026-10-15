import DashboardShell from "@/components/shared/DashboardShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

const AdminLayout=({ children }: { children: React.ReactNode })=> {
  return <DashboardShell area="admin">{children}</DashboardShell>;
}
export default AdminLayout