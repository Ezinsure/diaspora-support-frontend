"use client";

import { Fragment, useEffect, useState } from "react";
import { Activity, Boxes, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleDot, Globe, History, Layers, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader, selectClass } from "@/components/admin/setting-ui";
import {
  actionInfo,
  entityLabel,
  fieldLabel,
  formatLogTime,
  kigaliDay,
  LOG_ACTIONS,
  LOG_ENTITIES,
  showValue,
  useActivityLogs,
  type LogItem,
} from "@/hooks/useLogs";
import { cn } from "../../../../lib/utils";
import Pagination from "@/components/shared/Pagination";
import SearchInput from "@/components/shared/SearchInput";
import FilterSelect from "@/components/shared/FilterSelect";

const PAGE_SIZES = [25, 50, 100];


const DEFAULT_FROM = () => kigaliDay(-1);
const DEFAULT_TO = () => kigaliDay(0);

const useDebounced = <T,>(value: T, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const ActivityLogsPage = () => {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [entity, setEntity] = useState("all");
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [openId, setOpenId] = useState<string | null>(null);

  const debouncedSearch = useDebounced(search);
  const { data, isLoading, isFetching, isError } = useActivityLogs({
    search: debouncedSearch,
    action,
    entity,
    from,
    to,
    page,
    limit,
  });

  const logs = data?.logs ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const isDefaultRange = from === DEFAULT_FROM() && to === DEFAULT_TO();
  const hasFilters = !!search || action !== "all" || entity !== "all" || !isDefaultRange;

  // Every filter change goes back to page 1
  const withReset =
    <T,>(setter: (v: T) => void) =>
      (v: T) => {
        setter(v);
        setPage(1);
      };

  const clearFilters = () => {
    setSearch("");
    setAction("all");
    setEntity("all");
    setFrom(DEFAULT_FROM());
    setTo(DEFAULT_TO());
    setPage(1);
  };

  const showAllTime = () => {
    setFrom("");
    setTo("");
    setPage(1);
  };

  const rangeLabel = !from && !to ? "All time" : isDefaultRange ? "Yesterday and today" : `${from || "…"} → ${to || "…"}`;
  const firstRow = total ? (page - 1) * limit + 1 : 0;
  const lastRow = Math.min(page * limit, total);

  return (
    <div>
      <PageHeader title="Activity logs" description="Who did what, and when. Every change in the dashboard is recorded here." />

      {/* Filters */}
      <div className="mt-6 space-y-3 rounded-2xl border border-navy-300/50 bg-white p-3">
        <div className="flex flex-col gap-3 lg:flex-row">
  <SearchInput
    value={search}
    onChange={withReset(setSearch)}
    placeholder="Search a reference, a person, a word…"
    label="Search logs"
    loading={isFetching && !isLoading}
  />

  <FilterSelect
    label="Action"
    icon={Activity}
    heading="Filter by action"
    value={action}
    onChange={withReset(setAction)}
    className="lg:w-48"
    options={[
      { value: "all", label: "All actions" },
      ...LOG_ACTIONS.map((a, i) => ({ value: a.value, label: a.label, separatorBefore: i === 0 })),
    ]}
  />

  <FilterSelect
    label="Area"
    icon={Boxes}
    heading="Filter by area"
    value={entity}
    onChange={withReset(setEntity)}
    className="lg:w-52"
    options={[
      { value: "all", label: "Everything" },
      ...LOG_ENTITIES.map((e, i) => ({ value: e.value, label: e.label, separatorBefore: i === 0 })),
    ]}
  />
</div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-navy-300/50 bg-white px-2 py-1">
              <CalendarDays className="h-4 w-4 shrink-0 text-ink/40" />
              <input
                type="date"
                aria-label="From"
                value={from}
                max={to || undefined}
                onChange={(e) => withReset(setFrom)(e.target.value)}
                className="bg-transparent text-sm text-ink outline-none"
              />
              <span className="text-ink/40">–</span>
              <input
                type="date"
                aria-label="To"
                value={to}
                min={from || undefined}
                max={kigaliDay(0)}
                onChange={(e) => withReset(setTo)(e.target.value)}
                className="bg-transparent text-sm text-ink outline-none"
              />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={showAllTime} disabled={!from && !to}>
              All time
            </Button>
          </div>

          {hasFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="self-start text-ink/60">
              <X className="h-4 w-4" /> Clear filters
            </Button>
          )}
        </div>
      </div>

      <p className={cn("mt-4 text-sm text-ink/55", isFetching && !isLoading && "opacity-60")}>
        {isLoading ? "Loading activity…" : total ? `${firstRow}–${lastRow} of ${total} · ${rangeLabel}` : rangeLabel}
      </p>

      {isError ? (
        <div className="mt-4"><EmptyState title="Couldn't load the activity" text="Check your connection and refresh the page." /></div>
      ) : isLoading ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-300/50 bg-white">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3 border-b border-navy-300/30 p-4 last:border-0">
              <div className="h-5 w-20 animate-pulse rounded bg-navy-50" />
              <div className="h-5 flex-1 animate-pulse rounded bg-navy-50" />
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No activity found"
            text={!from && !to ? "Try another search or filter." : "Nothing happened in these dates. Try 'All time' or another filter."}
          />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-navy-300/40 overflow-hidden rounded-2xl border border-navy-300/50 bg-white">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} open={openId === log.id} onToggle={() => setOpenId(openId === log.id ? null : log.id)} />
          ))}
        </ul>
      )}

      {/* Pagination */}
      {total > 0 && (
        <Pagination
          className="mt-4"
          page={page}
          totalPages={totalPages}
          total={total ?? 0}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          isFetching={isFetching}
          itemName="fees"
        />
      )}
    </div>
  );
};

export default ActivityLogsPage;

const LogRow = ({ log, open, onToggle }: { log: LogItem; open: boolean; onToggle: () => void }) => {
  const a = actionInfo(log.action);
  const hasDetails = log.changes.length > 0 || !!log.ip || !!log.userAgent || !!log.entityId;

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasDetails}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-navy-50/40 disabled:cursor-default disabled:hover:bg-transparent"
      >
        <span className={cn("mt-0.5 inline-flex shrink-0 items-center rounded-full px-4 py-0.7 text-base font-medium ring-1 ring-inset", a.badge)}>
          {a.label}
        </span>
        <span className="min-w-0 flex-1">
          <p className="block text-base text-ink">{log.summary}</p>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-ink/50">
            <span className="font-medium text-ink/70">{log.actorName ?? "System / website"}</span>
            <span>·</span>
            <span>{entityLabel(log.entity)}</span>
            <span>·</span>
            <time dateTime={log.createdAt}>{formatLogTime(log.createdAt)}</time>
            {log.changes.length > 0 && (
              <>
                <span>·</span>
                <span>{log.changes.length} change{log.changes.length > 1 ? "s" : ""}</span>
              </>
            )}
          </span>
        </span>
        {hasDetails && <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-ink/50 transition-transform", open && "rotate-180")} />}
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4 sm:pl-[5.5rem]">
          {log.changes.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-navy-300/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-50/60 text-sm text-ink/60">
                  <tr>
                    <th className="px-3 py-2 font-medium">Field</th>
                    <th className="px-3 py-2 font-medium">Before</th>
                    <th className="px-3 py-2 font-medium">After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-300/30">
                  {log.changes.map((c, i) => (
                    <Fragment key={`${c.field}-${i}`}>
                      <tr className="align-top">
                        <td className="whitespace-nowrap px-3 py-2 font-medium text-ink/80">{fieldLabel(c.field)}</td>
                        <td className="px-3 py-2 text-red-700/80 line-through decoration-red-300">{showValue(c.from)}</td>
                        <td className="px-3 py-2 text-emerald-800">{showValue(c.to)}</td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <dl className="grid gap-2 text-sm text-ink/60 sm:grid-cols-2">
            {log.entityId && (
              <div className="flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                <dt>Record:</dt>
                <dd className="truncate font-mono text-ink/70">{log.entityId}</dd>
              </div>
            )}
            {log.ip && (
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <dt>IP:</dt>
                <dd className="font-mono text-ink/70">{log.ip}</dd>
              </div>
            )}
            {log.userAgent && (
              <div className="sm:col-span-2">
                <dt className="inline">Device: </dt>
                <dd className="inline break-all text-ink/70">{log.userAgent}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </li>
  );
};