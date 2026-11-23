"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Placeholders: replace with real stories, shared with the customer's permission
export const PREVIEW_STORIES: Story[] = [
    {
        id: "p1",
        customerName: "Customer A",
        country: "Belgium",
        service: "e-Passport Application",
        title: "Sorted without flying home",
        story: "Placeholder text. A real customer's words go here: what they needed, how the follow-up went, and how it felt to have it handled for them.",
        rating: 5,
        storyDate: "2026-09-14",
    },
    {
        id: "p2",
        customerName: "Customer B",
        country: "Canada",
        service: "Birth Services",
        title: "Clear steps from day one",
        story: "Placeholder text. Keep real stories short and specific: two to four sentences read best.",
        rating: 5,
        storyDate: "2026-08-02",
    },
    {
        id: "p3",
        customerName: "Customer C",
        country: "United States",
        service: "Criminal Record Certificate",
        title: "Updates every step",
        story: "Placeholder text. Mention the service and the outcome, never personal or document details.",
        rating: 4,
        storyDate: "2026-07-21",
    },
    {
        id: "p4",
        customerName: "Customer D",
        country: "United Kingdom",
        service: "Legalization of documents",
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

const Stars = ({ value = 0, size = "sm", dark = false }: { value?: number | null; size?: "sm" | "lg"; dark?: boolean }) =>
    value ? (
        <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={cn(
                        size === "lg" ? "h-5 w-5" : "h-4 w-4",
                        i <= value ? "fill-amber-400 text-amber-400" : dark ? "fill-white/15 text-white/15" : "fill-navy-300/40 text-navy-300/40",
                    )}
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

const ArrowButton = ({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-300/60 bg-white text-title transition hover:border-title hover:bg-title hover:text-white disabled:pointer-events-none disabled:opacity-40"
    >
        {children}
    </button>
);

const Testimonials = ({
    stories = PREVIEW_STORIES,
    heading = "Stories from people we helped",
    subheading = "Real experiences from our customers, shared with their permission.",
}: {
    stories?: Story[];
    heading?: string;
    subheading?: string;
}) => {
    const track = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    const rated = stories.filter((s) => s.rating);
    const average = rated.length ? rated.reduce((sum, s) => sum + (s.rating ?? 0), 0) / rated.length : 0;

    // Which card is closest to the middle
    const update = useCallback(() => {
        const el = track.current;
        if (!el) return;
        const middle = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let distance = Infinity;
        Array.from(el.children).forEach((child, i) => {
            const card = child as HTMLElement;
            const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
            if (d < distance) {
                distance = d;
                best = i;
            }
        });
        setActive(best);
    }, []);

    // Scroll a card to the middle
    const goTo = useCallback((i: number, smooth = true) => {
        const el = track.current;
        const card = el?.children[i] as HTMLElement | undefined;
        if (!el || !card) return;
        el.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2, behavior: smooth ? "smooth" : "auto" });
    }, []);

    useEffect(() => {
        const el = track.current;
        if (!el) return;
        goTo(Math.min(1, stories.length - 1), false); // start with a card on each side
        update();
        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(frame);
        };
    }, [goTo, update, stories.length]);

    if (!stories.length) return null;

    return (
        <section id="stories" className="relative scroll-mt-24 overflow-hidden py-16 lg:py-24">
            {/* Heading + rating + arrows */}
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-wider text-clay-600">Customer stories</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.01em] text-title sm:text-[2.6rem] sm:leading-tight">{heading}</h2>
                    <p className="mt-3 text-lg leading-relaxed text-ink/65">{subheading}</p>
                    {average > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-ink/60">
                            <Stars value={Math.round(average)} />
                            <span>
                                <span className="font-semibold text-title">{average.toFixed(1)}</span> average from {rated.length}{" "}
                                {rated.length === 1 ? "review" : "reviews"}
                            </span>
                        </div>
                    )}
                </div>

                {stories.length > 1 && (
                    <div className="hidden gap-2 sm:flex">
                        <ArrowButton label="Previous story" disabled={active === 0} onClick={() => goTo(active - 1)}>
                            <ChevronLeft className="h-5 w-5" />
                        </ArrowButton>
                        <ArrowButton label="Next story" disabled={active === stories.length - 1} onClick={() => goTo(active + 1)}>
                            <ChevronRight className="h-5 w-5" />
                        </ArrowButton>
                    </div>
                )}
            </div>

            {/* Cards: the one in the middle is big */}
            <div
                ref={track}
                aria-roledescription="carousel"
                className="relative mt-10 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[7.5%] py-8 [scrollbar-width:none] sm:px-[calc(50%_-_240px)] lg:px-[calc(50%_-_290px)] [&::-webkit-scrollbar]:hidden"
            >
                {stories.map((s, i) => {
                    const isActive = i === active;
                    const meta = [s.country, monthYear(s.storyDate)].filter(Boolean).join(" · ");
                    return (
                        <figure
                            key={s.id}
                            onClick={() => !isActive && goTo(i)}
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${stories.length}`}
                            className={cn(
                                "relative isolate flex min-h-[340px] w-[85%] shrink-0 snap-center flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 ease-out sm:w-[480px] sm:p-9 lg:w-[580px]",
                                isActive
                                    ? "scale-100 bg-title text-white opacity-100 shadow-2xl shadow-title/25"
                                    : "scale-[0.88] cursor-pointer border border-navy-300/40 bg-white text-ink opacity-60 hover:opacity-80",
                            )}
                        >
                            {isActive && (
                                <>
                                    <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-[#5B7BEA]/40 blur-3xl" />
                                    <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-64 w-64 rounded-full bg-[#3FB9A0]/30 blur-3xl" />
                                </>
                            )}

                            <div className="flex items-center justify-between gap-3">
                                <Quote className={cn("h-9 w-9", isActive ? "text-[#9FE3CF]" : "text-title/20")} aria-hidden />
                                {s.service && (
                                    <span
                                        className={cn(
                                            "rounded-full px-3 py-1 text-xs font-medium",
                                            isActive ? "bg-white/10 text-white/90 ring-1 ring-white/15" : "bg-navy-50 text-title",
                                        )}
                                    >
                                        {s.service}
                                    </span>
                                )}
                            </div>

                            <blockquote className="mt-6 flex-1">
                                <p className={cn("font-semibold leading-snug tracking-tight", isActive ? "text-2xl" : "text-xl text-title")}>{s.title}</p>
                                <p className={cn("mt-4 leading-relaxed", isActive ? "text-lg text-white/80" : "line-clamp-4 text-ink/70")}>“{s.story}”</p>
                            </blockquote>

                            <figcaption
                                className={cn(
                                    "mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-5",
                                    isActive ? "border-white/15" : "border-navy-300/40",
                                )}
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <Avatar story={s} size="lg" />
                                    <div className="min-w-0">
                                        <p className={cn("truncate font-semibold", !isActive && "text-title")}>{s.customerName}</p>
                                        {meta && (
                                            <p className={cn("flex items-center gap-1 truncate text-sm", isActive ? "text-white/60" : "text-ink/55")}>
                                                {s.country && <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                                                {meta}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Stars value={s.rating} dark={isActive} />
                            </figcaption>
                        </figure>
                    );
                })}
            </div>

            {/* Dots */}
            {stories.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {stories.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            aria-label={`Show story ${i + 1}`}
                            aria-current={i === active}
                            onClick={() => goTo(i)}
                            className={cn("h-2 rounded-full transition-all duration-300", i === active ? "w-8 bg-title" : "w-2 bg-navy-300 hover:bg-title/50")}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Testimonials;