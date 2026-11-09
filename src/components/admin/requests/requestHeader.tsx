"use client";

import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { REQUEST_STATUSES, TOTAL_CARD } from "./requestStatus";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useServices } from "@/hooks/useService";

const RequestsHeader = ({
    counts,
    total,
    isLoading,
    status,
    onStatusChange,
    service,
    onServiceChange,
    search,
    onSearchChange,
    onCreate,
}: {
    counts: Record<string, number>;
    total: number;
    isLoading?: boolean;
    status: string;
    onStatusChange: (v: string) => void;
    service: string;
    onServiceChange: (v: string) => void;
    search: string;
    onSearchChange: (v: string) => void;
    onCreate: () => void;
}) => {
    const cards = [
        { ...TOTAL_CARD, n: total },
        ...REQUEST_STATUSES.map((s: any) => ({ ...s, n: counts[s.key] ?? 0 })),
    ];
    const hasFilters = !!search || status !== "all" || service !== "all";

    const STATUS_OPTIONS = [
        { value: "all", label: "All statuses", dot: "bg-gray-300" },
        ...REQUEST_STATUSES.map((s: any) => ({
            value: s.key,
            label: s.label,
            dot: s.dot,
        })),
    ];

    const { data: servicesData, isLoading: loadingServices } = useServices({ limit: 100 });
    const SERVICE_OPTIONS = [
        { value: "all", label: "All services", hidden: false },
        ...(servicesData?.services ?? []).map((s: any) => ({
            value: s.id as string,
            label: s.name as string,
            hidden: s.isActive === false,
        })),
    ];

    const itemClass =
        "cursor-pointer rounded-lg px-2.5 py-2 text-sm " +
        "focus:bg-primary/10 focus:text-primary data-highlighted:bg-primary/10 data-highlighted:text-primary " +
        "data-[state=checked]:font-medium data-[state=checked]:text-primary data-selected:font-medium data-selected:text-primary";

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-medium">Requests</h1>
                    <p className="text-muted-foreground">
                        Track customer requests from submission to completion.
                    </p>
                </div>
                <Button onClick={onCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> New request
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                {cards.map((c: any) => {
                    const Icon = c.icon;
                    const active = status === c.key;
                    return (
                        <button
                            key={c.key}
                            type="button"
                            aria-pressed={active}
                            title={c.hint}
                            onClick={() =>
                                onStatusChange(active && c.key !== "all" ? "all" : c.key)
                            }
                            className={cn(
                                "rounded-2xl border p-4 px-6 text-left transition-shadow hover:shadow-sm",
                                c.card,
                                active && "ring-1 ring-navy-300",
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className={cn(
                                        "truncate text-lg font-medium uppercase",
                                        c.text,
                                    )}
                                >
                                    {c.label}
                                </span>
                                <span
                                    className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                        c.iconBox,
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </span>
                            </div>
                            <p
                                className={cn(
                                    "mt-2 text-2xl font-semibold tabular-nums",
                                    c.text,
                                )}
                            >
                                {isLoading ? "—" : c.n.toLocaleString()}
                            </p>
                            {c.key !== "all" && !isLoading && (
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {total ? Math.round((c.n / total) * 100) : 0}% of requests
                                </p>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search + filters */}
            <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search reference, name, email, WhatsApp…"
                        className="h-10 w-full rounded-lg border border-gray-100 bg-white pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary/30"
                    />
                </div>
                <Select
                    value={status}
                    onValueChange={(v: any) => onStatusChange(v)}
                    items={STATUS_OPTIONS}
                >
                    <SelectTrigger
                        aria-label="Filter by status"
                        className="h-10! w-full rounded-xl border-gray-200 bg-white px-3 text-sm shadow-none focus:ring-1 focus:ring-primary/30 data-[state=open]:border-primary data-popup-open:border-primary md:w-48"
                    >
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 rounded-xl border-gray-200 p-1 shadow-lg">
                        {SERVICE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value} className={itemClass}>
                                <span className="flex w-full items-center gap-2">
                                    <span className="truncate">{o.label}</span>
                                    {o.hidden && (
                                        <span className="ml-auto rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">Hidden</span>
                                    )}
                                </span>
                            </SelectItem>
                        ))}
                        {loadingServices && <p className="px-3 py-2 text-sm text-gray-500">Loading services…</p>}
                    </SelectContent>
                </Select>

                <Select
                    value={service}
                    onValueChange={(v: any) => onServiceChange(v)}
                    items={SERVICE_OPTIONS}
                >
                    <SelectTrigger
                        aria-label="Filter by service"
                        className="h-10! w-full rounded-xl border-gray-200 bg-white px-3 text-sm shadow-none focus:ring-1 focus:ring-primary/30 data-[state=open]:border-primary data-popup-open:border-primary md:w-56"
                    >
                        <SelectValue placeholder={loadingServices ? "Loading services…" : "All services"} />
                    </SelectTrigger>

                    <SelectContent className="max-h-72 rounded-xl border-gray-200 p-1 shadow-lg">
                        {SERVICE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value} className={itemClass}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        className="gap-1 text-gray-600"
                        onClick={() => {
                            onSearchChange("");
                            onStatusChange("all");
                            onServiceChange("all");
                        }}
                    >
                        <X className="h-4 w-4" /> Clear
                    </Button>
                )}
            </div>
        </div>
    );
};
export default RequestsHeader;
