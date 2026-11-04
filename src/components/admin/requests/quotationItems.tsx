"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { formatMoney, quotationTotal } from "../requests/requestStatus";

const inputClass = "h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50";

export const emptyLine = (description = "") => ({ description, quantity: 1, unitPrice: 0 });

// Quotation lines, used inside the request edit form
// value: { items, validUntil, note }
const QuotationItems = ({ value, onChange, currency = "RWF" }: { value: any; onChange: (v: any) => void; currency?: string }) => {
  const items: any[] = value.items ?? [];
  const set = (patch: any) => onChange({ ...value, ...patch });
  const setItem = (i: number, key: string, v: any) =>
    set({ items: items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)) });

  return (
    <div className="space-y-3">
      <div className="hidden grid-cols-[1fr_64px_110px_100px_32px] gap-2 px-1 text-sm font-medium uppercase tracking-wide mt-4  text-ink/80 sm:grid">
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Unit price</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      {items.map((it, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_32px] gap-2 rounded-lg border border-gray-100 bg-white p-2 sm:grid-cols-[1fr_64px_110px_100px_32px] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
        >
          <input value={it.description} onChange={(e) => setItem(i, "description", e.target.value)} placeholder="e.g. Passport fee" aria-label="Description" className={inputClass} />
          <button
            type="button"
            aria-label="Remove line"
            disabled={items.length === 1}
            onClick={() => set({ items: items.filter((_, idx) => idx !== i) })}
            className="row-span-2 flex h-9 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 sm:order-last sm:row-span-1"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="grid grid-cols-3 gap-2 sm:contents">
            <input type="number" min={1} value={it.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)} aria-label="Quantity" className={cn(inputClass, "text-right")} />
            <input type="number" min={0} step={100} value={it.unitPrice} onChange={(e) => setItem(i, "unitPrice", e.target.value)} aria-label="Unit price" className={cn(inputClass, "text-right")} />
            <p className="flex h-9 items-center justify-end text-sm font-medium tabular-nums text-gray-900">
              {(Number(it.quantity || 0) * Number(it.unitPrice || 0)).toLocaleString()}
            </p>
          </div>
        </div>
      ))}

      <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-primary" onClick={() => set({ items: [...items, emptyLine()] })}>
        <Plus className="h-4 w-4" /> Add line
      </Button>

      <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-gray-200">
        <span className="text-base font-medium text-gray-600">Quotation total</span>
        <span className="text-lg font-semibold tabular-nums text-gray-900">{formatMoney(quotationTotal(items), currency)}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Valid until</label>
          <input type="date" value={value.validUntil ?? ""} onChange={(e) => set({ validUntil: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Note on the quotation</label>
          <input value={value.note ?? ""} onChange={(e) => set({ note: e.target.value })} maxLength={300} placeholder="Optional" className={inputClass} />
        </div>
      </div>
    </div>
  );
};

export default QuotationItems;