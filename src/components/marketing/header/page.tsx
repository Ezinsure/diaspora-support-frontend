"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { navLinks, services, WHATSAPP_URL } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "../../../../lib/utils";

const linkBase =
    "relative inline-flex h-9 items-center rounded-md px-3 text-[0.94rem] text-ink/75 transition-colors hover:text-title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-title/40";
const activeLink =
    "font-medium text-title after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[2px] after:rounded-full after:bg-title";

const SiteHeader = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
    const servicesActive = pathname.startsWith("/services");

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 ">
            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
                <Link href="/" className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-title/40">
                    <span className="leading-tight">
                        <span className="block text-[1.05rem] font-semibold text-title">Diaspora Services</span>
                        <span className="block text-[0.8rem] text-ink/60">Support. Guide. Get It Done.</span>
                    </span>
                </Link>

                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="gap-1">
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className={cn(linkBase, isActive("/") && activeLink)}>
                                Home
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger
                                className={cn(
                                    "h-9 bg-transparent px-3 text-[0.94rem] font-normal text-ink/75 hover:bg-transparent hover:text-title data-[state=open]:bg-transparent data-[popup-open]:bg-transparent",
                                    servicesActive && "font-medium text-title",
                                )}
                            >
                                Services
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-72 gap-0.5 p-2">
                                    {services.map(({ title, href, icon: Icon }) => (
                                        <li key={href}>
                                            <NavigationMenuLink
                                                href={href}
                                                className="flex flex-row items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm text-ink transition-colors hover:bg-navy-300/20 focus-visible:bg-navy-300/20"
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy-300/25 text-title">
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                {title}
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {navLinks.map((link) => (
                            <NavigationMenuItem key={link.href}>
                                <NavigationMenuLink href={link.href} className={cn(linkBase, isActive(link.href) && activeLink)}>
                                    {link.label}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "hidden gap-2 rounded-lg bg-green-700 px-5 text-white hover:bg-green-800 sm:inline-flex",
                        )}
                    >
                        <WhatsAppIcon className="h-4 w-4" />
                        Chat on WhatsApp 24/7
                    </a>

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Open menu"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-title hover:bg-navy-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-title/40 lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>


            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="right" className="w-[86vw] max-w-sm">
                    <SheetHeader>
                        <SheetTitle className="text-left text-title">Menu</SheetTitle>
                    </SheetHeader>

                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4" aria-label="Mobile">
                        <Link href="/" onClick={() => setOpen(false)} className={cn("rounded-lg px-3 py-2.5", isActive("/") ? "bg-navy-300/20 font-medium text-title" : "text-ink")}>
                            Home
                        </Link>

                        <p className="mt-3 px-3 text-sm text-ink/55">Services</p>
                        {services.map(({ title, href, icon: Icon }) => (
                            <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-ink hover:bg-navy-300/20">
                                <Icon className="h-4 w-4 text-title" />
                                {title}
                            </Link>
                        ))}

                        <div className="my-3 h-px bg-navy-300/40" />
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn("rounded-lg px-3 py-2.5", isActive(link.href) ? "bg-navy-300/20 font-medium text-title" : "text-ink")}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ size: "lg" }), "w-full gap-2 rounded-lg bg-green-700 text-white hover:bg-green-800")}
                        >
                            <WhatsAppIcon className="h-4 w-4" />
                            Chat on WhatsApp 24/7
                        </a>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
export default SiteHeader;