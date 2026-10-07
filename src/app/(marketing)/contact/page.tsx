import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/src/components/icons/WhatsAppIcon";
import { CONTACT, SUPPORT, WHATSAPP_DISPLAY, WHATSAPP_LABEL, WHATSAPP_URL } from "@/src/lib/site";
import ContactForm from "@/src/components/marketing/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Reach our team on WhatsApp, by email or through our contact form. A real person will reply and guide you.",
};

const ContactPage = () => {
  return (
    <main className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Contact us</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            Tell us what you need help with. A member of our team will reply to you personally.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-10">
          <div className="space-y-4">
            <div className="rounded-3xl bg-green-700 p-7 text-white">
              <WhatsAppIcon className="h-8 w-8" />
              <h2 className="mt-5 font-sans text-xl font-semibold text-white">WhatsApp</h2>
              <p className="mt-1 text-white/85">The fastest way to reach us, wherever you are.</p>
              <p className="mt-4 text-lg font-medium tracking-wide">{WHATSAPP_DISPLAY}</p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "mt-5 h-11 rounded-full bg-white px-6 text-green-800 hover:bg-white/90")}
              >
                {WHATSAPP_LABEL}
              </a>
              {/* <p className="mt-4 text-sm text-white/80">{SUPPORT.responseTime}</p> */}
            </div>

            <ContactRow icon={Mail} title="Email" text="For questions and a written record of your request.">
              <a href={`mailto:${CONTACT.email}`} className="font-medium text-title underline-offset-4 hover:underline">
                {CONTACT.email}
              </a>
            </ContactRow>

            {CONTACT.phone && (
              <ContactRow icon={Phone} title="Phone" text="If you prefer to talk by voice call.">
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="font-medium text-title underline-offset-4 hover:underline">
                  {CONTACT.phone}
                </a>
              </ContactRow>
            )}

            <ContactRow icon={MapPin} title="Office" text={CONTACT.address ?? CONTACT.city} />

            {SUPPORT.hours && <ContactRow icon={Clock} title="Support hours" text={SUPPORT.hours} />}
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-navy-300/50 bg-white p-6 sm:p-9">
            <h2 className="text-2xl font-semibold">Send us a message</h2>
            <p className="mt-2 text-ink/70">We&apos;ll get back to you on WhatsApp.</p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default ContactPage;

function ContactRow({
  icon: Icon,
  title,
  text,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-navy-300/50 bg-white p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-title">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-title">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-ink/70">{text}</p>
        {children && <div className="mt-2 break-all text-sm">{children}</div>}
      </div>
    </div>
  );
}