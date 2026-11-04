"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleDot, Layers, Pencil, Plus, Power, PowerOff, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState, PageHeader, selectClass } from "@/components/admin/setting-ui";
import ServiceFeeFormDialog from "@/components/admin/forms/feesForm";
import { useServices } from "@/hooks/useService";
import {
  formatFee,
  type ServiceFeeFormValues,
  type ServiceFeeItem,
  useCreateServiceFee,
  useDeleteServiceFee,
  useServiceFees,
  useToggleServiceFee,
  useUpdateServiceFee,
} from "@/hooks/useFees";
import { cn } from "../../../../../lib/utils";
import SearchInput from "@/components/shared/SearchInput";
import FilterSelect from "@/components/shared/FilterSelect";
import FeeGroupsSkeleton from "@/components/admin/skeleton/feesSkeleton";

const useDebounced = <T,>(value: T, delay = 350) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const ServiceFeesPage = () => {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "off">("all");
  const [editing, setEditing] = useState<ServiceFeeItem | null>(null);
  const [defaultServiceId, setDefaultServiceId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ServiceFeeItem | null>(null);

  const search = useDebounced(query);
  const { data, isLoading, isFetching, isError } = useServiceFees({
    search,
    serviceId: serviceFilter,
    isActive: statusFilter === "all" ? "all" : statusFilter === "active",
  });
  const { data: servicesData } = useServices();

  const createFee = useCreateServiceFee();
  const updateFee = useUpdateServiceFee();
  const toggleFee = useToggleServiceFee();
  const deleteFee = useDeleteServiceFee();

  const fees = data?.fees ?? [];
  const services = servicesData?.services ?? [];
  const hasFilters = !!query || serviceFilter !== "all" || statusFilter !== "all";

  const groups = useMemo(() => {
    const map = new Map<string, { key: string; serviceId: string | null; title: string; fees: ServiceFeeItem[] }>();
    for (const f of fees) {
      const key = f.serviceId ?? "general";
      const g = map.get(key) ?? { key, serviceId: f.serviceId, title: f.serviceName ?? "General fees", fees: [] };
      g.fees.push(f);
      map.set(key, g);
    }
    return [...map.values()].sort((a, b) => (a.serviceId === null ? -1 : b.serviceId === null ? 1 : a.title.localeCompare(b.title)));
  }, [fees]);

  const openCreate = (serviceId: string | null = null) => {
    setEditing(null);
    setDefaultServiceId(serviceId ?? (serviceFilter !== "all" && serviceFilter !== "none" ? serviceFilter : null));
    setFormOpen(true);
  };

  const openEdit = (fee: ServiceFeeItem) => {
    setEditing(fee);
    setFormOpen(true);
  };

  const closeForm = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditing(null);
  };


  const save = (values: ServiceFeeFormValues) => {
    const onSuccess = () => closeForm(false);
    if (editing) updateFee.mutate({ id: editing.id, values }, { onSuccess });
    else createFee.mutate(values, { onSuccess });
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteFee.mutate(deleting.id, { onSettled: () => setDeleting(null) });
  };

  return (
    <div>
      <PageHeader
        title="Fees"
        description="Manage the fees charged for services, including general fees and service-specific charges."
        action={
          <Button onClick={() => openCreate()} className="rounded-md bg-title px-4 text-white hover:bg-title/90">
            <Plus className="h-4 w-4" /> Add Fee
          </Button>
        }
      />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={query} onChange={setQuery} placeholder="Search fee or service" label="Search fees" loading={isFetching} />

        <FilterSelect
          label="Service"
          icon={Layers}
          heading="Filter by service"
          value={serviceFilter}
          onChange={setServiceFilter}
          className="sm:w-56"
          options={[
            { value: "all", label: "All services" },
            ...services.map((s, i) => ({ value: s.id, label: s.name, separatorBefore: i === 0 })),
          ]}
        />

        <FilterSelect
          label="Status"
          icon={CircleDot}
          showLabel
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as typeof statusFilter)}
          className="sm:w-48"
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active", dot: "bg-emerald-500" },
            { value: "off", label: "Turned off", dot: "bg-ink/30" },
          ]}
        />
      </div>

      <p className={cn("mt-4 text-sm text-ink/55", isFetching && !isLoading && "opacity-60")}>
        {isLoading ? "Loading fees…" : `${data?.total ?? 0} fee${data?.total === 1 ? "" : "s"}`}
      </p>

      {isError ? (
        <div className="mt-4"><EmptyState title="Couldn't load fees" text="Check your connection and refresh the page." /></div>
      ) : isLoading ? (
        <FeeGroupsSkeleton />
      ) : fees.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={hasFilters ? "No fees found" : "No fees yet"}
            text={hasFilters ? "Try a different search or filter." : "Add a general fee (e.g. Follow-up fee) or a fee for a specific service."}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map((g) => (
            <section key={g.key} className="overflow-hidden rounded-2xl border border-navy-300/50 bg-white">
              <header className="flex items-center justify-between gap-3 border-b border-navy-300/40 bg-navy-50/40 px-5 py-3">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-sm lg:text-lg text-title">{g.title}</h2>
                  <p className="text-sm text-ink/60">
                    {g.serviceId ? "Charged for this service" : "General amount charged for a service/assistance"} · {g.fees.length} fee{g.fees.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openCreate(g.serviceId)} className="shrink-0 text-title">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </header>

              <ul className="divide-y divide-navy-300/40">
                {g.fees.map((f) => (
                  <li key={f.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                    <div className={cn("min-w-0 flex-1", !f.isActive && "opacity-60")}>
                      <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                        {f.name}
                        {!f.isActive && (
                          <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-ink/60 ring-1 ring-navy-300/50">Off</span>
                        )}
                      </p>
                      {f.description && <p className="mt-0.5 text-base leading-relaxed text-ink/60">{f.description}</p>}
                    </div>

                    <p className={cn("shrink-0 text-lg font-semibold tabular-nums text-title sm:min-w-28 sm:text-right", !f.isActive && "opacity-60")}>
                      {formatFee(f.amount, f.currency)}
                    </p>

                    <div className="flex shrink-0 gap-1 self-end sm:self-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={f.isActive ? `Turn off ${f.name}` : `Turn on ${f.name}`}
                        title={f.isActive ? "Turn off" : "Turn on"}
                        disabled={toggleFee.isPending && toggleFee.variables?.id === f.id}
                        onClick={() => toggleFee.mutate({ id: f.id, isActive: !f.isActive })}
                        className={f.isActive ? "text-ink/60 hover:text-amber-600" : "text-ink/60 hover:text-emerald-600"}
                      >
                        {f.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Edit ${f.name}`} onClick={() => openEdit(f)} className="text-ink/60 hover:text-title">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Delete ${f.name}`} onClick={() => setDeleting(f)} className="text-ink/60 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <ServiceFeeFormDialog
        open={formOpen}
        onOpenChange={closeForm}
        fee={editing}
        defaultServiceId={defaultServiceId}
        onSave={save}
        isSaving={createFee.isPending || updateFee.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && !deleteFee.isPending && setDeleting(null)}
        title="Delete fee?"
        description={
          <>
            <span className="font-medium text-ink">{deleting?.name}</span>
            {deleting?.serviceName ? ` (${deleting.serviceName})` : ""} will no longer be available.
          </>
        }
        confirmLabel={deleteFee.isPending ? "Deleting..." : "Delete fee"}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
export default ServiceFeesPage;