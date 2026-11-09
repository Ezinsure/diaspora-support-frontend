"use client";

import { Lock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { formatMoney, quotationTotal } from "../requests/requestStatus";

const inputClass = "h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50";
const errorInput = "border-red-300 focus:ring-red-200";
const grid = "sm:grid-cols-[1fr_64px_110px_110px_32px]";

const num = (n: any) => Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

export const emptyLine = (description = "") => ({ description, quantity: 1, unitPrice: "" as number | string });

// Line 1 (the support fee) carries feeId
export const isFeeLine = (i: any) => !!i?.feeId;

// Saved quotation 
export const splitQuotation = (items: any[] = []) => ({
  feeLine: items.find(isFeeLine) ?? null,
  extra: items.filter((i) => !isFeeLine(i)),
});

const QuotationItems = ({
  value,
  onChange,
  feeLine,
  currency = "USD",
  errors = {},
}: {
  value: any;
  onChange: (v: any) => void;
  feeLine: any;
  currency?: string;
  errors?: Record<string, string>;
}) => {
  const items: any[] = value.items ?? [];
  const set = (patch: any) => onChange({ ...value, ...patch });
  const setItem = (i: number, key: string, v: any) => set({ items: items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)) });

  const all = feeLine ? [feeLine, ...items] : items;
  const err = (i: number, key: string) => errors[`items.${i}.${key}`];

  return (
    <div className="space-y-3">
      <div className={cn("mt-4 hidden gap-2 px-1 text-sm font-medium uppercase tracking-wide text-ink/80 sm:grid", grid)}>
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Unit price</span>
        <span className="text-right">Amount</span>
        <span />
      </div>


      {feeLine && (
        <div className={cn("grid grid-cols-[1fr_32px] gap-2 rounded-lg bg-primary/5 p-2 ring-1 ring-primary/15 sm:items-center", grid)}>
          <div className="flex h-8 min-w-0 items-center gap-2 px-1 text-base font-medium text-gray-900">
            <span className="truncate">{feeLine.description}</span>
            <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">Our fee</span>
          </div>
          <span
            title="Our fee is on every quotation"
            className="row-span-2 flex h-8 w-8 items-center justify-center text-primary/60 sm:order-last sm:row-span-1"
          >
            <Lock className="h-4 w-4" />
          </span>
          <div className="grid grid-cols-3 gap-2 text-base tabular-nums sm:contents">
            <p className="flex h-9 items-center justify-end text-gray-600">{num(feeLine.quantity)}</p>
            <p className="flex h-9 items-center justify-end text-gray-600">{num(feeLine.unitPrice)}</p>
            <p className="flex h-9 items-center justify-end font-medium text-gray-900">{num(feeLine.quantity * feeLine.unitPrice)}</p>
          </div>
        </div>
      )}


      {items.map((it, i) => (
        <div
          key={i}
          className={cn(
            "grid grid-cols-[1fr_32px] gap-2 rounded-lg border border-gray-100 bg-white p-2 sm:items-center sm:border-0 sm:bg-transparent sm:p-0",
            grid,
          )}
        >
          <input
            value={it.description}
            onChange={(e) => setItem(i, "description", e.target.value)}
            placeholder="e.g. Passport fee"
            aria-label="Description"
            maxLength={200}
            className={cn(inputClass, err(i, "description") && errorInput)}
          />
          <button
            type="button"
            aria-label="Remove line"
            onClick={() => set({ items: items.filter((_, idx) => idx !== i) })}
            className="row-span-2 flex h-9 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 sm:order-last sm:row-span-1"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="grid grid-cols-3 gap-2 sm:contents">
            <input
              type="number"
              min={1}
              step="any"
              value={it.quantity}
              onChange={(e) => setItem(i, "quantity", e.target.value)}
              aria-label="Quantity"
              className={cn(inputClass, "text-right", err(i, "quantity") && errorInput)}
            />
            <input
              type="number"
              min={0}
              step="0.01"
              value={it.unitPrice}
              onChange={(e) => setItem(i, "unitPrice", e.target.value)}
              placeholder="0"
              aria-label="Unit price"
              className={cn(inputClass, "text-right", err(i, "unitPrice") && errorInput)}
            />
            <p className="flex h-9 items-center justify-end text-sm font-medium tabular-nums text-gray-900">
              {num(Number(it.quantity || 0) * Number(it.unitPrice || 0))}
            </p>
          </div>
          {(err(i, "description") || err(i, "quantity") || err(i, "unitPrice")) && (
            <p className="col-span-2 text-xs text-red-600 sm:col-span-5">{err(i, "description") || err(i, "quantity") || err(i, "unitPrice")}</p>
          )}
        </div>
      ))}

      <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-primary" onClick={() => set({ items: [...items, emptyLine()] })}>
        <Plus className="h-4 w-4" /> Add line
      </Button>
      {errors.items && <p className="text-xs text-red-600">{errors.items}</p>}

      <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-600">Quotation total</span>
          <span className="text-lg font-semibold tabular-nums text-gray-900">{formatMoney(quotationTotal(all), currency)}</span>
        </div>
        <p className="text-xs text-gray-500">All amounts are in {currency}, the currency of our fee.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Valid until</label>
          <input
            type="date"
            value={value.validUntil ?? ""}
            onChange={(e) => set({ validUntil: e.target.value })}
            className={cn(inputClass, errors.validUntil && errorInput)}
          />
          {errors.validUntil && <p className="text-xs text-red-600">{errors.validUntil}</p>}
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Note on the quotation</label>
          <input
            value={value.note ?? ""}
            onChange={(e) => set({ note: e.target.value })}
            maxLength={1000}
            placeholder="Optional, e.g. Government fees are paid at the embassy"
            className={cn(inputClass, errors.note && errorInput)}
          />
          {errors.note && <p className="text-xs text-red-600">{errors.note}</p>}
        </div>
      </div>
    </div>
  );
};
export default QuotationItems;
