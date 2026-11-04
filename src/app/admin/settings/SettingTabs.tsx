"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../../lib/utils";

const tabs = [
    { label: "COMPANY  PROFILE", href: "/admin/settings/company" },
    { label: "USERS ", href: "/admin/settings/users" },
    { label: "SERVICES ", href: "/admin/settings/services" },
    { label: "FEES ", href: "/admin/settings/fees" },
    { label: "FAQ", href: "/admin/settings/faq" },
    { label: "TESTIMONIES", href: "/admin/settings/testimonies" },
    { label: "ACTIVITY LOGS", href: "/admin/settings/activity-logs" },
];

const SettingsTabs = () => {
    const pathname = usePathname();

    return (
        <nav aria-label="Settings" className="w-full">
            <ul className="flex w-full gap-1 rounded-t-xl bg-[#e5e7f5d7] px-2 py-2">
                {tabs.map((tab) => {
                    const active =
                        pathname === tab.href || pathname.startsWith(`${tab.href}/`);

                    return (
                        <li key={tab.href} className="min-w-0 flex-1">
                            <Link
                                href={tab.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "flex min-h-12 w-full items-center justify-center rounded-lg px-1 py-3 text-center text-sm font-semibold transition-colors sm:px-2 lg:px-4 lg:text-base",
                                    active
                                        ? "bg-white text-title"
                                        : "text-ink/80 hover:text-title",
                                )}
                            >
                                <span className="truncate">{tab.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
export default SettingsTabs