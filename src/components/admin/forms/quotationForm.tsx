"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { formatMoney, quotationTotal } from "../requests/requestStatus";

const emptyItem = () => ({ description: "", quantity: 1, unitPrice: 0 });

const inDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toLocaleDateString("en-CA", { timeZone: "Africa/Kigali" }); // YYYY-MM-DD
};

const inputClass = "h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30";

// Staff: create or edit the quotation of a request
const QuotationForm = ({
    request,
    onSubmit,
    onCancel,
    isLoading,
}: {
    request: any;
    onSubmit: (quotation: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}) => {
    const existing = request.quotation;
    const [items, setItems] = useState<any[]>(existing?.items?.length ? existing.items : [{ ...emptyItem(), description: request.service }]);
    const [validUntil, setValidUntil] = useState(existing?.validUntil ?? inDays(14));
    const [note, setNote] = useState(existing?.note ?? "");
    const [error, setError] = useState("");

    const currency = existing?.currency ?? "RWF";
    const total = quotationTotal(items);

    const setItem = (i: number, key: string, value: any) =>
        setItems((list) => list.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));

    const submit = (e: any) => {
        e.preventDefault();
        const clean = items
            .map((i) => ({ description: i.description.trim(), quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) }))
            .filter((i) => i.description);

        if (!clean.length) return setError("Add at least one line.");
        if (clean.some((i) => i.quantity < 1 || i.unitPrice < 0)) return setError("Quantity must be at least 1 and price can't be negative.");
        if (quotationTotal(clean) <= 0) return setError("The total must be more than 0.");

        setError("");
        onSubmit({
            number: existing?.number ?? request.reference.replace("REQ", "QT"),
            currency,
            items: clean,
            validUntil,
            note: note.trim(),
            createdAt: existing?.createdAt ?? new Date().toISOString(),
            updatedAt: existing ? new Date().toISOString() : undefined,
        });
    };

    return (
        <form onSubmit={submit} className="space-y-5 p-5 sm:p-6" noValidate>
            <div className="pr-8">
                <h2 className="text-lg font-semibold text-gray-900">{existing ? "Edit quotation" : "Make quotation"}</h2>
                <p className="text-sm text-gray-500">
                    {request.reference} · {request.firstName} {request.lastName} · {request.service}
                </p>
            </div>

            {/* Lines */}
            <div className="space-y-2">
                <div className="hidden grid-cols-[1fr_70px_120px_110px_32px] gap-2 px-1 text-xs font-medium uppercase tracking-wide text-gray-500 sm:grid">
                    <span>Description</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Unit price</span>
                    <span className="text-right">Amount</span>
                    <span />
                </div>

                {items.map((it, i) => (
                    <div key={i} className="grid grid-cols-[1fr_32px] gap-2 rounded-lg border border-gray-100 p-2 sm:grid-cols-[1fr_70px_120px_110px_32px] sm:items-center sm:border-0 sm:p-0">
                        <input
                            value={it.description}
                            onChange={(e) => setItem(i, "description", e.target.value)}
                            placeholder="e.g. Government fee"
                            aria-label="Description"
                            className={inputClass}
                        />
                        <button
                            type="button"
                            aria-label="Remove line"
                            disabled={items.length === 1}
                            onClick={() => setItems((list) => list.filter((_, idx) => idx !== i))}
                            className="row-span-2 flex h-9 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 sm:order-last sm:row-span-1"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="col-span-1 grid grid-cols-3 gap-2 sm:contents">
                            <input
                                type="number"
                                min={1}
                                value={it.quantity}
                                onChange={(e) => setItem(i, "quantity", e.target.value)}
                                aria-label="Quantity"
                                className={cn(inputClass, "text-right")}
                            />
                            <input
                                type="number"
                                min={0}
                                step={100}
                                value={it.unitPrice}
                                onChange={(e) => setItem(i, "unitPrice", e.target.value)}
                                aria-label="Unit price"
                                className={cn(inputClass, "text-right")}
                            />
                            <p className="flex h-9 items-center justify-end text-sm font-medium tabular-nums text-gray-900">
                                {(Number(it.quantity || 0) * Number(it.unitPrice || 0)).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}

                <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-primary" onClick={() => setItems((l) => [...l, emptyItem()])}>
                    <Plus className="h-4 w-4" /> Add line
                </Button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-600">Total</span>
                <span className="text-xl font-semibold tabular-nums text-gray-900">{formatMoney(total, currency)}</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <div className="space-y-1.5">
                    <label htmlFor="q-valid" className="block text-sm font-medium text-gray-700">Valid until</label>
                    <input id="q-valid" type="date" value={validUntil} min={inDays(0)} onChange={(e) => setValidUntil(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="q-note" className="block text-sm font-medium text-gray-700">Note for the customer</label>
                    <input id="q-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="Optional" className={inputClass} />
                </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {existing ? "Save quotation" : "Send quotation"}
                </Button>
            </div>
        </form>
    );
};

export default QuotationForm;