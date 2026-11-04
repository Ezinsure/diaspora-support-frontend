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
import { Field, selectClass } from "@/components/admin/setting-ui";
import { useServices } from "@/hooks/useService";
import { CURRENCIES, formatFee, type ServiceFeeFormValues, type ServiceFeeItem } from "@/hooks/useFees";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { serviceFeeSchema, validate, type FieldErrors } from "@/components/shared/FormValidation";

const FieldError = ({ text }: { text?: string }) => (text ? <p className="mt-1 text-xs text-destructive">{text}</p> : null);

const ServiceFeeFormDialog = ({
  open,
  onOpenChange,
  fee,
  defaultServiceId = null,
  onSave,
  isSaving = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee: ServiceFeeItem | null;
  defaultServiceId?: string | null;
  onSave: (data: ServiceFeeFormValues) => void;
  isSaving?: boolean;
}) => (
  <AlertDialog open={open} onOpenChange={(o) => !isSaving && onOpenChange(o)}>
    <AlertDialogContent className="sm:max-w-2xl! px-6!">
      {open && (
        <ServiceFeeForm
          key={fee?.id ?? `new-${defaultServiceId ?? "general"}`}
          fee={fee}
          defaultServiceId={defaultServiceId}
          onCancel={() => onOpenChange(false)}
          onSave={onSave}
          isSaving={isSaving}
        />
      )}
    </AlertDialogContent>
  </AlertDialog>
);

export const ServiceFeeForm = ({
  fee,
  defaultServiceId = null,
  onCancel,
  onSave,
  isSaving = false,
}: {
  fee: ServiceFeeItem | null;
  defaultServiceId?: string | null;
  onCancel: () => void;
  onSave: (data: ServiceFeeFormValues) => void;
  isSaving?: boolean;
}) => {
  const [name, setName] = useState(fee?.name ?? "");
  const [serviceId, setServiceId] = useState<string>(fee ? (fee.serviceId ?? "") : (defaultServiceId ?? ""));
  const [amount, setAmount] = useState<string>(fee ? String(fee.amount) : "");
  const [currency, setCurrency] = useState(fee?.currency ?? "USD");
  const [description, setDescription] = useState(fee?.description ?? "");
  const [isActive, setIsActive] = useState(fee?.isActive ?? true);
  const [errors, setErrors] = useState<FieldErrors>({});

  const { data: servicesData } = useServices();
  const services = servicesData?.services ?? [];

  const serviceItems = services.map((s) => ({ value: s.id, label: s.isActive ? s.name : `${s.name} (hidden)` }));

  const amountNum = Number(amount);
  const amountOk = amount !== "" && amountNum >= 0 && Number.isFinite(amountNum);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const result = validate(serviceFeeSchema, { name, serviceId, amount, currency, description, isActive });
        if (!result.ok) return setErrors(result.errors);
        onSave({
          name: result.data.name,
          serviceId: result.data.serviceId,
          amount: result.data.amount,
          currency: result.data.currency,
          description: result.data.description,
          isActive: result.data.isActive,
        });
      }}
    >
      <AlertDialogHeader className="text-left">
        <AlertDialogTitle>{fee ? "Edit fee" : "Add fee"}</AlertDialogTitle>
        <AlertDialogDescription>Our fee for the help and follow-up.</AlertDialogDescription>
      </AlertDialogHeader>

      <fieldset disabled={isSaving} className="grid gap-4 py-5 sm:grid-cols-2">
        <Field label="Fee name" htmlFor="feeName" className="sm:col-span-2" hint="e.g. Follow-up fee, New application, Express">
          <Input id="feeName" value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} />
        </Field>

        <Field label="Service" htmlFor="feeService" className="sm:col-span-2" hint="Leave as General if it applies to any request.">
          <Select items={serviceItems} value={serviceId || null} onValueChange={(v: any) => setServiceId(v ? String(v) : "")}>
            <SelectTrigger id="feeService" className={cn(selectClass, errors.serviceId && "border-destructive")}>
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>

            <SelectContent className="max-h-72">
              {services.length === 0 ? (
                <p className="px-3 py-2 text-sm text-ink/50">No services yet. Create one first.</p>
              ) : (
                services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    <span className="flex w-full items-center gap-2">
                      <span className="truncate">{s.name}</span>
                      {!s.isActive && (
                        <span className="ml-auto rounded-md bg-navy-50 px-1.5 py-0.5 text-[11px] font-medium text-ink/50">Hidden</span>
                      )}
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FieldError text={errors.serviceId} />
        </Field>

        <Field label="Amount" htmlFor="feeAmount" hint={amountOk && amount !== "" ? formatFee(amountNum, currency) : undefined}>
          <Input
            id="feeAmount"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </Field>

        <Field label="Currency" htmlFor="feeCurrency">
          <select id="feeCurrency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectClass}>
            {Array.from(new Set([...CURRENCIES, currency])).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Description" htmlFor="feeDesc" className="sm:col-span-2" hint="What it covers, conditions… (optional)">
          <Textarea id="feeDesc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-300/50 p-3 hover:bg-navy-50/50 sm:col-span-2">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium text-ink">Active</span>
            <span className="block text-xs text-ink/55">Turn off to stop using this fee without deleting it.</span>
          </span>
        </label>
      </fieldset>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90" disabled={isSaving || !amountOk}>
          {isSaving ? "Saving..." : fee ? "Save changes" : "Add fee"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};
export default ServiceFeeFormDialog;