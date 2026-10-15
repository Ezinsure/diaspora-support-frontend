// src/app/admin/settings/company/page.tsx  →  /admin/settings/company
"use client";

import { useMemo, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, SettingsSection } from "@/components/admin/setting-ui";
import { mockCompany, type Company } from "@/lib/mock/settings";

export default function CompanyProfilePage() {
  const [saved, setSaved] = useState<Company>(mockCompany); // TODO: load from API
  const [form, setForm] = useState<Company>(mockCompany);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);
  const set = <K extends keyof Company>(key: K, value: Company[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onLogo = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 2 * 1024 * 1024) return toast.error("The logo must be smaller than 2 MB.");
    set("logo", URL.createObjectURL(file)); // TODO: upload to your storage instead
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: await CompanyService.update(form)
    await new Promise((r) => setTimeout(r, 500));
    setSaved(form);
    setSaving(false);
    toast.success("Company profile saved");
  };

  return (
    <form onSubmit={onSubmit}>
      <PageHeader title="Company profile" description="This information appears on your website, emails and invoices." />

      <div className="mt-8">
        <SettingsSection title="Logo" description="Square image, PNG or JPG, up to 2 MB.">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-navy-300/60 bg-navy-50">
              {form.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.logo} alt="Company logo" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="h-7 w-7 text-ink/40" />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onLogo(e.target.files?.[0])} />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                {form.logo ? "Change logo" : "Upload logo"}
              </Button>
              {form.logo && (
                <Button type="button" variant="ghost" className="text-destructive" onClick={() => set("logo", null)}>
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              )}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="About the company" description="A short description used on the website and in emails.">
          <div className="grid gap-5">
            <Field label="Company name" htmlFor="name">
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </Field>
            <Field label="About" htmlFor="about" hint={`${form.about.length}/500 characters`}>
              <Textarea id="about" rows={4} maxLength={500} value={form.about} onChange={(e) => set("about", e.target.value)} />
            </Field>
          </div>
        </SettingsSection>

        <SettingsSection title="Contact" description="How customers can reach you.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" htmlFor="email">
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </Field>
            <Field label="Phone number" htmlFor="phone">
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="WhatsApp number" htmlFor="whatsapp" hint="With country code, e.g. +250 788 000 000">
              <Input id="whatsapp" type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} required />
            </Field>
            <Field label="Website" htmlFor="website">
              <Input id="website" type="url" placeholder="https://" value={form.website} onChange={(e) => set("website", e.target.value)} />
            </Field>
            <Field label="LinkedIn" htmlFor="linkedin" className="sm:col-span-2">
              <div className="flex rounded-md shadow-xs">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-navy-50 px-3 text-sm text-ink/60">
                  linkedin.com/company/
                </span>
                <Input id="linkedin" className="rounded-l-none" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
              </div>
            </Field>
          </div>
        </SettingsSection>

        <SettingsSection title="Address" description="Only publish the address once the formal wording is confirmed.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Address" htmlFor="address" className="sm:col-span-2">
              <Input id="address" placeholder="Building, street" value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="City" htmlFor="city">
              <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="Country" htmlFor="country">
              <Input id="country" value={form.country} onChange={(e) => set("country", e.target.value)} />
            </Field>
          </div>
        </SettingsSection>
      </div>

      {/* Save bar: appears when something changed */}
      {isDirty && (
        <div className="sticky bottom-4 mt-8 flex flex-col gap-3 rounded-2xl border border-white bg-title px-5 py-4 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">You have unsaved changes.</p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setForm(saved)} disabled={saving}>
              Discard
            </Button>
            <Button type="submit" className="bg-white text-title hover:bg-white/90" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}