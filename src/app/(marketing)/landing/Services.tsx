import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { services } from "@/lib/site";
import { cn } from "@/lib/utils";

const Services = () => {
    const CARD_SPAN = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4", "lg:col-span-3", "lg:col-span-3"];
    const WIDE = [true, false, false, true, false, false];
    return (
        <section id="services" className="scroll-mt-14 py-20 lg:py-14">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-semibold tracking-[-0.01em] sm:text-[2.6rem]">Our services</h2>
                        <p className="mt-1 text-lg text-ink/70">Choose the service you need support with.</p>
                    </div>
                    <Link href="/fees" className="inline-flex items-center gap-1.5 font-medium text-title underline-offset-4 hover:underline">
                        See our fees <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <ul className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-6">
                    {services.map((service, i) => {
                        const wide = WIDE[i % WIDE.length];
                        return (
                            <li key={service.href} className={CARD_SPAN[i % CARD_SPAN.length]}>
                                <Link
                                    href={service.href}
                                    className="group relative isolate flex h-full min-h-56 flex-col overflow-hidden rounded-3xl border border-navy-300/50 bg-gradient-to-br from-white via-navy-50/60 to-navy-300/30 p-6 transition-all duration-300  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-title/40 sm:p-7"
                                >
                                    <service.icon
                                        aria-hidden
                                        strokeWidth={1.1}
                                        className={cn(
                                            "absolute -z-10 text-title/[0.02] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105",
                                            wide ? "-bottom-12 -right-6 h-64 w-64" : "-bottom-8 -right-8 h-44 w-44",
                                        )}
                                    />
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-title shadow-sm ring-1 ring-navy-300/20">
                                        <service.icon className="h-6 w-6" strokeWidth={1.6} />
                                    </span>
                                    <div className="mt-auto pt-8">
                                        <h3 className={cn("flex items-center gap-1.5 font-sans font-semibold text-title", wide ? "text-2xl" : "text-lg")}>
                                            {service.title}
                                            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                                        </h3>
                                        <p className={cn("mt-2 leading-relaxed text-ink/70", wide ? "max-w-md text-base" : "max-w-[90%] text-[0.95rem]")}>
                                            {service.description}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
export default Services