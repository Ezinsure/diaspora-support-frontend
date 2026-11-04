"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, SettingsSection } from "@/components/admin/setting-ui";
import {
  companyToForm,
  EMPTY_COMPANY_FORM,
  useCompany,
  useRemoveLogo,
  useSaveCompany,
  useUploadLogo,
} from "@/hooks/useCompany";

const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

const CompanyProfilePage = () => {
  const { data: company, isLoading } = useCompany();
  const saveCompany = useSaveCompany();
  const uploadLogo = useUploadLogo();
  const removeLogo = useRemoveLogo();
  const fileRef = useRef<HTMLInputElement>(null);

  const saved = useMemo(() => companyToForm(company), [company]);
  const [form, setForm] = useState<any>(EMPTY_COMPANY_FORM);

  useEffect(() => {
    setForm(saved);
  }, [saved]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);
  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  const saving = saveCompany.isPending;
  const logoBusy = uploadLogo.isPending || removeLogo.isPending;
  const logo = company?.logoUrl ?? null;

  // The logo is saved right away (separate from the form)
  const onLogo = (file?: File) => {
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) return toast.error("Please choose a PNG, JPG, WEBP or SVG image.");
    if (file.size > 2 * 1024 * 1024) return toast.error("The logo must be smaller than 2 MB.");
    if (!company) return toast.error("Save the company name first, then add the logo.");
    uploadLogo.mutate(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Company name is required.");
    saveCompany.mutate({ form, current: company });
  };

  return (
    <form onSubmit={onSubmit}>
      <PageHeader title="Company profile" description="Manage your company’s essential details." />
      <fieldset disabled={isLoading} className="space-y-6 disabled:opacity-60 mt-6">
        <SettingsSection
          title="Company logo"
          description="Logo that represents company across the platform."
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-navy-300 bg-navy-50">
              {uploadLogo.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin text-ink/50" />
              ) : logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt="Company logo"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <ImagePlus className="h-8 w-8 text-ink/40" />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <p className="text-sm font-medium text-ink">
                  Upload your company logo
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  PNG or JPG, preferably square. Maximum size: 2 MB.
                </p>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept={LOGO_TYPES.join(",")}
                className="hidden"
                onChange={(e) => {
                  onLogo(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  disabled={logoBusy}
                >
                  {uploadLogo.isPending
                    ? "Uploading..."
                    : logo
                      ? "Change logo"
                      : "Upload logo"}
                </Button>

                {logo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeLogo.mutate()}
                    disabled={logoBusy}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    {removeLogo.isPending ? "Removing..." : "Remove logo"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Company information */}
        <SettingsSection
          title="Company information"
          description="Tell customers who you are and what your company does."
        >
          <div className="space-y-5">
            <Field label="Company name" htmlFor="name">
              <Input
                id="name"
                placeholder="Enter your company name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </Field>

            <Field
              label="About the company"
              htmlFor="about"
              hint={`${form.about.length}/500 characters`}
            >
              <Textarea
                id="about"
                placeholder="Write a short introduction about your company, its background, and the services it offers..."
                rows={4}
                maxLength={500}
                value={form.about}
                onChange={(e) => set("about", e.target.value)}
                className="resize-y"
              />
            </Field>
          </div>
        </SettingsSection>

        {/* Contact information */}
        <SettingsSection
          title="Contact information"
          description="Provide the details customers can use to reach your company."
        >
          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            <Field label="Email address" htmlFor="email">
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </Field>

            <Field label="Phone number" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                placeholder="+250 788 000 000"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>

            <Field label="Company website" htmlFor="website">
              <Input
                id="website"
                type="url"
                inputMode="url"
                placeholder="https://www.solektratelecom.com/"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </Field>

            <Field label="LinkedIn company page" htmlFor="linkedin">
              <div className="flex min-w-0 rounded-md">
                <span className="inline-flex shrink-0 items-center rounded-l-md border border-r-0 border-input bg-navy-50 px-3 text-xs text-ink/60 sm:text-sm">
                  linkedin.com/company/
                </span>
                <Input
                  id="linkedin"
                  className="min-w-0 rounded-l-none"
                  placeholder="your-company"
                  value={form.linkedin}
                  onChange={(e) => set("linkedin", e.target.value)}
                />
              </div>
            </Field>
          </div>
        </SettingsSection>

        {/* Address */}
        <SettingsSection
          title="Business address"
          description="Add your company's physical location."
        >
          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Street address" htmlFor="address">
                <Input
                  id="address"
                  placeholder="Building, street, or neighborhood"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Field>
            </div>

            <Field label="City or district" htmlFor="city">
              <Input
                id="city"
                placeholder="Enter city or district"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </Field>

            <Field label="Country" htmlFor="country">
              <Input
                id="country"
                placeholder="Enter country"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              />
            </Field>
          </div>
        </SettingsSection>
      </fieldset>

      {/* Save bar */}
      {isDirty && (
        <div className="sticky bottom-4 mt-8 flex flex-col gap-3 rounded-2xl border border-white bg-title px-5 py-4 text-white  sm:flex-row sm:items-center sm:justify-between">
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
export default CompanyProfilePage