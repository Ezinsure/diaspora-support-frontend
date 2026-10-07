"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, WHATSAPP_URL } from "@/lib/site";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "sending" | "sent" | "error";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring ";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("");

  // Suggest the visitor's time zone to save them typing
  useEffect(() => {
    try {
      setLocation((current) => current || Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " "));
    } catch {
      /* ignore */
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Something went wrong. Please try again.");
      }
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 py-6" role="status">
        <CheckCircle2 className="h-10 w-10 text-green-700" />
        <h2 className="text-2xl font-semibold">Thank you, we received your message</h2>
        <p className="leading-relaxed text-ink/75">
          A member of our team will contact you on WhatsApp. If it&apos;s urgent, you can message us directly.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-title underline underline-offset-4">
          Open WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Country / time zone</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. Canada, Toronto"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            maxLength={120}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="whatsapp">WhatsApp number</Label>
          <Input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" placeholder="+1 416 000 0000" required maxLength={25} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="service">Service needed</Label>
          <select id="service" name="service" required defaultValue="" className={selectClass}>
            <option value="" disabled>Choose a service</option>
            {services.map((s) => (
              <option key={s.href} value={s.title}>{s.title}</option>
            ))}
            <option value="Not sure">Not sure / something else</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="A short description of your situation"
          required
          minLength={10}
          maxLength={1500}
        />
      </div>

      {/* Honeypot: hidden from people, bots fill it in */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {/* <p className="flex items-start gap-2.5 rounded-xl bg-sand-100 px-4 py-3 text-sm leading-relaxed text-ink/80">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-clay-600" />
        Please don&apos;t send passport scans, ID numbers or other identity documents here. If documents are
        needed, we&apos;ll explain how to share them securely.
      </p> */}

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* <p className="text-xs text-ink/55">
          By sending this form, you agree to our{" "}
          <a href="/privacy" className="underline underline-offset-2">privacy policy</a>.
        </p> */}
        <Button type="submit" size="lg" disabled={status === "sending"} className="h-11 rounded-full bg-title px-7 text-white hover:bg-title/90">
          {status === "sending" ? "Sending..." : "Send message"}
        </Button>
      </div>
    </form>
  );
}