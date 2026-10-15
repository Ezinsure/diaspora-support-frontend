"use client";

import { useMemo, useState } from "react";
import { Activity, Eye, Search, UserPlus, Users, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_CUSTOMERS } from "@/lib/admin/mockCustomer";
import { MOCK_REQUESTS } from "@/lib/admin/mockRequsts";
import { customerSummary, initialsOf } from "@/components/admin/customer/customerStats";
import { formatMoney, REQUEST_STATUSES, statusInfo } from "@/components/admin/requests/requestStatus";
import FormModal from "@/components/admin/modal/EditModal";
import CustomerRequestsModal from "@/components/admin/modal/customerReqModal";
import RequestForm from "@/components/admin/forms/requestForm";
import { cn } from "../../../../lib/utils";
const ACTIVITY_FILTERS = [
    { value: "all", label: "All customers" },
    { value: "open", label: "With open requests" },
    { value: "to_pay", label: "Waiting for payment" },
    { value: "none", label: "No requests yet" },
];

const SORTS = [
    { value: "recent", label: "Last request (newest)" },
    { value: "most", label: "Most requests" },
    { value: "name", label: "Name (A–Z)" },
];

const shortDate = (iso: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short", year: "numeric" })
        : "—";

// Design only — local state stands in for the API
const CustomersPage = () => {
    const [customers] = useState<any[]>(MOCK_CUSTOMERS);
    const [requests, setRequests] = useState<any[]>(MOCK_REQUESTS);
    const [search, setSearch] = useState("");
    const [activity, setActivity] = useState("all");
    const [sort, setSort] = useState("recent");
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [newFor, setNewFor] = useState<any>(null);

    // One row per customer with their request numbers
    const rows = useMemo(() => customers.map((c) => customerSummary(c, requests)), [customers, requests]);

    const stats = useMemo(() => {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        return {
            total: rows.length,
            active: rows.filter((r) => r.open > 0).length,
            newThisMonth: rows.filter((r) => new Date(r.createdAt) >= monthStart).length,
            paid: rows.reduce((s, r) => s + r.paid, 0),
        };
    }, [rows]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        const list = rows.filter((r) => {
            if (activity === "open" && !r.open) return false;
            if (activity === "to_pay" && !r.unpaid) return false;
            if (activity === "none" && r.total) return false;
            if (!q) return true;
            return [r.name, r.email, r.whatsapp, ...r.requests.map((x: any) => x.reference)]
                .some((v) => String(v ?? "").toLowerCase().includes(q));
        });

        return [...list].sort((a, b) => {
            if (sort === "most") return b.total - a.total;
            if (sort === "name") return a.name.localeCompare(b.name);
            return +new Date(b.lastRequestAt ?? b.createdAt) - +new Date(a.lastRequestAt ?? a.createdAt);
        });
    }, [rows, search, activity, sort]);

    const viewing = rows.find((r) => r.id === viewingId) ?? null;
    const hasFilters = !!search || activity !== "all";

    // New request for an existing customer (form pre-filled with their details)
    const createRequest = (values: any) => {
        const n = requests.length + 1;
        setRequests((list) => [
            {
                id: String(Date.now()),
                customerId: newFor.id,
                reference: `REQ-${new Date().getFullYear()}-${String(n).padStart(4, "0")}`,
                status: "pending",
                documents: [],
                quotation: null,
                createdAt: new Date().toISOString(),
                ...values,
            },
            ...list,
        ]);
        setNewFor(null);
    };

    const statCards = [
        { label: "Customers", value: stats.total, hint: "Everyone who made a request", icon: Users, box: "bg-primary/10 text-primary" },
        { label: "Active", value: stats.active, hint: "With at least one open request", icon: Activity, box: "bg-blue-100 text-blue-700" },
        { label: "New this month", value: stats.newThisMonth, hint: "First request this month", icon: UserPlus, box: "bg-violet-100 text-violet-700" },
        { label: "Total paid", value: formatMoney(stats.paid), hint: "Paid quotations", icon: Wallet, box: "bg-emerald-100 text-emerald-700" },
    ];

    return (
        <div className="min-h-[83vh] space-y-6">
            {/* Title */}
            <div>
                <h1 className="text-2xl font-medium">Customers</h1>
                <p className="text-muted-foreground">People who sent requests, and how their requests are going.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {statCards.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4" title={s.hint}>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-gray-600">{s.label}</span>
                            <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", s.box)}>
                                <s.icon className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="mt-2 truncate text-2xl font-semibold tabular-nums text-gray-900">
                            {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">{s.hint}</p>
                    </div>
                ))}
            </div>

            {/* Search + filters */}
            <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, WhatsApp or request reference…"
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
                <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    aria-label="Filter customers"
                    className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 md:w-56"
                >
                    {ACTIVITY_FILTERS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort customers"
                    className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 md:w-52"
                >
                    {SORTS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                {hasFilters && (
                    <Button variant="ghost" className="gap-1 text-gray-600" onClick={() => { setSearch(""); setActivity("all"); }}>
                        <X className="h-4 w-4" /> Clear
                    </Button>
                )}
            </div>

            {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                    <Users className="h-10 w-10 text-gray-300" />
                    <p className="mt-3 font-medium text-gray-700">No customers found</p>
                    <p className="text-sm text-gray-500">Try another search or filter.</p>
                </div>
            ) : (
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Customer</th>
                                    <th className="px-4 py-3 font-medium">WhatsApp</th>
                                    <th className="px-4 py-3 font-medium">Requests</th>
                                    <th className="px-4 py-3 text-right font-medium">Paid</th>
                                    <th className="px-4 py-3 font-medium">Last request</th>
                                    <th className="px-6 py-3 text-right font-medium"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {visible.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <Person customer={c} />
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-gray-900">
                                                {c.whatsapp}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <RequestMix customer={c} />
                                        </td>
                                        <td className="px-4 py-3 text-right tabular-nums">
                                            <span className="font-medium text-gray-900">{formatMoney(c.paid)}</span>
                                            {c.unpaid > 0 && <p className="text-xs text-amber-700">{formatMoney(c.unpaid)} to pay</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-gray-900">{shortDate(c.lastRequestAt)}</p>
                                            {c.lastService && <p className="truncate text-xs text-gray-500">{c.lastService}</p>}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setViewingId(c.id)}>
                                                <Eye className="h-4 w-4" /> View requests
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <ul className="divide-y divide-gray-100 md:hidden">
                        {visible.map((c) => (
                            <li key={c.id} className="space-y-3 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <Person customer={c} />
                                    <span className="text-xs text-gray-500">{shortDate(c.lastRequestAt)}</span>
                                </div>
                                <RequestMix customer={c} />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Paid</span>
                                    <span className="font-medium tabular-nums text-gray-900">
                                        {formatMoney(c.paid)}
                                        {c.unpaid > 0 && <span className="ml-2 text-xs text-amber-700">+{formatMoney(c.unpaid)} to pay</span>}
                                    </span>
                                </div>
                                <Button variant="outline" className="w-full gap-1.5" onClick={() => setViewingId(c.id)}>
                                    <Eye className="h-4 w-4" /> View requests ({c.total})
                                </Button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Customer's requests */}
            <FormModal open={!!viewing} onOpenChange={(o: boolean) => !o && setViewingId(null)} size="xl">
                {viewing && (
                    <CustomerRequestsModal
                        key={viewing.id}
                        customer={viewing}
                        onNewRequest={(c) => { setViewingId(null); setNewFor(c); }}
                    />
                )}
            </FormModal>

            {/* New request for this customer — details pre-filled */}
            <FormModal open={!!newFor} onOpenChange={(o: boolean) => !o && setNewFor(null)}>
                {newFor && (
                    <RequestForm
                        key={newFor.id}
                        prefill={{ firstName: newFor.firstName, lastName: newFor.lastName, email: newFor.email, whatsapp: newFor.whatsapp }}
                        onSubmit={createRequest}
                        onCancel={() => setNewFor(null)}
                    />
                )}
            </FormModal>
        </div>
    );
};

const Person = ({ customer }: { customer: any }) => (
    <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initialsOf(customer)}
        </span>
        <span className="min-w-0">
            <span className="block truncate font-medium text-gray-900">{customer.name}</span>
            <span className="block truncate text-xs text-gray-500">{customer.email}</span>
        </span>
    </span>
);

// "4 requests · 2 open" + a small coloured bar of their statuses
const RequestMix = ({ customer }: { customer: any }) => {
    if (!customer.total) return <span className="text-xs text-gray-400">No requests yet</span>;
    return (
        <div className="min-w-36 space-y-1.5">
            <p className="text-sm">
                <span className="font-semibold tabular-nums text-gray-900">{customer.total}</span>{" "}
                <span className="text-gray-500">{customer.total === 1 ? "request" : "requests"}</span>
                {customer.open > 0 && <span className="ml-1.5 text-xs font-medium text-blue-700">{customer.open} open</span>}
            </p>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                {REQUEST_STATUSES.filter((s: any) => customer.byStatus[s.key]).map((s: any) => (
                    <span
                        key={s.key}
                        className={cn("h-full", statusInfo(s.key).dot)}
                        style={{ width: `${(customer.byStatus[s.key] / customer.total) * 100}%` }}
                        title={`${s.label}: ${customer.byStatus[s.key]}`}
                    />
                ))}
            </div>
        </div>
    );
};
export default CustomersPage;