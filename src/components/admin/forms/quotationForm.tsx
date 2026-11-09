"use client";

import { useState } from "react";
import { AlertTriangle, FileText, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuotationItems, { emptyLine, splitQuotation } from "../requests/quotationItems";
import { canEdit, formatMoney, inDays, isPaid } from "../requests/requestStatus";
import { useSaveQuotation, useSupportFee } from "@/hooks/useAdminRequest";
import { quotationSchema, validate, type FieldErrors } from "@/components/shared/FormValidation";


const isBlank = (i: any) => !String(i.description ?? "").trim() && !Number(i.unitPrice);


const QuotationForm = ({ request, onDone, onCancel }: { request: any; onDone: () => void; onCancel: () => void }) => {
  const existing = request.quotation;
  const { feeLine: keptLine, extra } = splitQuotation(existing?.items);

  // A saved quotation keeps its fee line
  const supportFee = useSupportFee(!keptLine);
  const save = useSaveQuotation();

  const feeLine =
    keptLine ??
    (supportFee.data ? { description: supportFee.data.name, quantity: 1, unitPrice: Number(supportFee.data.amount), feeId: supportFee.data.id } : null);
  const currency = keptLine ? existing.currency : supportFee.data?.currency;

  const [value, setValue] = useState<any>(() => ({
    items: existing ? extra.map((i: any) => ({ ...i })) : [emptyLine()],
    validUntil: existing?.validUntil ?? inDays(14),
    note: existing?.note ?? "",
  }));
  const [send, setSend] = useState(!existing); 
  const [errors, setErrors] = useState<FieldErrors>({});

  const locked = !canEdit(request) || isPaid(request) || Number(request.amountPaid ?? 0) > 0;
  const customer = [request.firstName, request.lastName].filter(Boolean).join(" ");

  const change = (v: any) => {
    setValue(v);
    if (Object.keys(errors).length) setErrors({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Skip empty lines, but remember where each line is on screen (for the errors)
    const kept = value.items.map((it: any, i: number) => ({ it, i })).filter((x: any) => !isBlank(x.it));
    const result = validate(quotationSchema, {
      items: kept.map((x: any) => ({ description: x.it.description, quantity: x.it.quantity, unitPrice: x.it.unitPrice })),
      validUntil: value.validUntil ?? "",
      note: value.note ?? "",
    });

    if (!result.ok) {
      const onScreen: FieldErrors = {};
      for (const [key, msg] of Object.entries(result.errors)) {
        const m = key.match(/^items\.(\d+)\.(.+)$/);
        onScreen[m ? `items.${kept[Number(m[1])].i}.${m[2]}` : key] = msg;
      }
      return setErrors(onScreen);
    }

    save.mutate(
      {
        id: request.id,
        data: {
          items: result.data.items, 
          validUntil: result.data.validUntil || null,
          note: result.data.note || null,
          send,
        },
      },
      { onSuccess: onDone },
    );
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5 p-5 sm:p-8">
      {/* Header */}
      <div className="flex items-start gap-3 pr-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-900">{existing ? `Edit quotation ${existing.number}` : "Make quotation"}</h2>
          <p className="truncate text-sm text-ink/70">
            {request.reference}
            {customer && ` · ${customer}`}
            {request.service && ` · ${request.service}`}
          </p>
        </div>
      </div>

      {locked ? (
        <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          {Number(request.amountPaid ?? 0) > 0
            ? `A payment of ${formatMoney(request.amountPaid, request.currency)} was recorded, so the quotation can't change anymore.`
            : "This request is closed, so the quotation can't change."}
        </div>
      ) : !keptLine && supportFee.isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading our fee…
        </div>
      ) : !feeLine ? (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Quotations can't be made yet: {(supportFee.error as any)?.response?.data?.message ?? "our support fee was not found"}.
            <span className="block text-xs text-amber-800/80">Check the support fee in Settings → Service fees (it must be active) and SUPPORT_FEE_ID in the API .env.</span>
          </span>
        </div>
      ) : (
        <>
          <QuotationItems value={value} onChange={change} feeLine={feeLine} currency={currency} errors={errors} />

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-3 hover:bg-gray-50">
            <input type="checkbox" checked={send} onChange={(e) => setSend(e.target.checked)} className="mt-0.5 h-4 w-4" />
            <span>
              <span className="block text-sm font-medium text-gray-800">{existing ? "Email the updated quotation" : "Email the quotation to the customer"}</span>
              <span className="block text-xs text-ink/60">
                Sent to {request.email}
                {existing?.sentAt ? ` · last sent ${new Date(existing.sentAt).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short" })}` : ""}
              </span>
            </span>
          </label>
        </>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={save.isPending}>
          {locked || !feeLine ? "Close" : "Cancel"}
        </Button>
        {!locked && feeLine && (
          <Button type="submit" disabled={save.isPending} className="gap-2">
            {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {send ? "Save and email" : "Save quotation"}
          </Button>
        )}
      </div>
    </form>
  );
};
export default QuotationForm;
