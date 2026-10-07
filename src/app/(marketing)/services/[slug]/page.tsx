import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, ExternalLink, FileText, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getServiceContent, serviceContent, sharedContent } from "@/lib/ServiiceContent";
import { GUARANTEE_TEXT, PRICING, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import FeeBreakdown from "@/components/marketing/FeeBreakdown";
import { cn } from "../../../../../lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return serviceContent.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceContent((await params).slug);
  if (!service) return {};
  return { title: service.name, description: service.intro };
}

export default async function ServicePage({ params }: Props) {
  const service = getServiceContent((await params).slug);
  if (!service) notFound();

  const waLink = whatsappLink(`Hello, I would like support with ${service.name}.`);

  return (
    <main>
      {/* Header */}
      <section className="border-b border-navy-300/40 py-14 lg:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink/60">
            <Link href="/services" className="hover:text-title">Services</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span aria-current="page" className="text-ink">{service.name}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">{service.name}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{service.intro}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.helpWith.map((item) => (
                  <li key={item} className="rounded-full bg-navy-50 px-3.5 py-1.5 text-sm text-title">{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <p className="text-sm text-ink/60">
                Support from <span className="font-semibold text-title">{PRICING.supportFrom}</span> · Government fee separate
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "h-12 gap-2.5 rounded-full bg-green-700 px-7 text-base text-white hover:bg-green-800")}>
                  <WhatsAppIcon className="h-5 w-5" /> Get support on WhatsApp
                </a>
                <Link href="/contact"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-title/30 px-5 text-base text-title hover:border-title hover:bg-white hover:text-title")}>
                  Start my request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Can I do this myself? */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[auto_1fr] lg:gap-14">
          <p className="font-heading text-5xl font-semibold leading-none text-title sm:text-6xl">Yes.</p>
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Can I do this myself?</h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink/75">
              Yes. You can apply directly through the official government channel without using our service.
              We&apos;re here if you&apos;d prefer support.
            </p>
            {service.official.url ? (
              <a href={service.official.url} target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-medium text-title underline underline-offset-4">
                {service.official.label} <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <p className="mt-5 text-sm text-ink/60">Ask us and we&apos;ll point you to the right official channel.</p>
            )}
          </div>
        </div>
      </section>

      {/* When assistance may be useful */}
      <section className="bg-navy-50 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">When our assistance may be useful</h2>
          <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {sharedContent.usefulWhen.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-title text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Included / not included */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-navy-300/50">
          <div className="md:pr-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">What our support includes</h2>
            <ul className="mt-6 space-y-3.5">
              {sharedContent.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-700" strokeWidth={2.5} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:pl-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">What it does not include</h2>
            <ul className="mt-6 space-y-3.5">
              {sharedContent.notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-clay-600" strokeWidth={2.5} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink/60">
              Every request follows the official requirements and process of the relevant institution.
            </p>
          </div>
        </div>
      </section>

      {/* What to prepare */}
      <section className="border-y border-navy-300/40 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">What you should prepare</h2>
          {service.prepare.verified && service.prepare.items.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {service.prepare.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-title" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 leading-relaxed text-ink/75">
              Requirements depend on your situation. After a short conversation, we&apos;ll send you a checklist of
              exactly what you need to prepare.
            </p>
          )}
          {/* <p className="mt-6 text-sm text-ink/60">
            Please don&apos;t send identity documents through our website form. We&apos;ll explain how to share them securely.
          </p> */}
        </div>
      </section>

      {/* Fees */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Fees</h2>
            <p className="mt-3 max-w-md leading-relaxed text-ink/75">
              Our fee and any government fee are always shown separately. We confirm your exact fee before we start,
              and there are no hidden charges.
            </p>
            <p className="mt-6 max-w-md border-l-2 border-title pl-4 text-sm leading-relaxed text-ink/65">{GUARANTEE_TEXT}</p>
          </div>
          <FeeBreakdown caption={`${service.name}: fees`} governmentFee={service.governmentFee} />
        </div>
      </section>
    </main>
  );
}