"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { MOCK_REQUESTS } from "@/lib/admin/mockRequsts";
import { REQUEST_STATUSES } from "@/components/admin/requests/requestStatus";
import RequestCard from "@/components/admin/requests/requestCard";
import RequestsHeader from "@/components/admin/requests/requestHeader";
import FormModal from "@/components/admin/modal/EditModal";
import RequestForm from "@/components/admin/forms/requestForm";
import QuotationForm from "@/components/admin/forms/quotationForm";
import QuotationView from "@/components/admin/requests/quotationView";
import PaymentDialog from "@/components/admin/dialog/paymentDialog";

// Design only — local state stands in for the API
const RequestsPage = () => {
    const [requests, setRequests] = useState<any[]>(MOCK_REQUESTS);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [service, setService] = useState("all");

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [payingId, setPayingId] = useState<string | null>(null);
    const [quotingId, setQuotingId] = useState<string | null>(null); // make / edit quotation
    const [viewingQuoteId, setViewingQuoteId] = useState<string | null>(null);

    // Always read the latest version of a request from the list
    const byId = (id: string | null) => requests.find((r) => r.id === id) ?? null;
    const paying = byId(payingId);
    const quoting = byId(quotingId);
    const viewingQuote = byId(viewingQuoteId);

    // Opened from Customers ("Open" on a request) -> /requests?search=REQ-2026-0001
    useEffect(() => {
        const q = new URLSearchParams(window.location.search).get("search");
        if (q) setSearch(q);
    }, []);

    // Stats ignore the status filter so every card keeps its number
    const counts = useMemo(() => {
        const c: Record<string, number> = Object.fromEntries(REQUEST_STATUSES.map((s: any) => [s.key, 0]));
        for (const r of requests) c[r.status] = (c[r.status] ?? 0) + 1;
        return c;
    }, [requests]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return requests.filter((r) => {
            if (status !== "all" && r.status !== status) return false;
            if (service !== "all" && r.service !== service) return false;
            if (!q) return true;
            return [r.reference, r.quotation?.number, r.firstName, r.lastName, `${r.firstName} ${r.lastName}`, r.email, r.whatsapp, r.service]
                .some((v) => String(v ?? "").toLowerCase().includes(q));
        });
    }, [requests, search, status, service]);

    const update = (id: string, patch: any) =>
        setRequests((list) => list.map((r) => (r.id === id ? { ...r, ...patch } : r)));

    // ---------- Create / edit request ----------
    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };
    const openEdit = (r: any) => {
        setEditing(r);
        setFormOpen(true);
    };
    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
    };

    const saveRequest = (values: any) => {
        if (editing) {
            update(editing.id, values);
        } else {
            const n = requests.length + 1;
            setRequests((list) => [
                {
                    id: String(Date.now()),
                    reference: `REQ-${new Date().getFullYear()}-${String(n).padStart(4, "0")}`,
                    status: "pending",
                    documents: [],
                    quotation: null,
                    payment: null,
                    createdAt: new Date().toISOString(),
                    ...values,
                },
                ...list,
            ]);
        }
        closeForm();
    };

    // ---------- Documents ----------
    const addDocuments = (req: any, files: File[]) => {
        const docs = files.map((f) => ({ name: f.name, size: f.size }));
        update(req.id, { documents: [...(req.documents ?? []), ...docs] });
    };

    // ---------- Quotation ----------
    const saveQuotation = (quotation: any) => {
        update(quotingId as string, { quotation });
        setQuotingId(null);
        setViewingQuoteId(quotingId); // show the result right away
    };

    // ---------- Payment ----------
    const confirmPayment = (p: any) => {
        update(payingId as string, { payment: { ...p, paid: true, paidAt: new Date().toISOString() } });
        setPayingId(null);
    };

    return (
        <div className="min-h-[83vh] space-y-6">
            <RequestsHeader
                counts={counts}
                total={requests.length}
                status={status}
                onStatusChange={setStatus}
                service={service}
                onServiceChange={setService}
                search={search}
                onSearchChange={setSearch}
                onCreate={openCreate}
            />

            {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                    <Inbox className="h-10 w-10 text-gray-300" />
                    <p className="mt-3 font-medium text-gray-700">No requests found</p>
                    <p className="text-sm text-gray-500">Try another search or filter, or create a new request.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visible.map((r) => (
                        <RequestCard
                            key={r.id}
                            request={r}
                            onEdit={openEdit}
                            onUpload={addDocuments}
                            onPay={(x) => setPayingId(x.id)}
                            onMakeQuotation={(x) => setQuotingId(x.id)}
                            onViewQuotation={(x) => setViewingQuoteId(x.id)}
                        />
                    ))}
                </div>
            )}

            {/* Create / edit request */}
            <FormModal open={formOpen} onOpenChange={(o: boolean) => !o && closeForm()}>
                {formOpen && (
                    <RequestForm key={editing?.id ?? "new"} request={editing ?? undefined} onSubmit={saveRequest} onCancel={closeForm} />
                )}
            </FormModal>

            {/* Make / edit quotation */}
            <FormModal open={!!quoting} onOpenChange={(o: boolean) => !o && setQuotingId(null)} size="xl" closeOnOutsideClick={false}>
                {quoting && <QuotationForm key={quoting.id} request={quoting} onSubmit={saveQuotation} onCancel={() => setQuotingId(null)} />}
            </FormModal>

            {/* View quotation */}
            <FormModal open={!!viewingQuote} onOpenChange={(o: boolean) => !o && setViewingQuoteId(null)} size="xl">
                {viewingQuote && (
                    <QuotationView
                        request={viewingQuote}
                        onEdit={() => { setViewingQuoteId(null); setQuotingId(viewingQuote.id); }}
                        onPay={() => { setViewingQuoteId(null); setPayingId(viewingQuote.id); }}
                    />
                )}
            </FormModal>

            {/* Payment */}
            <FormModal open={!!paying} onOpenChange={(o: boolean) => !o && setPayingId(null)} size="md">
                {paying && <PaymentDialog key={paying.id} request={paying} onConfirm={confirmPayment} onCancel={() => setPayingId(null)} />}
            </FormModal>
        </div>
    );
};

export default RequestsPage;