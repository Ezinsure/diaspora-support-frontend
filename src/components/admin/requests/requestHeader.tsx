"use client";

import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { REQUEST_STATUSES, SERVICES, TOTAL_CARD } from "./requestStatus";

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
    const cards = [{ ...TOTAL_CARD, n: total }, ...REQUEST_STATUSES.map((s: any) => ({ ...s, n: counts[s.key] ?? 0 }))];
    const hasFilters = !!search || status !== "all" || service !== "all";

    return (
        <div className="space-y-5">
            {/* Title */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-medium">Requests</h1>
                    <p className="text-muted-foreground">Track customer requests from submission to completion.</p>
                </div>
                <Button onClick={onCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> New request
                </Button>
            </div>

            {/* Stat cards — click one to filter by it */}
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
                            onClick={() => onStatusChange(active && c.key !== "all" ? "all" : c.key)}
                            className={cn(
                                "rounded-2xl border p-4 px-6 text-left transition-shadow hover:shadow-sm",
                                c.card,
                                active && "ring-1 ring-navy-300",
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className={cn("truncate text-sm font-medium uppercase", c.text)}>{c.label}</span>
                                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", c.iconBox)}>
                                    <Icon className="h-4 w-4" />
                                </span>
                            </div>
                            <p className={cn("mt-2 text-2xl font-semibold tabular-nums", c.text)}>
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
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    aria-label="Filter by status"
                    className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 md:w-48"
                >
                    <option value="all">All statuses</option>
                    {REQUEST_STATUSES.map((s: any) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                </select>

                <select
                    value={service}
                    onChange={(e) => onServiceChange(e.target.value)}
                    aria-label="Filter by service"
                    className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 md:w-56"
                >
                    <option value="all">All services</option>
                    {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

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