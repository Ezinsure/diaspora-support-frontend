"use client";

import { useState } from "react";
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
import TagInput from "@/components/admin/TagInput";
import { Field, Tag } from "@/components/admin/setting-ui";
import { useServiceTags, type ServiceFormValues, type ServiceItem } from "@/hooks/useService";

const ServiceFormDialog = ({
  open,
  onOpenChange,
  service,
  onSave,
  isSaving = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem | null;
  onSave: (data: ServiceFormValues) => void;
  isSaving?: boolean;
}) => (
  <AlertDialog open={open} onOpenChange={(o) => !isSaving && onOpenChange(o)}>
    <AlertDialogContent className="sm:max-w-xl!">
      {open && (
        <ServiceForm
          key={service?.id ?? "new"}
          service={service}
          onCancel={() => onOpenChange(false)}
          onSave={onSave}
          isSaving={isSaving}
        />
      )}
    </AlertDialogContent>
  </AlertDialog>
);

export const ServiceForm = ({
  service,
  onCancel,
  onSave,
  isSaving = false,
}: {
  service: ServiceItem | null;
  onCancel: () => void;
  onSave: (data: ServiceFormValues) => void;
  isSaving?: boolean;
}) => {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [tags, setTags] = useState<string[]>(service?.tags ?? []);
  const [isActive, setIsActive] = useState(service?.isActive ?? true);

  const { data: allTags = [] } = useServiceTags();
  const suggestions = allTags
    .map((t: any) => t.tag)
    .filter((t: string) => !tags.some((x) => x.toLowerCase() === t.toLowerCase()))
    .slice(0, 8);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name: name.trim(),
          description: description.trim(),
          tags,
          isActive,
        });
      }}
    >
      <AlertDialogHeader className="text-left p-4">
        <AlertDialogTitle>{service ? "Edit service" : "Add service"}</AlertDialogTitle>
        <AlertDialogDescription>Keep descriptions short and in plain language.</AlertDialogDescription>
      </AlertDialogHeader>

      <fieldset disabled={isSaving} className="grid gap-4 p-4">
        <Field label="Name" htmlFor="svcName">
          <Input id="svcName" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
        </Field>
        <Field label="Description" htmlFor="svcDesc" hint="Shown under the service name.">
          <Textarea id="svcDesc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={200} />
        </Field>
        <Field label="Tags" htmlFor="svcTags" hint="What you help with, e.g. Renewal, Replacement.">
          <TagInput id="svcTags" value={tags} onChange={setTags} />
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-ink/60">Used before:</span>
              {suggestions.map((t: string) => (
                <button key={t} type="button" onClick={() => setTags((list) => [...list, t])} className="rounded-full focus:outline-none focus-visible:ring-2 text-base! focus-visible:ring-title/40">
                  <Tag>+ {t}</Tag>
                </button>
              ))}
            </div>
          )}
        </Field>

        {/* Visible on the website */}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-300/50 p-3 hover:bg-navy-50/50">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--color-title,#0f2a44)]" />
          <span>
            <span className="block text-base font-medium text-ink">Show on the website</span>
            <span className="block text-sm text-ink/65">Untick to hide it from customers without deleting it.</span>
          </span>
        </label>
      </fieldset>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90" disabled={isSaving}>
          {isSaving ? "Saving..." : service ? "Save changes" : "Add service"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};

export default ServiceFormDialog;