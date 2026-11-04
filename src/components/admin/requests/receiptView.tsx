"use client";

import { CheckCircle2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatMoney, hasQuotation } from "./requestStatus";

// Proof of payment, printed / saved as PDF when the customer asks for it
const ReceiptView = ({ request }: { request: any }) => {
  const p = request.payment;
  if (!p?.paid) return null;

  // Lines: the quotation lines, or one line for the service
  const lines = hasQuotation(request)
    ? request.quotation.items
    : [{ description: request.service, quantity: 1, unitPrice: p.amount }];

  return (
    <div className="p-5 sm:p-6">
      <div className="print-area space-y-5">
        <div className="flex items-start justify-between gap-4 pr-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Payment receipt</p>
            <h2 className="text-lg font-semibold text-gray-900">{p.receiptNumber ?? request.reference.replace("REQ", "RCT")}</h2>
            <p className="text-sm text-gray-500">For {request.reference} · {request.service}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <CheckCircle2 className="h-4 w-4" /> Paid
          </span>
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-gray-100 px-3 py-2">
            <p className="text-xs text-gray-500">Received from</p>
            <p className="font-medium text-gray-900">{request.firstName} {request.lastName}</p>
            <p className="text-xs text-gray-500">{request.email} · {request.whatsapp}</p>
          </div>
          <div className="rounded-lg border border-gray-100 px-3 py-2">
            <p className="text-xs text-gray-500">Payment</p>
            <p className="font-medium text-gray-900">{p.method ?? "Mobile money"} · {p.phone}</p>
            <p className="text-xs text-gray-500">{formatDate(p.paidAt)}</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="py-2 text-left font-medium">Description</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lines.map((it: any, i: number) => (
              <tr key={i}>
                <td className="py-2 text-gray-900">{it.description}</td>
                <td className="py-2 text-right tabular-nums text-gray-600">{it.quantity}</td>
                <td className="py-2 text-right font-medium tabular-nums text-gray-900">{(it.quantity * it.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td colSpan={2} className="py-3 text-right font-medium text-gray-600">Total paid</td>
              <td className="py-3 text-right text-lg font-semibold tabular-nums text-gray-900">{formatMoney(p.amount, p.currency)}</td>
            </tr>
          </tfoot>
        </table>

        <p className="text-center text-xs text-gray-400">Thank you. Keep this receipt as proof of payment.</p>
      </div>

      <div className="mt-5 flex justify-end">
        <Button variant="outline" className="gap-1.5" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print / PDF
        </Button>
      </div>
    </div>
  );
};

export default ReceiptView;