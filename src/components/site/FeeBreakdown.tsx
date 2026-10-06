// src/components/site/FeeBreakdown.tsx
// Always shows our fee and the government fee as two separate lines.
import { PRICING } from "@/src/lib/site";
import { Building2, Headset } from "lucide-react";

export default function FeeBreakdown({
  supportFee = `From ${PRICING.supportFrom}`,
  governmentFee = "If applicable",
  caption = "Example quote",
}: {
  supportFee?: string;
  governmentFee?: string;
  caption?: string;
}) {
  return (
    <div className="rounded-3xl border border-navy-300/50 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(11,42,99,0.35)] sm:p-8">
      <p className="text-sm text-ink/55">{caption}</p>

      <dl className="mt-5 divide-y divide-dashed divide-navy-300/70">
        <div className="flex items-start gap-4 pb-5">
          <Headset className="mt-0.5 h-5 w-5 shrink-0 text-title" />
          <div className="flex-1">
            <dt className="font-semibold text-title">Private assistance / support fee</dt>
            <dd className="mt-0.5 text-sm text-ink/60">Paid to us for guidance, document checking and follow-up</dd>
          </div>
          <dd className="shrink-0 text-right font-semibold text-title">{supportFee}</dd>
        </div>

        <div className="flex items-start gap-4 pt-5">
          <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-ink/50" />
          <div className="flex-1">
            <dt className="font-semibold text-ink">Government fee</dt>
            <dd className="mt-0.5 text-sm text-ink/60">Set by the relevant institution, separate from our fee</dd>
          </div>
          <dd className="shrink-0 text-right text-ink/70">{governmentFee}</dd>
        </div>
      </dl>
    </div>
  );
}