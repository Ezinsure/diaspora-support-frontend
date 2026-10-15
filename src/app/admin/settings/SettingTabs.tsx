"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../../lib/utils";

const tabs = [
    { label: "COMPANY  PROFILE", href: "/admin/settings/company" },
    { label: "USERS ", href: "/admin/settings/users" },
    { label: "SERVICES & FEES", href: "/admin/settings/services" },
    { label: "FAQ", href: "/admin/settings/faq" },
];

const SettingsTabs = () => {
    const pathname = usePathname();

    return (
        <nav aria-label="Settings" className="overflow-x-auto  px-4">
            <ul className="flex min-w-max gap-3 bg-white rounded-b-xl px-4 py-2">
                {tabs.map((tab) => {
                    const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                    return (
                        <li key={tab.href}>
                            <Link
                                href={tab.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "relative inline-flex h-8 items-center px-4 text-sm transition-colors",
                                    active
                                        ? "font-medium text-title bg-[#F3F4FB]/85 rounded-lg  after:rounded-full after:bg-title"
                                        : "text-ink/80 hover:text-title font-medium",
                                )}
                            >
                                {tab.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
export default SettingsTabs