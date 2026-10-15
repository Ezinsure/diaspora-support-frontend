"use client";

import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { formatMoney, quotationTotal } from "../requests/requestStatus";

const inputClass = (ok = true) =>
    cn(
        "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:ring-2",
        ok ? "border-gray-200 focus:ring-primary/30" : "border-red-300 focus:ring-red-200",
    );

// With a quotation: the amount is fixed.
// Without one: the amount was agreed on WhatsApp/phone, so it is typed in.
const PaymentDialog = ({
    request,
    onConfirm,
    onCancel,
    isLoading,
}: {
    request: any;
    onConfirm: (payment: { amount: number; currency: string; phone: string }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}) => {
    const q = request?.quotation;
    const currency = q?.currency ?? "RWF";
    const fixedAmount = q ? quotationTotal(q.items) : null;

    const [amount, setAmount] = useState<string>(fixedAmount ? String(fixedAmount) : String(request?.payment?.amount ?? ""));
    const [phone, setPhone] = useState(request?.whatsapp ?? "+250");

    const amountNum = Number(amount);
    const amountOk = amountNum > 0;
    const phoneOk = /^\+\d{8,15}$/.test(phone.replace(/\s/g, ""));

    return (
        <div className="space-y-5 p-5 sm:p-6">
            <div className="pr-8">
                <h2 className="text-lg font-semibold text-gray-900">Make payment</h2>
                <p className="text-sm text-gray-500">{request?.reference} · {request?.service}</p>
            </div>

            {fixedAmount ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Amount from quotation {q.number}</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{formatMoney(fixedAmount, currency)}</p>
                </div>
            ) : (
                <div className="space-y-1.5">
                    <label htmlFor="pay-amount" className="block text-sm font-medium text-gray-700">Amount ({currency})</label>
                    <input
                        id="pay-amount"
                        type="number"
                        min={0}
                        step={100}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount agreed with us"
                        className={inputClass(amount === "" || amountOk)}
                    />
                    <p className="text-xs text-gray-500">No quotation for this request — enter the amount we agreed with you.</p>
                </div>
            )}

            <div className="space-y-1.5">
                <label htmlFor="pay-phone" className="block text-sm font-medium text-gray-700">Mobile money number</label>
                <div className="relative">
                    <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input id="pay-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn(inputClass(phoneOk), "pl-9")} />
                </div>
                <p className="text-xs text-gray-500">You'll get a prompt on this phone to approve the payment.</p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button
                    onClick={() => onConfirm({ amount: amountNum, currency, phone: phone.replace(/\s/g, "") })}
                    disabled={!amountOk || !phoneOk || isLoading}
                    className="gap-2"
                >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Pay {amountOk ? formatMoney(amountNum, currency) : ""}
                </Button>
            </div>
        </div>
    );
};

export default PaymentDialog;