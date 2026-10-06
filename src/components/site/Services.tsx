// src/components/site/Services.tsx
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { services } from "@/src/lib/site";

export default function Services({ as: Heading = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="services" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Heading className="text-3xl font-semibold tracking-[-0.01em] sm:text-[2.6rem]">Our services</Heading>
          <p className="mt-3 text-lg text-ink/70">Choose the service you need support with.</p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.href}>
              <Link
                href={service.href}
                className="group flex h-full flex-col rounded-2xl border border-navy-300/50 bg-white p-3 transition-colors hover:border-title/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-title/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy-300/20">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col px-2 pb-3 pt-5">
                  <h3 className="flex items-center gap-1 font-sans text-lg font-semibold text-title">
                    {service.title}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{service.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}