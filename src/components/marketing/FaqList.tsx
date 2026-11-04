"use client";

import { usePublishedFaqs } from "@/hooks/useFaqs";

type Item = { q: string; a: string };

export default function FaqList({ fallback = [] }: { fallback?: Item[] }) {
  const { data: faqs = [], isLoading, isError } = usePublishedFaqs();

  const items: Item[] = !isLoading && !isError && faqs.length > 0 ? faqs.map((f) => ({ q: f.question, a: f.answer })) : fallback;

  if (isLoading && fallback.length === 0) {
    return (
      <div className="mt-8 space-y-4" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-navy-50" />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <dl className="mt-8 divide-y divide-navy-300/50 border-y border-navy-300/50">
      {items.map(({ q, a }) => (
        <div key={q} className="py-6">
          <dt className="text-lg font-semibold text-title">{q}</dt>
          <dd className="mt-2 whitespace-pre-line leading-relaxed text-ink/75">{a}</dd>
        </div>
      ))}
    </dl>
  );
}