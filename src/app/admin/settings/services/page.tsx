
"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import TagInput from "@/components/admin/TagInput";
import { EmptyState, Field, PageHeader, Tag } from "@/components/admin/setting-ui";
import { mockServices, type ServiceItem } from "@/lib/mock/settings";

export default function ServicesSettingsPage() {
  const [services, setServices] = useState<ServiceItem[]>(mockServices); // TODO: load from API
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ServiceItem | null>(null);

  const save = (data: Omit<ServiceItem, "id">) => {
    if (editing) {
      setServices((list) => list.map((s) => (s.id === editing.id ? { ...s, ...data } : s)));
      toast.success("Service updated");
    } else {
      setServices((list) => [...list, { ...data, id: crypto.randomUUID() }]);
      toast.success("Service added");
    }
    setFormOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description="The services shown on your website. Fees are managed in the Fees tab."
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="rounded-full bg-title px-4 text-white hover:bg-title/90">
            <Plus className="h-4 w-4" /> Add service
          </Button>
        }
      />

      {services.length === 0 ? (
        <div className="mt-6"><EmptyState title="No services yet" text="Add your first service to show it on the website." /></div>
      ) : (
        <ul className="mt-6 divide-y divide-navy-300/40 overflow-hidden rounded-2xl border border-navy-300/50 bg-white">
          {services.map((s) => (
            <li key={s.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-title">{s.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink">{s.description}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">{s.subdescription}</p>
                {s.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-1 self-end sm:self-start">
                <Button variant="ghost" size="icon" aria-label={`Edit ${s.name}`} onClick={() => { setEditing(s); setFormOpen(true); }} className="text-ink/60 hover:text-title">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Delete ${s.name}`} onClick={() => setDeleting(s)} className="text-ink/60 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ServiceFormDialog open={formOpen} onOpenChange={setFormOpen} service={editing} onSave={save} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete service?"
        description={<><span className="font-medium text-ink">{deleting?.name}</span> will be removed from the website.</>}
        confirmLabel="Delete service"
        onConfirm={() => {
          setServices((list) => list.filter((s) => s.id !== deleting?.id)); // TODO: API call
          toast.success("Service deleted");
        }}
      />
    </div>
  );
}

function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem | null;
  onSave: (data: Omit<ServiceItem, "id">) => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        {open && <ServiceForm key={service?.id ?? "new"} service={service} onCancel={() => onOpenChange(false)} onSave={onSave} />}
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ServiceForm({
  service,
  onCancel,
  onSave,
}: {
  service: ServiceItem | null;
  onCancel: () => void;
  onSave: (data: Omit<ServiceItem, "id">) => void;
}) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [subdescription, setSubdescription] = useState(service?.subdescription ?? "");
  const [tags, setTags] = useState<string[]>(service?.tags ?? []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name: name.trim(), description: description.trim(), subdescription: subdescription.trim(), tags });
      }}
    >
      <AlertDialogHeader className="text-left">
        <AlertDialogTitle>{service ? "Edit service" : "Add service"}</AlertDialogTitle>
        <AlertDialogDescription>Keep descriptions short and in plain language.</AlertDialogDescription>
      </AlertDialogHeader>

      <div className="grid gap-4 py-5">
        <Field label="Name" htmlFor="svcName">
          <Input id="svcName" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
        </Field>
        <Field label="Description" htmlFor="svcDesc" hint="Shown under the service name.">
          <Textarea id="svcDesc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={200} />
        </Field>
        <Field label="Subdescription" htmlFor="svcSub" hint="Short summary used on service cards.">
          <Textarea id="svcSub" rows={2} value={subdescription} onChange={(e) => setSubdescription(e.target.value)} maxLength={160} />
        </Field>
        <Field label="Tags" htmlFor="svcTags" hint="What you help with, e.g. Renewal, Replacement.">
          <TagInput id="svcTags" value={tags} onChange={setTags} />
        </Field>
      </div>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90">{service ? "Save changes" : "Add service"}</Button>
      </AlertDialogFooter>
    </form>
  );
}