import type { Metadata } from "next";
import { PRICING } from "@/src/lib/site";
import Pricing from "@/src/components/marketing/Pricing";

export const metadata: Metadata = {
  title: "Fees",
  description: `Support from ${PRICING.supportFrom} per request. Our fee and any government fee are always shown separately, with no hidden charges.`,
};

const details = [
  {
    q: "What does the support fee cover?",
    a: "Our private assistance: reviewing your case, a document checklist, guidance, help with the application where we are authorized, follow-up and updates on WhatsApp.",
  },
  {
    q: "Is the government fee included?",
    a: "No. Government fees, where applicable, are set by the relevant institution and are always separate from our fee.",
  },
  {
    q: "Why “from” USD 50?",
    a: "Cases differ. Most requests are straightforward, but some take more work. We confirm your exact fee before we start, so there are no surprises.",
  },
  {
    q: "What if my case turns out to be more complex?",
    a: "We explain any additional cost and why it's needed. Work only continues once you have accepted it.",
  },
  {
    q: "What does the guarantee cover?",
    a: "The support service we provide. It does not cover government decisions or processing times, which we do not control. If we fail to provide the agreed support, our written refund terms apply.",
  },
];

export default function FeesPage() {
  return (
    <main>
      <Pricing as="h1" showLink={false} />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold tracking-[-0.01em]">Good to know</h2>
          <dl className="mt-8 divide-y divide-navy-300/50 border-y border-navy-300/50">
            {details.map(({ q, a }) => (
              <div key={q} className="py-6">
                <dt className="text-lg font-semibold text-title">{q}</dt>
                <dd className="mt-2 leading-relaxed text-ink/75">{a}</dd>
              </div>
            ))}
          </dl>
          {/* TODO: link to your written refund terms once published */}
        </div>
      </section>
    </main>
  );
}