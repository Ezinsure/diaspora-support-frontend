"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import FilterSelect from "@/components/shared/FilterSelect";
import { cn } from "@/lib/utils";

export const PAGE_SIZES = [10, 20, 50, 100, 250, 500, 1000];

type PaginationProps = {
  page: number;
  totalPages: any;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizes?: number[];
  /** Disables the buttons while the next page loads */
  isFetching?: boolean;
  itemName?: string;
  className?: string;
};

const pageList = (page: number, totalPages: any): (number | "…")[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - 1, totalPages - 4));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5));
  const list: (number | "…")[] = [1];
  if (start > 2) list.push("…");
  for (let p = start; p <= end; p++) list.push(p);
  if (end < totalPages - 1) list.push("…");
  list.push(totalPages);
  return list;
};

const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  pageSizes = PAGE_SIZES,
  isFetching = false,
  itemName = "results",
  className,
}: PaginationProps) => {
  const pages = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), pages);
  const from = total === 0 ? 0 : (current - 1) * limit + 1;
  const to = Math.min(current * limit, total);
  const fmt = (n: number) => n.toLocaleString("en-US");

  const go = (p: number) => {
    const next = Math.min(Math.max(1, p), pages);
    if (next !== current) onPageChange(next);
  };

  const sizes = pageSizes.includes(limit) ? pageSizes : [...pageSizes, limit].sort((a, b) => a - b);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col gap-3 rounded-2xl border-b border-ink/10 bg-white px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4",
        isFetching && "opacity-80",
        className,
      )}
    >
      {/* Left: range + page size */}
      <div className="flex flex-wrap items-center  bg-white justify-between gap-x-4 gap-y-2 sm:justify-start">
        <p className="text-sm text-ink/60" aria-live="polite">
          {total === 0 ? (
            `No ${itemName}`
          ) : (
            <>
              Showing <span className="font-medium tabular-nums text-ink">{fmt(from)}–{fmt(to)}</span> of{" "}
              <span className="font-medium tabular-nums text-ink">{fmt(total)}</span> {itemName}
            </>
          )}
        </p>

        {onLimitChange && (
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <span className="hidden sm:inline">Rows</span>
            <FilterSelect
              label="Rows per page"
              size="sm"
              value={String(limit)}
              onChange={(v) => {
                onLimitChange(Number(v));
                onPageChange(1);
              }}
              options={sizes.map((n) => ({ value: String(n), label: fmt(n) }))}
              className="w-[5.5rem]"
            />
          </div>
        )}
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center justify-between gap-1 sm:justify-end">
        <PageButton label="First page" onClick={() => go(1)} disabled={current <= 1 || isFetching} className="hidden sm:flex">
          <ChevronsLeft className="h-4 w-4" />
        </PageButton>
        <PageButton label="Previous page" onClick={() => go(current - 1)} disabled={current <= 1 || isFetching} className="w-auto gap-1 px-2.5">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm sm:hidden">Prev</span>
        </PageButton>

        {/* Numbers (tablet / desktop) */}
        <ul className="hidden items-center gap-1 md:flex">
          {pageList(current, pages).map((p, i) =>
            p === "…" ? (
              <li key={`gap-${i}`} className="flex h-9 w-7 items-center justify-center text-sm text-ink/35" aria-hidden>
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => go(p)}
                  disabled={isFetching}
                  aria-label={`Page ${p}`}
                  aria-current={p === current ? "page" : undefined}
                  className={cn(
                    "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm tabular-nums transition-colors",
                    p === current ? "bg-title font-semibold text-white shadow-sm" : "text-ink/70 hover:bg-navy-50 hover:text-ink",
                  )}
                >
                  {fmt(p)}
                </button>
              </li>
            ),
          )}
        </ul>

        <span className="px-2 text-sm tabular-nums text-ink/60 md:hidden">
          Page <span className="font-medium text-ink">{fmt(current)}</span> of {fmt(pages)}
        </span>

        <PageButton label="Next page" onClick={() => go(current + 1)} disabled={current >= pages || isFetching} className="w-auto gap-1 px-2.5">
          <span className="text-sm sm:hidden">Next</span>
          <ChevronRight className="h-4 w-4" />
        </PageButton>
        <PageButton label="Last page" onClick={() => go(pages)} disabled={current >= pages || isFetching} className="hidden sm:flex">
          <ChevronsRight className="h-4 w-4" />
        </PageButton>
      </div>
    </nav>
  );
};

const PageButton = ({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-lg border border-navy-300/60 bg-white text-ink/70 transition-colors",
      "hover:border-navy-300 hover:bg-navy-50 hover:text-ink",
      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-title/10",
      "disabled:pointer-events-none disabled:opacity-40",
      className,
    )}
  >
    {children}
  </button>
);

export default Pagination;
