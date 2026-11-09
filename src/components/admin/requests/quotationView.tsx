"use client";

import { CreditCard, Loader2, Mail, Pencil, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canEdit, canPay, formatDay, formatMoney, isPaid, quotationTotal } from "./requestStatus";
import { isFeeLine } from "./quotationItems";
import { useSendQuotation } from "@/hooks/useAdminRequest";

const num = (n: any) => Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

const QuotationView = ({ request, onEdit, onPay }: { request: any; onEdit?: () => void; onPay?: () => void }) => {
  const sendQuotation = useSendQuotation();
  const q = request.quotation;
  if (!q) return null;

  const total = Number(q.total ?? quotationTotal(q.items));
  const expired = q.validUntil && new Date(`${q.validUntil}T23:59:59`) < new Date();
  const editable = canEdit(request) && !(Number(request.amountPaid ?? 0) > 0);

  return (
    <div className="p-5 sm:p-10">
      <div className="print-area space-y-5">
        <div className="flex items-start justify-between gap-4 pr-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Quotation</p>
            <h2 className="text-lg font-semibold text-gray-900">{q.number}</h2>
            <p className="text-sm text-gray-500">
              For {request.reference} · {request.service}
            </p>
          </div>
          <div className="text-right text-base">
            <p className="font-medium text-gray-900">
              {request.firstName} {request.lastName}
            </p>
            <p className="text-gray-500">{request.email}</p>
            <p className="text-gray-500">{request.whatsapp}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <Info label="Date">{formatDay(q.createdAt)}</Info>
          <Info label="Valid until" tone={expired ? "red" : undefined}>
            {q.validUntil ? formatDay(q.validUntil) : "—"} {expired && "(expired)"}
          </Info>
          <Info label="Payment" tone={isPaid(request) ? "green" : "amber"}>
            {isPaid(request) ? "Paid" : Number(request.amountPaid ?? 0) > 0 ? `Paid ${formatMoney(request.amountPaid, q.currency)}` : "Not paid yet"}
          </Info>
          <Info label="Emailed" tone={q.sentAt ? undefined : "amber"}>
            {q.sentAt ? formatDay(q.sentAt) : "Not sent yet"}
          </Info>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 text-sm uppercase tracking-wide text-gray-600">
            <tr>
              <th className="py-2 text-left font-medium">Description</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Unit price</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {q.items.map((it: any, i: number) => (
              <tr key={i}>
                <td className="py-2 text-gray-900">
                  {it.description}
                  {isFeeLine(it) && (
                    <span className="ml-2 rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary print:hidden">Our fee</span>
                  )}
                </td>
                <td className="py-2 text-right tabular-nums text-gray-600">{num(it.quantity)}</td>
                <td className="py-2 text-right tabular-nums text-gray-600">{num(it.unitPrice)}</td>
                <td className="py-2 text-right font-medium tabular-nums text-gray-900">{num(Number(it.quantity) * Number(it.unitPrice))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td colSpan={3} className="py-3 text-right font-medium text-gray-600">
                Total
              </td>
              <td className="py-3 text-right text-lg font-semibold tabular-nums text-gray-900">{formatMoney(total, q.currency)}</td>
            </tr>
          </tfoot>
        </table>

        {q.note && <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">{q.note}</p>}
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" className="gap-1.5" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print / PDF
        </Button>
        {canEdit(request) && (
          <Button variant="outline" className="gap-1.5" disabled={sendQuotation.isPending} onClick={() => sendQuotation.mutate(request.id)}>
            {sendQuotation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {q.sentAt ? "Email again" : "Email to customer"}
          </Button>
        )}
        {onEdit && editable && (
          <Button variant="outline" className="gap-1.5" onClick={onEdit}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        )}
        {onPay && canPay(request) && (
          <Button className="gap-1.5" onClick={onPay}>
            <CreditCard className="h-4 w-4" /> Pay {formatMoney(Number(request.balance ?? total), q.currency)}
          </Button>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, tone, children }: { label: string; tone?: "red" | "green" | "amber"; children: React.ReactNode }) => (
  <div className="rounded-lg border border-gray-100 px-3 py-2">
    <p className="text-gray-500">{label}</p>
    <p
      className={
        tone === "red" ? "font-medium text-red-600" : tone === "green" ? "font-medium text-emerald-700" : tone === "amber" ? "font-medium text-amber-700" : "font-medium text-gray-900"
      }
    >
      {children}
    </p>
  </div>
);
export default QuotationView;
