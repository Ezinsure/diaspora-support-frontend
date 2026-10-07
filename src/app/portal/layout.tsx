import DashboardShell from "@/src/components/shared/DashboardShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "My account", template: "%s | My account" },
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell area="portal">{children}</DashboardShell>;
}