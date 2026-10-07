"use client";

import { useState } from "react";
import { Check, CircleDot, FileText, Mail, MessageSquareText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_URL } from "./site";
import { WhatsAppIcon } from "../components/icons/WhatsAppIcon";
import { cn } from "../../lib/utils";

const steps = [
  {
    title: "Contact us",
    summary: "Reach our team on WhatsApp, through the website form, or by email.",
    detail:
      "Choose the channel that suits you. Most clients start on WhatsApp because it's quick from anywhere in the world. Email is useful if you'd like a written record.",
    Visual: ContactVisual,
  },
  {
    title: "Tell us what you need",
    summary: "A team member identifies the service and checks what's required.",
    detail:
      "Tell us your situation in your own words. We'll confirm which service applies and send you a clear list of the information and documents needed.",
    Visual: NeedsVisual,
  },
  {
    title: "We guide and follow up",
    summary: "We check your documents and follow the progress of your request.",
    detail:
      "Within the limits of what we're authorized to do, we check your documents, help you prepare what's needed and keep track of your request. Decisions and processing times remain with the relevant government institution.",
    Visual: FollowUpVisual,
  },
  {
    title: "Stay updated",
    summary: "You receive progress updates and can reach us when you need to.",
    detail:
      "We let you know when something changes, so you don't have to keep checking. If you have a question along the way, just message the team.",
    Visual: UpdatesVisual,
  },
];

export default function HowItWorks({ as: Heading = "h2" }: { as?: "h1" | "h2" }) {
  const [active, setActive] = useState(0);
  const current = steps[active];

  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <div>
          <Heading className="text-3xl font-semibold tracking-[-0.01em] sm:text-[2.6rem]">How it works</Heading>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-ink/70">
            Getting help is straightforward. Here&apos;s what happens from your first message to the final update.
          </p>

          <ol className="mt-10">
            {steps.map((step, i) => {
              const isActive = i === active;
              return (
                <li key={step.title} className="relative pb-6 last:pb-0">
                  {/* Dashed connector */}
                  {i < steps.length - 1 && (
                    <span aria-hidden className="absolute left-[21px] top-12 bottom-0 border-l-2 border-dashed border-navy-300/70" />
                  )}

                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-current={isActive ? "step" : undefined}
                    aria-controls="how-it-works-panel"
                    className="group flex w-full gap-5 rounded-2xl text-left focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 font-heading text-base font-semibold transition-colors",
                        isActive
                          ? "border-title bg-title text-white"
                          : "border-navy-300 bg-white text-title group-hover:border-title/60 group-focus-visible:border-title",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1.5">
                      <span
                        className={cn(
                          "block text-lg font-semibold transition-colors",
                          isActive ? "text-title" : "text-ink/70 group-hover:text-title",
                        )}
                      >
                        {step.title}
                      </span>
                      <span className="mt-1 block text-[0.95rem] leading-relaxed text-ink/65">{step.summary}</span>
                    </span>
                  </button>

                  {/* Mobile: details open under the active step */}
                  {isActive && (
                    <div className="ml-16 mt-4 animate-in fade-in-0 duration-300 motion-reduce:animate-none lg:hidden">
                      <StepPanel step={step} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-10 h-12 gap-2.5 rounded-full bg-green-700 px-7 text-base text-white hover:bg-green-800",
            )}
          >
            <WhatsAppIcon className="h-5 w-5" />
            Start on WhatsApp
          </a>
        </div>

        {/* Desktop: details panel */}
        <div id="how-it-works-panel" aria-live="polite" className="hidden lg:block">
          <div className="rounded-[2rem] bg-navy-50 p-8">
            <div
              key={active}
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 motion-reduce:animate-none"
            >
              <StepPanel step={current} large />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepPanel({ step, large = false }: { step: (typeof steps)[number]; large?: boolean }) {
  const { Visual } = step;
  return (
    <div>
      <div className="rounded-2xl border border-navy-300/50 bg-white p-5 shadow-[0_12px_32px_-18px_rgba(11,42,99,0.35)]">
        <Visual />
      </div>
      <p className={cn("leading-relaxed text-ink/75", large ? "mt-6 text-[1.05rem]" : "mt-4 text-sm")}>
        {step.detail}
      </p>
    </div>
  );
}

/* ── Visuals: simple illustrations of each step ─────────────────────── */

function ContactVisual() {
  const channels = [
    { icon: WhatsAppIcon, label: "WhatsApp", note: "Fastest", highlight: true },
    { icon: MessageSquareText, label: "Website form", note: "Anytime" },
    { icon: Mail, label: "Email", note: "Written record" },
  ];
  return (
    <ul className="space-y-2.5">
      {channels.map(({ icon: Icon, label, note, highlight }) => (
        <li
          key={label}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3",
            highlight ? "border-green-700/30 bg-green-50" : "border-navy-300/50",
          )}
        >
          <Icon className={cn("h-5 w-5", highlight ? "text-green-700" : "text-title")} />
          <span className="font-medium text-ink">{label}</span>
          <span className={cn("ml-auto text-xs", highlight ? "font-medium text-green-700" : "text-ink/55")}>{note}</span>
        </li>
      ))}
    </ul>
  );
}

function NeedsVisual() {
  return (
    <div className="space-y-3 text-sm">
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-title px-4 py-2.5 text-white">
        Hello, I live in Belgium and need help renewing my passport.
      </div>
      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-navy-50 px-4 py-3 text-ink">
        <p>Thanks! Here&apos;s what we&apos;ll need from you:</p>
        <ul className="mt-2 space-y-1.5">
          {["A few details about your situation", "The documents required for this service", "How you'd like to receive updates"].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-title" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FollowUpVisual() {
  const items = [
    { label: "Documents checked", done: true },
    { label: "Request prepared", done: true },
    { label: "Following progress", done: false },
  ];
  return (
    <div>
      <p className="text-xs font-medium text-ink/55">Your request</p>
      <ul className="mt-3 space-y-3">
        {items.map(({ label, done }) => (
          <li key={label} className="flex items-center gap-3">
            {done ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-700 text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-title text-title">
                <CircleDot className="h-3 w-3" />
              </span>
            )}
            <span className={cn("text-sm", done ? "text-ink" : "font-medium text-title")}>{label}</span>
            {!done && <span className="ml-auto rounded-full bg-navy-50 px-2.5 py-0.5 text-xs text-title">In progress</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function UpdatesVisual() {
  const updates = [
    { text: "Your documents have been checked. Everything is in order.", time: "Monday" },
    { text: "Your request is now with the institution. We'll keep following it.", time: "Wednesday" },
  ];
  return (
    <ul className="space-y-3">
      {updates.map(({ text, time }) => (
        <li key={time} className="flex gap-3">
          <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
            <WhatsAppIcon className="h-3.5 w-3.5" />
          </span>
          <div className="flex-1 rounded-2xl rounded-tl-md bg-navy-50 px-4 py-2.5 text-sm text-ink">
            {text}
            <span className="mt-1 block text-xs text-ink/50">{time}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}