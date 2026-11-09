"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, SettingsSection } from "@/components/admin/setting-ui";
import { companyToForm, EMPTY_COMPANY_FORM, useCompany, useSaveCompany } from "@/hooks/useCompany";
import LogoUpload from "@/components/shared/LogoUpload";
import { companySchema, firstError, validate, type FieldErrors } from "@/components/shared/FormValidation";

// The page has no WhatsApp field, so it is not checked here
const companyFormSchema = companySchema.omit({ whatsapp: true });

const CompanyProfilePage = () => {
  const { data: company, isLoading } = useCompany();
  const saveCompany = useSaveCompany();

  const saved = useMemo(() => companyToForm(company), [company]);
  const [form, setForm] = useState<any>(EMPTY_COMPANY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setForm(saved);
    setErrors({});
  }, [saved]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  // Typing in a field clears its error
  const set = (key: string, value: any) => {
    setForm((f: any) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  const saving = saveCompany.isPending;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate(companyFormSchema, form);
    if (!result.ok) {
      setErrors(result.errors);
      return toast.error(firstError(result.errors));
    }
    // cleaned values: trimmed, phone without spaces, website with https://
    saveCompany.mutate({ form: { ...form, ...result.data }, current: company });
  };

  const discard = () => {
    setForm(saved);
    setErrors({});
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <PageHeader title="Company profile" description="Manage your company’s essential details." />
      <fieldset disabled={isLoading} className="mt-6 space-y-6 disabled:opacity-60">
        <SettingsSection title="Company logo" description="Logo that represents company across the platform.">
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">Upload the company logo</p>
            <LogoUpload logoUrl={company?.logoUrl} name={company?.name} disabled={isLoading} />
          </div>
        </SettingsSection>

        {/* Company information */}
        <SettingsSection title="Company information" description="Tell customers who you are and what your company does.">
          <div className="space-y-5">
            <Field label="Company name" htmlFor="name">
              <Input
                id="name"
                placeholder="Enter your company name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={!!errors.name}
                maxLength={150}
              />
              <FieldError message={errors.name} />
            </Field>

            <Field label="About the company" htmlFor="about" hint={`${form.about.length}/500 characters`}>
              <Textarea
                id="about"
                placeholder="Write a short introduction about your company, its background, and the services it offers..."
                rows={4}
                maxLength={500}
                value={form.about}
                onChange={(e) => set("about", e.target.value)}
                aria-invalid={!!errors.about}
                className="resize-y"
              />
              <FieldError message={errors.about} />
            </Field>
          </div>
        </SettingsSection>

        {/* Contact information */}
        <SettingsSection title="Contact information" description="Provide the details customers can use to reach your company.">
          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            <Field label="Email address" htmlFor="email">
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={!!errors.email}
              />
              <FieldError message={errors.email} />
            </Field>

            <Field label="Phone number" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                placeholder="+250 788 000 000"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                aria-invalid={!!errors.phone}
              />
              <FieldError message={errors.phone} />
            </Field>

            <Field label="Company website" htmlFor="website">
              <Input
                id="website"
                type="url"
                inputMode="url"
                placeholder="https://www.example.com"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                aria-invalid={!!errors.website}
              />
              <FieldError message={errors.website} />
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
                  aria-invalid={!!errors.linkedin}
                />
              </div>
              <FieldError message={errors.linkedin} />
            </Field>
          </div>
        </SettingsSection>

        {/* Address */}
        <SettingsSection title="Business address" description="Add your company's physical location.">
          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Street address" htmlFor="address">
                <Input
                  id="address"
                  placeholder="Building, street, or neighborhood"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  aria-invalid={!!errors.address}
                />
                <FieldError message={errors.address} />
              </Field>
            </div>

            <Field label="City or district" htmlFor="city">
              <Input id="city" placeholder="Enter city or district" value={form.city} onChange={(e) => set("city", e.target.value)} aria-invalid={!!errors.city} />
              <FieldError message={errors.city} />
            </Field>

            <Field label="Country" htmlFor="country">
              <Input id="country" placeholder="Enter country" value={form.country} onChange={(e) => set("country", e.target.value)} aria-invalid={!!errors.country} />
              <FieldError message={errors.country} />
            </Field>
          </div>
        </SettingsSection>
      </fieldset>

      {/* Save bar */}
      {isDirty && (
        <div className="sticky bottom-4 mt-8 flex flex-col gap-3 rounded-2xl border border-white bg-title px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">You have unsaved changes.</p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={discard} disabled={saving}>
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
};

const FieldError = ({ message }: { message?: string }) => (message ? <p className="mt-1.5 text-xs text-red-600">{message}</p> : null);
export default CompanyProfilePage;
