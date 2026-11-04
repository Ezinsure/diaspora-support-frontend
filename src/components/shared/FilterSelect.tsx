"use client";

import type { LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
  dot?: string;
  description?: string;
  separatorBefore?: boolean;
};

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  label: string;
  showLabel?: boolean;
  icon?: LucideIcon;
  placeholder?: string;
  heading?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default";
};

const FilterSelect = ({
  value,
  onChange,
  options,
  label,
  showLabel = false,
  icon: Icon,
  placeholder = "Select…",
  heading,
  disabled,
  className,
  size = "default",
}: FilterSelectProps) => {
  const items = options.map((o) => ({ value: o.value, label: o.label }));
  const selected = options.find((o) => o.value === value);

  return (
    <Select items={items} value={value} onValueChange={(v) => v != null && onChange(String(v))} disabled={disabled}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "w-full min-w-0 justify-between gap-2 rounded-xl border-[0.5px] bg-white px-3 text-sm text-ink ",
          "transition-colors",
          "focus-visible:border-navy-300/60",
          "data-[popup-open]:border-title/40  data-[popup-open]:ring-title/10",
          size === "sm" ? "h-9" : "h-10",
          className,
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {Icon && <Icon className="h-4 w-4 shrink-0 text-ink/40" aria-hidden />}
          {showLabel && <span className="shrink-0 text-ink/45">{label}</span>}
          {showLabel && <span className="h-3.5 w-px shrink-0 bg-navy-300/70" aria-hidden />}
          {selected?.dot && <span className={cn("h-2 w-2 shrink-0 rounded-full", selected.dot)} aria-hidden />}
          <SelectValue placeholder={placeholder} className="truncate font-medium" />
        </span>
      </SelectTrigger>

      <SelectContent
        alignItemWithTrigger={false}
        align="start"
        sideOffset={6}
        className="max-h-80 min-w-[var(--anchor-width)] rounded-xl border-navy-300/50 bg-white p-1"
      >
        <SelectGroup>
          {heading && <SelectLabel className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink/40">{heading}</SelectLabel>}
          {options.map((o) => (
            <FilterItem key={o.value} option={o} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const FilterItem = ({ option: o }: { option: FilterOption }) => (
  <>
    {o.separatorBefore && <SelectSeparator className="my-1 bg-navy-300/40" />}
    <SelectItem
      value={o.value}
      className="cursor-pointer rounded-lg py-2 pl-2.5 pr-8 text-sm text-ink/80 data-[highlighted]:bg-navy-50 data-[highlighted]:text-ink data-[selected]:font-medium data-[selected]:text-title"
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        {o.dot && <span className={cn("h-2 w-2 shrink-0 rounded-full", o.dot)} aria-hidden />}
        <span className="min-w-0">
          <span className="block truncate">{o.label}</span>
          {o.description && <span className="block truncate text-xs font-normal text-ink/45">{o.description}</span>}
        </span>
        {o.count !== undefined && (
          <span className="ml-auto rounded-md bg-navy-50 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-ink/55">{o.count}</span>
        )}
      </span>
    </SelectItem>
  </>
);
export default FilterSelect;
