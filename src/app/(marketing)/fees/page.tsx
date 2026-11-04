import type { Metadata } from "next";
import Pricing from "@/components/marketing/Pricing";
import FaqList from "@/components/marketing/FaqList";
import { getSupportFee } from "@/lib/admin/supportFee";

export async function generateMetadata(): Promise<Metadata> {
  const { price } = await getSupportFee();
  return {
    title: "Fees",
    description: `Support from ${price} per request. Our fee and any standard service fee are always shown separately, with no hidden charges.`,
  };
}

// Shown until the FAQs load from the dashboard, or if none are published
const fallbackDetails = (price: string) => [
  {
    q: "What does the support fee cover?",
    a: "Our private assistance: reviewing your case, a document checklist, guidance, help with the application where we are authorized, follow-up and updates on WhatsApp.",
  },
  {
    q: "Are standard service fees included?",
    a: "No. Standard service fees, where applicable, are set by the relevant institution and are always separate from our fee.",
  },
  {
    q: `Why “from” ${price}?`,
    a: "Cases differ. Most requests are straightforward, but some take more work. We confirm your exact fee before we start, so there are no surprises.",
  },
  {
    q: "What if my case turns out to be more complex?",
    a: "We explain any additional cost and why it's needed. Work only continues once you have accepted it.",
  },
  {
    q: "What does the guarantee cover?",
    a: "The support service we provide. It does not cover regulatory decisions or processing times, which we do not control. If we fail to provide the agreed support, our written refund terms apply.",
  },
];

export default async function FeesPage() {
  const { price } = await getSupportFee();

  return (
    <main>
      <Pricing as="h1" showLink={false} />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold tracking-[-0.01em]">Good to know</h2>
          <FaqList fallback={fallbackDetails(price)} />
          {/* TODO: link to your written refund terms once published */}
        </div>
      </section>
    </main>
  );
}