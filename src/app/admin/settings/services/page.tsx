"use client";

import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState, PageHeader, Tag } from "@/components/admin/setting-ui";
import ServiceFormDialog from "@/components/admin/forms/ServiceForm";
import {
  type ServiceFormValues,
  type ServiceItem,
  useCreateService,
  useDeleteService,
  useServices,
  useToggleService,
  useUpdateService,
} from "@/hooks/useService";
import ServiceListSkeleton from "@/components/admin/skeleton/serviceSkeleton";

const ServicesSettingsPage = () => {
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ServiceItem | null>(null);

  const { data, isLoading, isError } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const toggleService = useToggleService();
  const deleteService = useDeleteService();

  const services = data?.services ?? [];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (s: ServiceItem) => {
    setEditing(s);
    setFormOpen(true);
  };

  const closeForm = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditing(null);
  };

  const save = (values: ServiceFormValues) => {
    const onSuccess = () => closeForm(false);
    if (editing) updateService.mutate({ id: editing.id, values }, { onSuccess });
    else createService.mutate(values, { onSuccess });
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteService.mutate(deleting.id, { onSettled: () => setDeleting(null) });
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description="The services shown on website. Fees are managed in the Fees tab."
        action={
          <Button onClick={openCreate} className="rounded-md bg-title px-4 text-white hover:bg-title/90">
            <Plus className="h-4 w-4" /> Add service
          </Button>
        }
      />
      {isError ? (
        <div className="mt-6"><EmptyState title="Couldn't load services" text="Check your connection and refresh the page." /></div>
      ) : isLoading ? (
        <ServiceListSkeleton />
      ) : services.length === 0 ? (
        <div className="mt-6"><EmptyState title="No services yet" text="Add your first service to show it on the website." /></div>
      ) : (
        <ul className="mt-6 divide-y divide-navy-300/40 overflow-hidden rounded-2xl border border-navy-300/50 bg-white">
          {services.map((s) => (
            <li key={s.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
              <div className={`min-w-0 flex-1 ${s.isActive ? "" : "opacity-60"}`}>
                <h2 className="flex flex-wrap text-sm lg:text-lg items-center gap-2 font-semibold text-title">
                  {s.name}
                  {!s.isActive && (
                    <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-ink/60 ring-1 ring-navy-300/50">
                      Hidden
                    </span>
                  )}
                </h2>
                {s.description && <p className="mt-1 text-base leading-relaxed text-ink">{s.description}</p>}
                {s.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-4 ">
                    {s.tags.map((t) => <p className="text-base bg-title/10 text-ink px-3 rounded-xl" key={t}>{t}</p>)}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-1 self-end sm:self-start">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={s.isActive ? `Hide ${s.name}` : `Show ${s.name}`}
                  title={s.isActive ? "Hide from website" : "Show on website"}
                  disabled={toggleService.isPending && toggleService.variables?.id === s.id}
                  onClick={() => toggleService.mutate({ id: s.id, isActive: !s.isActive })}
                  className="text-ink/60 hover:text-title"
                >
                  {s.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Edit ${s.name}`} onClick={() => openEdit(s)} className="text-ink/60 hover:text-title">
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

      <ServiceFormDialog
        open={formOpen}
        onOpenChange={closeForm}
        service={editing}
        onSave={save}
        isSaving={createService.isPending || updateService.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && !deleteService.isPending && setDeleting(null)}
        title="Delete service?"
        description={<><span className="font-medium text-ink">{deleting?.name}</span> will be removed from the website.</>}
        confirmLabel={deleteService.isPending ? "Deleting..." : "Delete service"}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
export default ServicesSettingsPage;