import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LEGAL } from "@/lib/legal";
 
export type LegalSection = { id: string; title: string; content: React.ReactNode };
 
const LegalPage = ({ title, intro, sections }: { title: string; intro: React.ReactNode; sections: LegalSection[] }) => (
  <>
    <section className="border-b border-navy-300/40 py-14">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink/60">
          <Link href="/" className="hover:text-title">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span aria-current="page" className="text-ink">{title}</span>
        </nav>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.02em] sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-ink/55">Last updated: {LEGAL.lastUpdated}</p>
        <div className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">{intro}</div>
      </div>
    </section>
 
    <section className="py-14 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[240px_1fr]">
        {/* Contents */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">On this page</p>
          <ol className="mt-4 space-y-2 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-2 text-ink/70 hover:text-title">
                  <span className="tabular-nums text-ink/40">{i + 1}.</span> {s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>
 
        {/* Sections */}
        <div className="max-w-3xl space-y-12">
          {sections.map((s, i) => (
            <article key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="text-xl font-semibold text-title sm:text-2xl">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink/80 [&_a]:font-medium [&_a]:text-title [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {s.content}
              </div>
            </article>
          ))}
 
          <div className="rounded-2xl bg-navy-50 p-6 text-sm leading-relaxed text-ink/75">
            Questions about this page? Email us at <a href={`mailto:${LEGAL.email}`} className="font-medium text-title underline underline-offset-4">{LEGAL.email}</a>.
            <br />
            {LEGAL.company} · {LEGAL.registration} · {LEGAL.address}
          </div>
        </div>
      </div>
    </section>
  </>
);
export default LegalPage;