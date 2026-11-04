"use client";

import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
  loading = false,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  loading?: boolean;
  className?: string;
}) => (
  <label className={cn("relative block min-w-0 flex-1", className)}>
    <span className="sr-only">{label}</span>
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Escape" && value && onChange("")}
      placeholder={placeholder}
      className={cn(
        "h-10 w-full rounded-xl border bg-white pl-9 pr-16 text-sm text-ink  outline-none transition-colors",
        "placeholder:text-ink/40  focus:border-navy-300/60",
        "[&::-webkit-search-cancel-button]:hidden",
      )}
    />
    <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
      {loading && <Loader2 className="h-4 w-4 animate-spin text-ink/35" aria-hidden />}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="flex h-6 w-6 items-center justify-center rounded-md text-ink/40 hover:bg-navy-50 hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  </label>
);
export default SearchInput;
