"use client";

import { CreditCard, Pencil, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canMakeQuotation, canPay, formatDay, formatMoney, isPaid, quotationTotal } from "./requestStatus";

// Read-only quotation, like a small invoice
const QuotationView = ({
  request,
  onEdit,
  onPay,
}: {
  request: any;
  onEdit?: () => void;
  onPay?: () => void;
}) => {
  const q = request.quotation;
  if (!q) return null;

  const total = quotationTotal(q.items);
  const expired = q.validUntil && new Date(`${q.validUntil}T23:59:59`) < new Date();

  return (
    <div className="p-5 sm:p-6">
      <div id="quotation-print" className="space-y-5">
        <div className="flex items-start justify-between gap-4 pr-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Quotation</p>
            <h2 className="text-lg font-semibold text-gray-900">{q.number}</h2>
            <p className="text-sm text-gray-500">For {request.reference} · {request.service}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium text-gray-900">{request.firstName} {request.lastName}</p>
            <p className="text-gray-500">{request.email}</p>
            <p className="text-gray-500">{request.whatsapp}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-lg border border-gray-100 px-3 py-2">
            <p className="text-gray-500">Date</p>
            <p className="font-medium text-gray-900">{formatDay(q.createdAt)}</p>
          </div>
          <div className="rounded-lg border border-gray-100 px-3 py-2">
            <p className="text-gray-500">Valid until</p>
            <p className={expired ? "font-medium text-red-600" : "font-medium text-gray-900"}>
              {q.validUntil ? formatDay(q.validUntil) : "—"} {expired && "(expired)"}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 px-3 py-2">
            <p className="text-gray-500">Payment</p>
            <p className={isPaid(request) ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
              {isPaid(request) ? "Paid" : "Not paid yet"}
            </p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
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
                <td className="py-2 text-gray-900">{it.description}</td>
                <td className="py-2 text-right tabular-nums text-gray-600">{it.quantity}</td>
                <td className="py-2 text-right tabular-nums text-gray-600">{Number(it.unitPrice).toLocaleString()}</td>
                <td className="py-2 text-right font-medium tabular-nums text-gray-900">{(it.quantity * it.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td colSpan={3} className="py-3 text-right font-medium text-gray-600">Total</td>
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
        {onEdit && canMakeQuotation(request) && (
          <Button variant="outline" className="gap-1.5" onClick={onEdit}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        )}
        {onPay && canPay(request) && (
          <Button className="gap-1.5" onClick={onPay}>
            <CreditCard className="h-4 w-4" /> Pay {formatMoney(total, q.currency)}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuotationView;