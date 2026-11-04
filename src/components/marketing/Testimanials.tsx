import { MapPin, Quote, Star } from "lucide-react";

/**
 * Customer stories for the landing page.
 * Fields match the "Success stories" form in the dashboard.
 * Only publish stories from real customers who agreed to share them.
 */
export type Story = {
    id: string;
    customerName: string;
    country?: string | null;
    service?: string | null;
    title: string;
    story: string;
    rating?: number | null; // 1–5
    storyDate?: string | null; // "2026-09-14"
    photoUrl?: string | null;
};

// 
export const PREVIEW_STORIES: Story[] = [
    {
        id: "p1",
        customerName: "Customer A",
        country: "Belgium",
        service: "Passport renewal",
        title: "Sorted without flying home",
        story: "Placeholder text. A real customer's words go here: what they needed, how the follow-up went, and how it felt to have it handled from abroad.",
        rating: 5,
        storyDate: "2026-09-14",
    },
    {
        id: "p2",
        customerName: "Customer B",
        country: "Canada",
        service: "Birth certificate",
        title: "Clear steps from day one",
        story: "Placeholder text. Keep real stories short and specific: two to four sentences read best.",
        rating: 5,
        storyDate: "2026-08-02",
    },
    {
        id: "p3",
        customerName: "Customer C",
        country: "United States",
        service: "Land title transfer",
        title: "Updates every step",
        story: "Placeholder text. Mention the service and the outcome, never personal or document details.",
        rating: 4,
        storyDate: "2026-07-21",
    },
    {
        id: "p4",
        customerName: "Customer D",
        country: "United Kingdom",
        service: "Document legalization",
        title: "Patient and honest",
        story: "Placeholder text. A short, genuine sentence is better than a long one.",
        rating: 5,
        storyDate: "2026-06-30",
    },

];

const initials = (name: string) =>
    name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();

const monthYear = (d?: string | null) => (d ? new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : null);

const Stars = ({ value = 0, size = "sm" }: { value?: number | null; size?: "sm" | "lg" }) =>
    value ? (
        <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`${size === "lg" ? "h-5 w-5" : "h-4 w-4"} ${i <= value ? "fill-amber-400 text-amber-400" : "fill-navy-300/40 text-navy-300/40"}`}
                    aria-hidden
                />
            ))}
        </div>
    ) : null;

const Avatar = ({ story, size = "md" }: { story: Story; size?: "md" | "lg" }) => {
    const cls = size === "lg" ? "h-14 w-14 text-base" : "h-10 w-10 text-sm";
    return story.photoUrl ? (
        <img src={story.photoUrl} alt="" className={`${cls} shrink-0 rounded-full object-cover ring-2 ring-white`} />
    ) : (
        <span className={`${cls} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-title to-navy-700 font-semibold text-white ring-2 ring-white`}>
            {initials(story.customerName)}
        </span>
    );
};

const Person = ({ story, size = "md" }: { story: Story; size?: "md" | "lg" }) => (
    <div className="flex items-center gap-3">
        <Avatar story={story} size={size} />
        <div className="min-w-0">
            <p className={`truncate font-semibold text-title ${size === "lg" ? "text-base" : "text-sm"}`}>{story.customerName}</p>
            <p className="flex items-center gap-1 truncate text-xs text-ink/55">
                {story.country && (
                    <>
                        <MapPin className="h-3 w-3" aria-hidden /> {story.country}
                    </>
                )}
                {story.country && monthYear(story.storyDate) && <span aria-hidden>·</span>}
                {monthYear(story.storyDate)}
            </p>
        </div>
    </div>
);

const ServiceTag = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full border border-navy-300/60 bg-white/70 px-2.5 py-1 text-xs font-medium text-navy-700">{children}</span>
);

const Testimonials = ({
    stories = PREVIEW_STORIES,
    heading = "Stories from people we helped",
    subheading = "Real experiences from customers abroad, shared with their permission.",
}: {
    stories?: Story[];
    heading?: string;
    subheading?: string;
}) => {
    if (!stories.length) return null;
    const [featured, ...rest] = stories;
    const average = stories.filter((s) => s.rating).reduce((sum, s, _, arr) => sum + (s.rating ?? 0) / arr.length, 0);

    return (
        <section id="stories" className="relative scroll-mt-24 overflow-hidden py-16 lg:py-24">
            {/* soft background */}
            {/* <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(700px_380px_at_0%_0%,#D9E5FE_0%,transparent_60%),radial-gradient(600px_380px_at_100%_100%,#DDF3EE_0%,transparent_60%)]" /> */}

            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                {/* Heading */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.01em] text-title sm:text-[2.6rem] sm:leading-tight">{heading}</h2>
                        <p className="mt-3 text-lg leading-relaxed text-ink/65">{subheading}</p>
                    </div>

                    {average > 0 && (
                        <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                            <span className="text-3xl font-semibold tabular-nums text-title">{average.toFixed(1)}</span>
                            <div>
                                <Stars value={Math.round(average)} />
                                <p className="mt-0.5 text-xs text-ink/55">
                                    from {stories.length} {stories.length === 1 ? "story" : "stories"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-10 grid gap-5 lg:grid-cols-5">
                    {/* Featured story */}
                    <figure className="relative flex flex-col justify-between overflow-hidden rounded-3xl inset-0 -z-10 bg-[radial-gradient(700px_380px_at_0%_0%,#D9E5FE_0%,transparent_60%),radial-gradient(600px_380px_at_100%_100%,#DDF3EE_0%,transparent_60%)] p-7 text-title shadow-xl shadow-title/20 sm:p-9 lg:col-span-2">
                        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#5B7BEA]/30 blur-3xl" />
                        <span className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#3FB9A0]/25 blur-3xl" />
                        <Quote className="relative h-10 w-10 text-[#9FE3CF]" aria-hidden />

                        <blockquote className="relative mt-6">
                            <p className="text-2xl font-semibold leading-snug tracking-tight">{featured.title}</p>
                            <p className="mt-4 leading-relaxed text-title/75">“{featured.story}”</p>
                        </blockquote>

                        <figcaption className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
                            <div className="flex items-center gap-3">
                                <Avatar story={featured} size="lg" />
                                <div>
                                    <p className="font-semibold">{featured.customerName}</p>
                                    <p className="text-sm text-title/60">
                                        {[featured.country, featured.service].filter(Boolean).join(" · ")}
                                    </p>
                                </div>
                            </div>
                            <Stars value={featured.rating} size="lg" />
                        </figcaption>
                    </figure>

                    {/* Other stories: grid on desktop, swipe on phones */}
                    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:col-span-3">
                        {rest.map((s, i) => (
                            <figure
                                key={s.id}
                                className={`flex w-[82%] shrink-0 snap-start flex-col justify-between rounded-3xl border border-white bg-white/85 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md sm:w-auto ${rest.length % 2 === 1 && i === rest.length - 1 ? "sm:col-span-2" : "" // last card fills the row
                                    }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-3">
                                        <Stars value={s.rating} />
                                        {s.service && <ServiceTag>{s.service}</ServiceTag>}
                                    </div>
                                    <p className="mt-4 font-semibold text-title">{s.title}</p>
                                    <blockquote className="mt-2 text-sm leading-relaxed text-ink/70">“{s.story}”</blockquote>
                                </div>
                                <figcaption className="mt-6 border-t border-navy-300/40 pt-4">
                                    <Person story={s} />
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Testimonials