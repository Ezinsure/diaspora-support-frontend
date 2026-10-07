"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Bell, Menu, MessageSquare, Plus, Search, UserRound, X } from "lucide-react";
import { dashboardNav, type DashboardArea } from "./dashboardNav";
import { cn } from "../../../lib/utils";

const greetingFor = (hour: number) =>
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

export default function DashboardShell({
    area,
    userName, // TODO: pass the logged-in user's first name once auth is connected
    children,
}: {
    area: DashboardArea;
    userName?: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [now, setNow] = useState<Date | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const config = dashboardNav[area];

    // Time-based text is set in the browser only (avoids server/client mismatch)
    useEffect(() => setNow(new Date()), []);

    // Ctrl+K / ⌘K focuses the search
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Close the mobile menu when the page changes
    useEffect(() => setMenuOpen(false), [pathname]);

    const isActive = (href: string) =>
        href === config.home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

    const activeItem = config.sections.flatMap((s) => s.items).find((i) => isActive(i.href));
    const onHome = pathname === config.home;

    const heading = onHome
        ? `${now ? greetingFor(now.getHours()) : "Welcome back"}${userName ? `, ${userName}` : ""}`
        : activeItem?.label ?? config.title;

    const subheading =
        onHome && now
            ? now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
            : config.title;

    const sidebar = (
        <div className="flex h-full flex-col">
            <Link href={config.home} className="flex items-center justify-center gap-3 px-3 pt-1">
                <Image src="/logo.png" alt="" width={70} height={30} className="rounded-2xl" />
            </Link>

            <nav aria-label={config.title} className="mt-8 flex-1 space-y-7 overflow-y-auto">
                {config.sections.map((section) => (
                    <div key={section.label}>
                        <p className="px-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink/40">
                            {section.label}
                        </p>
                        <ul className="mt-2 space-y-1">
                            {section.items.map(({ label, href, icon: Icon, badge }) => {
                                const active = isActive(href);
                                return (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            aria-current={active ? "page" : undefined}
                                            className={cn(
                                                "flex items-center gap-3 rounded-xl px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-title/30",
                                                active
                                                    ? "bg-[#F3F4FB]/95 font-medium text-title border-r-4 border-r-title"
                                                    : "text-ink/80 hover:bg-gray-100 hover:text-title",
                                            )}
                                        >
                                            <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-title" : "text-ink/50")} />
                                            {label}
                                            {badge && (
                                                <span className="ml-auto rounded-full bg-clay-600/10 px-2 py-0.5 text-[0.7rem] font-medium text-clay-600">
                                                    {badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <Link
                href="/"
                className="mt-6 flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm text-ink/55 hover:bg-white/60 hover:text-title"
            >
                Back to website <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#EEF1FA] bg-[radial-gradient(900px_500px_at_0%_0%,#D9E5FE_0%,transparent_60%),radial-gradient(800px_450px_at_45%_-10%,#E4DCF6_0%,transparent_60%),radial-gradient(700px_450px_at_100%_5%,#DDF3EE_0%,transparent_55%)] bg-fixed">
            <aside className="fixed inset-y-4 left-4 z-30 hidden w-56 rounded-3xl border border-white bg-white p-6  backdrop-blur-xl lg:block">
                {sidebar}
            </aside>

            {/* Mobile sidebar */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={`${config.title} menu`}>
                    <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-title/30 backdrop-blur-[2px]" />
                    <aside className="absolute inset-y-3 left-3 w-72 rounded-3xl border border-white bg-[#F3F4FB] p-4 shadow-xl">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        {sidebar}
                    </aside>
                </div>
            )}

            <div className="lg:pl-[16rem]">
                {/* Top bar */}
                <header className="sticky top-0 z-20 px-4 pt-3 sm:px-6 lg:pr-8">
                    <div className="flex items-center gap-3 rounded-2xl py-2 lg:py-3">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-title shadow-sm lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="min-w-0">
                            <h1 className="truncate text-xl font-semibold tracking-[-0.01em] sm:text-2xl">{heading}</h1>
                            <p className="truncate text-sm text-ink/55">{subheading}</p>
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                            <IconButton label="Notifications"><Bell className="h-[18px] w-[18px]" /></IconButton>

                            {/* TODO: user menu (profile, log out) */}
                            <IconButton label="Account"><UserRound className="h-[18px] w-[18px]" /></IconButton>
                        </div>
                    </div>
                </header>

                <main className="px-4 pb-5 pt-4 sm:px-6 lg:pr-8">{children}</main>
            </div>
        </div>
    );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <button
            type="button"
            aria-label={label}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-white/80 text-ink/70 shadow-sm transition-colors hover:text-title focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy-300/40"
        >
            {children}
        </button>
    );
}