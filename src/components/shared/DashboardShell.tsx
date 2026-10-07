"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNav, type DashboardArea } from "../shared/dashboardNav";
import { Sheet, SheetContent, SheetHeader,  SheetTitle } from "../ui/sheet";

export default function DashboardShell({
  area,
  children,
}: {
  area: DashboardArea;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { title, items } = dashboardNav[area];
  const home = items[0].href;

  // "/admin" is only active on itself; other links also match their sub-pages
  const isActive = (href: string) =>
    href === home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav aria-label={title} className="flex flex-col gap-1">
      {items.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-title/40",
              active ? "bg-title font-medium text-white" : "text-ink/75 hover:bg-navy-50 hover:text-title",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <Link href={home} className="flex items-center gap-3">
      <Image src="/logo.png" alt="" width={34} height={34} />
      <span className="leading-tight">
        <span className="block font-semibold text-title">Diaspora Services</span>
        <span className="block text-xs text-ink/55">{title}</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-navy-50/50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-navy-300/40 bg-white px-4 py-5 lg:flex">
        <div className="px-2">{brand}</div>
        <div className="mt-8 flex-1">{nav}</div>
        <Link href="/" className="flex items-center gap-1.5 px-3 text-sm text-ink/60 hover:text-title">
          Back to website <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </aside>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-navy-300/40 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-title hover:bg-navy-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">{brand}</div>

          <div className="ml-auto flex items-center gap-2">
            {/* TODO: user menu (ProfileDialog + Log out) */}
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="sr-only">{title} menu</SheetTitle>
            {brand}
          </SheetHeader>
          <div className="px-4">{nav}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}