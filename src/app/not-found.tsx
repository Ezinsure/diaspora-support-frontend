// src/app/not-found.tsx — shown for any unknown URL (real 404 status)
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL, services } from "../lib/site";
import { buttonVariants } from "../components/ui/button";
import { WhatsAppIcon } from "../components/icons/WhatsAppIcon";

export const metadata: Metadata = {
    title: "Page not found",
    robots: { index: false, follow: true },
};

const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
                <Link href="/" className="inline-flex items-center gap-3">
                    <Image src="/logo.png" alt="" width={40} height={40} />
                    <span className="text-lg font-semibold text-title">Diaspora Services</span>
                </Link>
            </header>

            <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-16 sm:px-8">
                <p className="font-heading text-6xl font-semibold text-navy-300">404</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">
                    We couldn&apos;t find that page
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-ink/70">
                    The link may be old or mistyped. These pages might help, or message us and we&apos;ll point you in
                    the right direction.
                </p>

                <ul className="mt-8 divide-y divide-navy-300/50 border-y border-navy-300/50">
                    {[{ title: "Home", href: "/" }, ...services, { title: "Fees", href: "/fees" }, { title: "Contact us", href: "/contact" }].map(
                        (link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="flex items-center justify-between py-3 text-ink hover:text-title">
                                    {link.title}
                                    <span aria-hidden className="text-ink/40">›</span>
                                </Link>
                            </li>
                        ),
                    )}
                </ul>

                <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        buttonVariants({ size: "lg" }),
                        "mt-10 h-12 w-fit gap-2.5 rounded-full bg-green-700 px-7 text-base text-white hover:bg-green-800",
                    )}
                >
                    <WhatsAppIcon className="h-5 w-5" />
                    Ask us on WhatsApp
                </a>
            </main>
        </div>
    );
}
export default NotFound;