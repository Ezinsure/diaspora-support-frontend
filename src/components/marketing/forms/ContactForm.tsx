"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/site";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { browserTimeZone, publicError, usePublicServices, useSubmitRequest } from "@/hooks/usePublicRequest";
import type { SubmitRequestResult } from "@/services/publicRequest";
import { FieldErrors, requestSchema, validate } from "@/components/shared/FormValidation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const EMPTY = { firstName: "", lastName: "", email: "", whatsapp: "", country: "", serviceId: "", message: "" };

const FieldError = ({ id, text }: { id: string; text?: string }) =>
  text ? (
    <p id={id} role="alert" className="text-xs text-destructive">
      {text}
    </p>
  ) : null;

export default function ContactForm() {
  const { data: services = [], isLoading: loadingServices, isError: servicesError } = usePublicServices();
  const submit = useSubmitRequest();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<SubmitRequestResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [timezone, setTimezone] = useState<string | null>(null);

  const serviceItems = services.map((s) => ({ value: s.id, label: s.name }));

  // The visitor's time zone (sent with the request, so we call at a good hour)
  useEffect(() => setTimezone(browserTimeZone()), []);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key === "whatsapp" ? "phone" : key === "message" ? "description" : key]) {
      setErrors((x) => ({ ...x, [key === "whatsapp" ? "phone" : key === "message" ? "description" : key]: "" }));
    }
    if (formError) setFormError(null);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot: hidden from people, bots fill it in -> pretend it worked, send nothing
    const trap = (new FormData(e.currentTarget).get("company") as string) ?? "";
    if (trap.trim()) return setDone({ reference: "", status: "pending", service: "", message: "" });

    const result = validate(requestSchema, {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.whatsapp,
      serviceId: values.serviceId,
      country: values.country,
      timezone: timezone ?? "",
      description: values.message,
    });
    if (!result.ok) return setErrors(result.errors);

    submit.mutate(
      {
        ...result.data,
        country: result.data.country || null,
        timezone: result.data.timezone || null,
      },
      {
        onSuccess: (data) => {
          setDone(data);
          setValues(EMPTY);
        },
        onError: (err) => setFormError(publicError(err).message),
      },
    );
  };

  const copyReference = async () => {
    if (!done?.reference) return;
    try {
      await navigator.clipboard.writeText(done.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  // Sent
  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 py-6" role="status">
        <CheckCircle2 className="h-10 w-10 text-green-700" />
        <h2 className="text-2xl font-semibold">Thank you, we received your request</h2>

        {done.reference && (
          <div className="w-full rounded-xl border border-navy-300/60 bg-navy-50 px-4 py-3">
            <p className="text-sm text-ink/60">Your request number</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="text-xl font-semibold tracking-wide text-title">{done.reference}</span>
              <button type="button" onClick={copyReference} className="inline-flex items-center gap-1 text-sm font-medium text-title underline-offset-4 hover:underline">
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 text-sm text-ink/70">
              Status: <span className="font-medium text-ink">Received</span>
              {done.service && (
                <>
                  {" "}· Service: <span className="font-medium text-ink">{done.service}</span>
                </>
              )}
            </p>
          </div>
        )}

        <p className="leading-relaxed text-ink/75">
          We sent a confirmation to your email. A member of our team will contact you on WhatsApp. Keep your request number: with your email, you can
          follow your request at any time.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href={done.reference ? `/track?ref=${done.reference}` : "/track"} className="font-medium text-title underline underline-offset-4">
            Track my request
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-title underline underline-offset-4">
            Open WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              submit.reset();
            }}
            className="font-medium text-ink/60 underline-offset-4 hover:underline"
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

  // Form
  const sending = submit.isPending;
  const invalid = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <fieldset disabled={sending} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" value={values.firstName} onChange={set("firstName")} autoComplete="given-name" maxLength={80} {...invalid("firstName")} />
            <FieldError id="firstName-error" text={errors.firstName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" value={values.lastName} onChange={set("lastName")} autoComplete="family-name" maxLength={80} {...invalid("lastName")} />
            <FieldError id="lastName-error" text={errors.lastName} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" inputMode="email" value={values.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" maxLength={160} {...invalid("email")} />
            <FieldError id="email-error" text={errors.email} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp number</Label>
            <Input id="whatsapp" type="tel" value={values.whatsapp} onChange={set("whatsapp")} autoComplete="tel" placeholder="+1 416 000 0000" maxLength={25} {...invalid("phone")} />
            <FieldError id="phone-error" text={errors.phone} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="country">Country you live in</Label>
            <Input id="country" value={values.country} onChange={set("country")} autoComplete="country-name" maxLength={100} {...invalid("country")} />
            <FieldError id="country-error" text={errors.country} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service">Service needed</Label>
            <Select
              items={serviceItems}
              value={values.serviceId || null}
              onValueChange={(v: any) => {
                setValues((x) => ({ ...x, serviceId: v ? String(v) : "" }));
                if (errors.serviceId) setErrors((x) => ({ ...x, serviceId: "" }));
                if (formError) setFormError(null);
              }}
              disabled={loadingServices || sending}
            >
              <SelectTrigger
                id="service"
                aria-invalid={!!errors.serviceId || undefined}
                aria-describedby={errors.serviceId ? "serviceId-error" : undefined}
                className="h-9 w-full"
              >
                <SelectValue placeholder={loadingServices ? "Loading services…" : servicesError ? "Couldn't load services" : "Choose a service"} />
              </SelectTrigger>

              <SelectContent className="max-h-72">
                {serviceItems.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-ink/55">{loadingServices ? "Loading…" : "No services available right now."}</p>
                ) : (
                  serviceItems.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FieldError id="serviceId-error" text={errors.serviceId} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">How can we help?</Label>
          <Textarea
            id="message"
            value={values.message}
            onChange={set("message")}
            rows={5}
            placeholder="A short description of your situation"
            maxLength={2000}
            {...invalid("description")}
          />
          <div className="flex items-start justify-between gap-3">
            <FieldError id="description-error" text={errors.description} />
            <span className="ml-auto text-xs text-ink/45">{values.message.length}/2000</span>
          </div>
        </div>
      </fieldset>

      {/* Honeypot: hidden from people, bots fill it in */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {formError && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={sending} className="h-11 rounded-full bg-title px-7 text-white hover:bg-title/90">
          {sending ? "Sending..." : "Send request"}
        </Button>
      </div>
    </form>
  );
}