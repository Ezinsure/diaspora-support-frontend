"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, FileText, Mail, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { REQUEST_STATUSES, formatDate, formatMoney, isPaid, quotationTotal, statusInfo } from "@/components/admin/requests/requestStatus"
import { initialsOf } from "../customer/customerStats";

// All requests of one customer
const CustomerRequestsModal = ({ customer, onNewRequest }: { customer: any; onNewRequest?: (c: any) => void }) => {
    const [status, setStatus] = useState("all");
    const list = status === "all" ? customer.requests : customer.requests.filter((r: any) => r.status === status);

    // Only show filter chips for statuses this customer has
    const chips = [
        { key: "all", label: "All", n: customer.total },
        ...REQUEST_STATUSES.filter((s: any) => customer.byStatus[s.key]).map((s: any) => ({ key: s.key, label: s.label, n: customer.byStatus[s.key] })),
    ];

    const waLink = `https://wa.me/${String(customer.whatsapp).replace(/\D/g, "")}`;

    return (
        <div className="p-5 sm:p-6">
            {/* Customer */}
            <div className="flex flex-col gap-4 pr-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                        {initialsOf(customer)}
                    </span>
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-gray-900">{customer.name}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                            <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 hover:text-gray-900">
                                <Mail className="h-3.5 w-3.5 text-gray-400" /> {customer.email}
                            </a>
                            <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gray-900">
                                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" /> {customer.whatsapp}
                            </a>
                        </div>
                    </div>
                </div>
                {onNewRequest && (
                    <Button size="sm" className="gap-1.5 self-start sm:self-auto" onClick={() => onNewRequest(customer)}>
                        <Plus className="h-4 w-4" /> New request
                    </Button>
                )}
            </div>

            {/* Totals */}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                    { label: "Requests", value: customer.total },
                    { label: "Open", value: customer.open },
                    { label: "Paid", value: formatMoney(customer.paid) },
                    { label: "Quoted, not paid", value: formatMoney(customer.unpaid) },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-200 px-3 py-2.5">
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <p className="mt-0.5 truncate font-semibold tabular-nums text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Status chips */}
            {customer.total > 0 && (
                <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
                    {chips.map((c) => (
                        <button
                            key={c.key}
                            type="button"
                            aria-pressed={status === c.key}
                            onClick={() => setStatus(c.key)}
                            className={cn(
                                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                                status === c.key ? "border-primary bg-primary text-primary-foreground" : "border-gray-200 text-gray-600 hover:bg-gray-50",
                            )}
                        >
                            {c.label} <span className="opacity-70">{c.n}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Requests */}
            <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200">
                {list.length === 0 ? (
                    <li className="px-4 py-10 text-center text-sm text-gray-500">
                        {customer.total === 0 ? "This customer has no requests yet." : "No requests with this status."}
                    </li>
                ) : (
                    list.map((r: any) => {
                        const st = statusInfo(r.status);
                        const q = r.quotation;
                        const paid = isPaid(r);
                        const amount = paid ? r.payment.amount : q ? quotationTotal(q.items) : 0;
                        return (
                            <li key={r.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-medium text-gray-500">{r.reference}</span>
                                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", st.badge)}>
                                            <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} /> {st.label}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 truncate font-medium text-gray-900">{r.service}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(r.createdAt)} · <FileText className="inline h-3 w-3" /> {r.documents?.length ?? 0} docs
                                    </p>
                                    {r.quotationRequested && !q && r.status !== "completed" && r.status !== "cancelled" && (
                                        <p className="mt-0.5 text-xs font-medium text-violet-700">Quotation requested</p>
                                    )}
                                    {r.statusNote && r.status === "cancelled" && (
                                        <p className="mt-0.5 truncate text-xs text-red-600">Reason: {r.statusNote}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                    {amount ? (
                                        <span className="text-sm font-medium tabular-nums text-gray-900">
                                            {formatMoney(amount)}{" "}
                                            <span className={cn("ml-1 rounded px-1.5 py-px text-[10px] font-semibold uppercase", paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                                                {paid ? "Paid" : "Quoted"}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Not paid</span>
                                    )}
                                    <Link
                                        href={`/requests?search=${encodeURIComponent(r.reference)}`}
                                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5"
                                    >
                                        Open <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default CustomerRequestsModal;