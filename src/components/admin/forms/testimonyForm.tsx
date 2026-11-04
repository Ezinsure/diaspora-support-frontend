"use client";

import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, selectClass } from "@/components/admin/setting-ui";
import { useServices } from "@/hooks/useService";
import { successStorySchema, validate, type FieldErrors } from "@/components/shared/FormValidation";
import type { SuccessStory, SuccessStoryFormValues } from "@/hooks/useSuccessStory";

const SuccessStoryFormDialog = ({
  open,
  onOpenChange,
  story,
  onSave,
  isSaving = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: SuccessStory | null;
  onSave: (data: SuccessStoryFormValues) => void;
  isSaving?: boolean;
}) => (
  <AlertDialog open={open} onOpenChange={(o) => !isSaving && onOpenChange(o)}>
    <AlertDialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
      {open && <SuccessStoryForm key={story?.id ?? "new"} story={story} onCancel={() => onOpenChange(false)} onSave={onSave} isSaving={isSaving} />}
    </AlertDialogContent>
  </AlertDialog>
);

const FieldError = ({ text }: { text?: string }) => (text ? <p className="mt-1 text-xs text-destructive">{text}</p> : null);

export const SuccessStoryForm = ({
  story,
  onCancel,
  onSave,
  isSaving = false,
}: {
  story: SuccessStory | null;
  onCancel: () => void;
  onSave: (data: SuccessStoryFormValues) => void;
  isSaving?: boolean;
}) => {
  const [values, setValues] = useState({
    customerName: story?.customerName ?? "",
    country: story?.country ?? "",
    service: story?.service ?? "",
    title: story?.title ?? "",
    story: story?.story ?? "",
    rating: story?.rating ?? null,
    storyDate: story?.storyDate ?? "",
    photoUrl: story?.photoUrl ?? "",
    consent: story?.consent ?? false,
    isPublished: story?.isPublished ?? true,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: servicesData } = useServices();
  const services = servicesData?.services ?? [];

  const set = (key: string, value: any) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  // TODO (API): upload the file and keep the returned URL. For now: local preview only.
  const onPhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image.");
    if (file.size > 2 * 1024 * 1024) return toast.error("The photo must be smaller than 2 MB.");
    set("photoUrl", URL.createObjectURL(file));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate(successStorySchema, values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    onSave(result.data as SuccessStoryFormValues);
  };

  return (
    <form onSubmit={submit} noValidate>
      <AlertDialogHeader className="text-left">
        <AlertDialogTitle>{story ? "Edit story" : "Add success story"}</AlertDialogTitle>
        <AlertDialogDescription>A real customer’s experience, shared with their permission.</AlertDialogDescription>
      </AlertDialogHeader>

      <fieldset disabled={isSaving} className="grid gap-4 py-5 sm:grid-cols-2">
        {/* Photo */}
        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-navy-300/60 bg-navy-50">
            {values.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-6 w-6 text-ink/40" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onPhoto(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              {values.photoUrl ? "Change photo" : "Add photo (optional)"}
            </Button>
            {values.photoUrl && (
              <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => set("photoUrl", "")}>
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        </div>

        <Field label="Customer name" htmlFor="ssName" hint="First name + initial is enough, e.g. Aline U.">
          <Input id="ssName" value={values.customerName} onChange={(e) => set("customerName", e.target.value)} maxLength={120} />
          <FieldError text={errors.customerName} />
        </Field>
        <Field label="Country" htmlFor="ssCountry" hint="Where they live, e.g. Belgium">
          <Input id="ssCountry" value={values.country} onChange={(e) => set("country", e.target.value)} maxLength={100} />
          <FieldError text={errors.country} />
        </Field>

        <Field label="Service" htmlFor="ssService">
          <select id="ssService" value={values.service} onChange={(e) => set("service", e.target.value)} className={selectClass}>
            <option value="">— Not specific —</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Date" htmlFor="ssDate" hint="When the service was completed (optional)">
          <Input id="ssDate" type="date" value={values.storyDate} onChange={(e) => set("storyDate", e.target.value)} />
          <FieldError text={errors.storyDate} />
        </Field>

        <Field label="Title" htmlFor="ssTitle" className="sm:col-span-2" hint="One line, e.g. “Passport renewed from Brussels in 3 weeks”">
          <Input id="ssTitle" value={values.title} onChange={(e) => set("title", e.target.value)} maxLength={120} />
          <FieldError text={errors.title} />
        </Field>

        <Field label="Story" htmlFor="ssStory" className="sm:col-span-2" hint={`${values.story.length}/1500 characters — in the customer’s words when possible`}>
          <Textarea id="ssStory" rows={5} value={values.story} onChange={(e) => set("story", e.target.value)} maxLength={1500} />
          <FieldError text={errors.story} />
        </Field>

        {/* Rating (optional) */}
        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-ink">Rating <span className="font-normal text-ink/50">(optional)</span></p>
          <div className="mt-1.5 flex items-center gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={values.rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => set("rating", values.rating === n ? null : n)}
                className="rounded p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-title/40"
              >
                <Star className={values.rating && n <= values.rating ? "h-5 w-5 fill-amber-400 text-amber-400" : "h-5 w-5 text-ink/25"} />
              </button>
            ))}
            {values.rating && (
              <button type="button" onClick={() => set("rating", null)} className="ml-2 text-xs text-ink/50 hover:text-ink">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Consent + publish */}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-300/50 p-3 hover:bg-navy-50/50 sm:col-span-2">
          <input type="checkbox" checked={values.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium text-ink">The customer agreed to share this story</span>
            <span className="block text-xs text-ink/55">Only publish real stories with the customer’s permission.</span>
            <FieldError text={errors.consent} />
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-300/50 p-3 hover:bg-navy-50/50 sm:col-span-2">
          <input type="checkbox" checked={values.isPublished} onChange={(e) => set("isPublished", e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium text-ink">Show on the website</span>
            <span className="block text-xs text-ink/55">Untick to keep it as a draft.</span>
          </span>
        </label>
      </fieldset>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90" disabled={isSaving}>
          {isSaving ? "Saving..." : story ? "Save changes" : "Add story"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};

export default SuccessStoryFormDialog;