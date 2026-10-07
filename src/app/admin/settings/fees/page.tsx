// src/app/admin/settings/fees/page.tsx  →  /admin/settings/fees
"use client";

import { useMemo, useState } from "react";
import { Info, Pencil, Plus, Trash2 } from "lucide-react";
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
import { EmptyState, Field, PageHeader, SettingsSection, selectClass } from "@/components/admin/setting-ui";
import { mockOtherFees, mockServices, mockStandardFees, type OtherFee, type StandardFee } from "@/lib/mock/settings";
import { cn } from "../../../../../lib/utils";

const CURRENCY = "USD";

export default function FeesPage() {
  // TODO: load from API
  const [savedStandard, setSavedStandard] = useState<StandardFee[]>(mockStandardFees);
  const [standard, setStandard] = useState<StandardFee[]>(mockStandardFees);
  const [otherFees, setOtherFees] = useState<OtherFee[]>(mockOtherFees);
  const [editing, setEditing] = useState<OtherFee | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<OtherFee | null>(null);

  const isDirty = useMemo(() => JSON.stringify(standard) !== JSON.stringify(savedStandard), [standard, savedStandard]);
  const serviceName = (id: string) => mockServices.find((s) => s.id === id)?.name ?? "Service";

  const updateStandard = (serviceId: string, patch: Partial<StandardFee>) =>
    setStandard((list) => list.map((f) => (f.serviceId === serviceId ? { ...f, ...patch } : f)));

  const saveStandard = () => {
    if (standard.some((f) => !Number.isFinite(f.amount) || f.amount <= 0)) {
      return toast.error("Each fee must be greater than 0.");
    }
    setSavedStandard(standard); // TODO: API call
    toast.success("Standard fees saved");
  };

  const saveOther = (data: Omit<OtherFee, "id">) => {
    if (editing) {
      setOtherFees((list) => list.map((f) => (f.id === editing.id ? { ...f, ...data } : f)));
      toast.success("Fee updated");
    } else {
      setOtherFees((list) => [...list, { ...data, id: crypto.randomUUID() }]);
      toast.success("Fee added");
    }
    setFormOpen(false);
  };

  return (
    <div>
      <PageHeader title="Fees" description="Your private support fees. These are shown on the website and in quotes." />

      <p className="mt-6 flex items-start gap-2.5 rounded-xl bg-sand-100 px-4 py-3 text-sm leading-relaxed text-ink/80">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-clay-600" />
        Government fees are not set here. They are always shown as a separate line from your support fee.
      </p>

      <div className="mt-8">
        <SettingsSection title="Standard fees" description="The support fee for each service. Mark it as a starting price to show “from” on the website.">
          <ul className="divide-y divide-navy-300/40 rounded-2xl border border-navy-300/50 bg-white">
            {standard.map((fee) => (
              <li key={fee.serviceId} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <p className="flex-1 font-medium text-ink">{serviceName(fee.serviceId)}</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-ink/70">
                    <input
                      type="checkbox"
                      checked={fee.isStartingPrice}
                      onChange={(e) => updateStandard(fee.serviceId, { isStartingPrice: e.target.checked })}
                      className="h-4 w-4 accent-title"
                    />
                    Starting price
                  </label>
                  <div className="flex w-36 rounded-md shadow-xs">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-navy-50 px-2.5 text-xs text-ink/60">
                      {CURRENCY}
                    </span>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      inputMode="decimal"
                      aria-label={`${serviceName(fee.serviceId)} fee in ${CURRENCY}`}
                      value={Number.isFinite(fee.amount) ? fee.amount : ""}
                      onChange={(e) => updateStandard(fee.serviceId, { amount: e.target.valueAsNumber })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" disabled={!isDirty} onClick={() => setStandard(savedStandard)}>Discard</Button>
            <Button disabled={!isDirty} onClick={saveStandard} className="bg-title text-white hover:bg-title/90">Save fees</Button>
          </div>
        </SettingsSection>

        <SettingsSection title="Other fees" description="Extra or optional charges. Negotiable fees are agreed with the customer before work proceeds.">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus className="h-4 w-4" /> Add fee
            </Button>
          </div>

          {otherFees.length === 0 ? (
            <div className="mt-4"><EmptyState title="No other fees" /></div>
          ) : (
            <ul className="mt-4 divide-y divide-navy-300/40 rounded-2xl border border-navy-300/50 bg-white">
              {otherFees.map((fee) => (
                <li key={fee.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{fee.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">{fee.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                        fee.pricing === "negotiable"
                          ? "bg-sand-100 text-clay-600 ring-clay-600/20"
                          : "bg-navy-50 text-title ring-navy-300/60",
                      )}
                    >
                      {fee.pricing === "negotiable" ? "Negotiable" : `${CURRENCY} ${fee.amount}`}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" aria-label={`Edit ${fee.name}`} onClick={() => { setEditing(fee); setFormOpen(true); }} className="text-ink/60 hover:text-title">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Delete ${fee.name}`} onClick={() => setDeleting(fee)} className="text-ink/60 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SettingsSection>
      </div>

      <AlertDialog open={formOpen} onOpenChange={setFormOpen}>
        <AlertDialogContent className="sm:max-w-lg">
          {formOpen && <OtherFeeForm key={editing?.id ?? "new"} fee={editing} onCancel={() => setFormOpen(false)} onSave={saveOther} />}
        </AlertDialogContent>
      </AlertDialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete fee?"
        description={<><span className="font-medium text-ink">{deleting?.name}</span> will no longer appear in quotes.</>}
        confirmLabel="Delete fee"
        onConfirm={() => {
          setOtherFees((list) => list.filter((f) => f.id !== deleting?.id)); // TODO: API call
          toast.success("Fee deleted");
        }}
      />
    </div>
  );
}

function OtherFeeForm({
  fee,
  onCancel,
  onSave,
}: {
  fee: OtherFee | null;
  onCancel: () => void;
  onSave: (data: Omit<OtherFee, "id">) => void;
}) {
  const [name, setName] = useState(fee?.name ?? "");
  const [description, setDescription] = useState(fee?.description ?? "");
  const [pricing, setPricing] = useState<OtherFee["pricing"]>(fee?.pricing ?? "fixed");
  const [amount, setAmount] = useState<number>(fee?.amount ?? NaN);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name: name.trim(), description: description.trim(), pricing, amount: pricing === "fixed" ? amount : null });
      }}
    >
      <AlertDialogHeader className="text-left">
        <AlertDialogTitle>{fee ? "Edit fee" : "Add fee"}</AlertDialogTitle>
        <AlertDialogDescription>Customers must accept any extra fee before work proceeds.</AlertDialogDescription>
      </AlertDialogHeader>

      <div className="grid gap-4 py-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="feeName" className="sm:col-span-2">
          <Input id="feeName" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
        </Field>
        <Field label="Description" htmlFor="feeDesc" className="sm:col-span-2">
          <Textarea id="feeDesc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={240} />
        </Field>
        <Field label="Pricing" htmlFor="feePricing">
          <select id="feePricing" value={pricing} onChange={(e) => setPricing(e.target.value as OtherFee["pricing"])} className={selectClass}>
            <option value="fixed">Fixed amount</option>
            <option value="negotiable">Negotiable</option>
          </select>
        </Field>
        {pricing === "fixed" && (
          <Field label={`Amount (${CURRENCY})`} htmlFor="feeAmount">
            <Input
              id="feeAmount"
              type="number"
              min={1}
              step={1}
              value={Number.isFinite(amount) ? amount : ""}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
              required
            />
          </Field>
        )}
      </div>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90">{fee ? "Save changes" : "Add fee"}</Button>
      </AlertDialogFooter>
    </form>
  );
}