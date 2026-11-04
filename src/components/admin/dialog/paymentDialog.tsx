"use client";

import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { amountDue, currencyOf, formatMoney, hasQuotation } from "../requests/requestStatus";

// The amount is always fixed: from the quotation or the amount agreed in Edit
const PaymentDialog = ({
  request,
  onConfirm,
  onCancel,
  isLoading,
}: {
  request: any;
  onConfirm: (payment: { amount: number; currency: string; phone: string; method: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) => {
  const amount = amountDue(request);
  const currency = currencyOf(request);
  const [phone, setPhone] = useState(request?.whatsapp ?? "+250");
  const phoneOk = /^\+\d{8,15}$/.test(phone.replace(/\s/g, ""));

  return (
    <div className="space-y-5 p-5 sm:p-6">
      <div className="pr-8">
        <h2 className="text-lg font-semibold text-gray-900">Make payment</h2>
        <p className="text-sm text-gray-500">{request?.reference} · {request?.service}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {hasQuotation(request) ? `Amount from quotation ${request.quotation.number}` : "Amount agreed with the customer"}
        </p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{formatMoney(amount, currency)}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="pay-phone" className="block text-sm font-medium text-gray-700">Mobile money number</label>
        <div className="relative">
          <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="pay-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={cn(
              "h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2",
              phoneOk ? "border-gray-200 focus:ring-primary/30" : "border-red-300 focus:ring-red-200",
            )}
          />
        </div>
        <p className="text-xs text-gray-500">The customer gets a prompt on this phone to approve the payment.</p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button
          onClick={() => onConfirm({ amount, currency, phone: phone.replace(/\s/g, ""), method: "Mobile money" })}
          disabled={!phoneOk || amount <= 0 || isLoading}
          className="gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Pay {formatMoney(amount, currency)}
        </Button>
      </div>
    </div>
  );
};

export default PaymentDialog;