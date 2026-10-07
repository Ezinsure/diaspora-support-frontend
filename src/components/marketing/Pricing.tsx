import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { GUARANTEE_TEXT, PRICING } from "@/lib/site";
import FeeBreakdown from "./FeeBreakdown";

const promises = [
  {
    title: "No hidden charges",
    text: "You see what you pay before we start.",
  },
  {
    title: "Complex cases agreed first",
    text: "If an unusually complex case needs extra work, we explain the cost and you decide before anything proceeds.",
  },
];

export default function Pricing({
  as: Heading = "h2",
  showLink = true,
}: {
  as?: "h1" | "h2";
  showLink?: boolean;
}) {
  return (
    <section id="pricing" className="scroll-mt-24 bg-navy-50 py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Heading className="text-3xl font-semibold tracking-[-0.01em] sm:text-[2.6rem]">
              Clear, simple pricing
            </Heading>
            <p className="mt-6 font-heading text-3xl font-semibold text-title sm:text-3.3xl">
              <span className="text-2xl font-normal text-ink/60 sm:text-2.5xl">from </span>
              {PRICING.supportFrom}
              <span className="text-2xl font-normal text-ink/60 sm:text-2.5xl"> per request</span>
            </p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/70">
              The exact fee depends on your case. We confirm it with you before any work begins.
            </p>

            <ul className="mt-8 space-y-5">
              {promises.map((p) => (
                <li key={p.title} className="border-l-2 border-title pl-4">
                  <p className="font-semibold text-title">{p.title}</p>
                  <p className="mt-1 leading-relaxed text-ink/70">{p.text}</p>
                </li>
              ))}
            </ul>

            {showLink && (
              <Link
                href="/fees"
                className="mt-8 inline-flex items-center gap-1.5 font-medium text-title underline-offset-4 hover:underline"
              >
                More about our fees <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Two separate lines */}
          <div>
            <FeeBreakdown />
            <p className="mt-4 px-2 text-sm text-ink/60">
              Our fee and any government fee are always shown as two separate lines.
            </p>
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-14 flex gap-4 border-t border-navy-300/60 pt-8">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-title" />
          <div>
            <p className="font-semibold text-title">Our guarantee</p>
            <p className="mt-1 max-w-3xl leading-relaxed text-ink/70">{GUARANTEE_TEXT}</p>
          </div>
        </div>
      </div>
    </section>
  );
}