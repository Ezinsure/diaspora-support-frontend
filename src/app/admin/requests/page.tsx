"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox, Loader2 } from "lucide-react";
import RequestCard from "@/components/admin/requests/requestCard";
import RequestsHeader from "@/components/admin/requests/requestHeader";
import FormModal from "@/components/admin/modal/EditModal";
import RequestForm from "@/components/admin/forms/requestForm";
import QuotationForm from "@/components/admin/forms/quotationForm";
import QuotationView from "@/components/admin/requests/quotationView";
import ReceiptView from "@/components/admin/requests/receiptView";
import PaymentDialog from "@/components/admin/dialog/paymentDialog";
import Pagination from "@/components/shared/Pagination";
import RequestCardSkeleton from "@/components/admin/skeleton/requestSkeleton";
import { useServices } from "@/hooks/useService";
import { useDebouncedValue } from "@/hooks/useCustomer";
import {
  useCreateRequest,
  useRequest,
  useRequests,
  useRequestStats,
  useUpdateRequest,
  type UiRequest,
} from "@/hooks/useAdminRequest";

const RequestsPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quotingId, setQuotingId] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);


  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("search");
    if (q) setSearch(q);
  }, []);


  const { data: servicesData } = useServices({ limit: 100 });
  const serviceId = useMemo(() => {
    if (service === "all") return "all";
    const found = (servicesData?.services ?? []).find((s: any) => s.id === service || s.name === service);
    return found?.id ?? "all";
  }, [service, servicesData]);

  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isFetching, isError } = useRequests({ search: debouncedSearch, status, serviceId, page, limit });
  const { data: stats } = useRequestStats();

  const requests = data?.requests ?? [];


  const byId = (id: string | null) => requests.find((r) => r.id === id) ?? null;
  const quoting = byId(quotingId);
  const viewingQuote = byId(quoteId);
  const paying = byId(payingId);
  const viewingReceipt = byId(receiptId);

  // Edit loads the full request (documents, payments, proforma)
  const { data: editing, isLoading: loadingEditing } = useRequest(editingId);

  const createRequest = useCreateRequest();
  const updateRequest = useUpdateRequest();

  // Any filter change goes back to page 1
  const withReset =
    <T,>(setter: (v: T) => void) =>
      (v: T) => {
        setter(v);
        setPage(1);
      };

  // Create / edit
  const openCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };
  const openEdit = (r: UiRequest) => {
    setEditingId(r.id);
    setFormOpen(true);
  };
  const closeForm = () => {
    if (createRequest.isPending || updateRequest.isPending) return;
    setFormOpen(false);
    setEditingId(null);
  };

  const saveRequest = (values: any) => {
    const done = { onSuccess: () => (setFormOpen(false), setEditingId(null)) };
    if (editing) updateRequest.mutate({ request: editing, values }, done);
    else createRequest.mutate(values, done);
  };

  // Payment 
  const confirmPayment = (_p: any) => {
    setPayingId(null);
  };

  const filtering = !!search || status !== "all" || service !== "all";

  return (
    <div className="min-h-[83vh] space-y-6">
      <RequestsHeader
        counts={stats?.counts ?? {}}
        total={stats?.total ?? 0}
        status={status}
        onStatusChange={withReset(setStatus)}
        service={service}
        onServiceChange={withReset(setService)}
        search={search}
        onSearchChange={withReset(setSearch)}
        onCreate={openCreate}
      />

      {isError ? (
        <Empty title="Couldn't load requests" text="Check your connection and refresh the page." />
      ) : isLoading ? (
        <div className="grid gap-5 lg:grid-cols-2 3xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <RequestCardSkeleton key={i} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <Empty
          title={filtering ? "No requests found" : "No requests yet"}
          text={filtering ? "Try another search or filter." : "Requests from the website and the ones you create appear here."}
        />
      ) : (
        <>
          <div className={`grid gap-4 transition-opacity lg:grid-cols-2 3xl:grid-cols-3 ${isFetching ? "opacity-70" : ""}`}>
            {requests.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                onEdit={openEdit}
                onMakeQuotation={(x: any) => setQuotingId(x.id)}
                onViewQuotation={(x: any) => setQuoteId(x.id)}
                onPay={(x: any) => setPayingId(x.id)}
                onViewReceipt={(x: any) => setReceiptId(x.id)}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            total={data?.total ?? 0}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            pageSizes={[10, 20, 50, 100]}
            isFetching={isFetching}
            itemName="requests"
          />
        </>
      )}

      <FormModal open={formOpen} onOpenChange={(o: boolean) => !o && closeForm()} size="lg" closeOnOutsideClick={false}>
        {formOpen &&
          (editingId && (loadingEditing || !editing) ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading request…
            </div>
          ) : (
            <RequestForm
              key={editing?.id ?? "new"}
              request={editing ?? undefined}
              onSubmit={saveRequest}
              onCancel={closeForm}
              isLoading={createRequest.isPending || updateRequest.isPending}
            />
          ))}
      </FormModal>


      <FormModal open={!!quoting} onOpenChange={(o: boolean) => !o && setQuotingId(null)} size="xl" closeOnOutsideClick={false}>
        {quoting && <QuotationForm key={quoting.id} request={quoting} onDone={() => setQuotingId(null)} onCancel={() => setQuotingId(null)} />}
      </FormModal>

      {/* View quotation */}
      <FormModal open={!!viewingQuote} onOpenChange={(o: boolean) => !o && setQuoteId(null)} size="xl">
        {viewingQuote && (
          <QuotationView
            request={viewingQuote}
            onEdit={() => {
              setQuoteId(null);
              setQuotingId(viewingQuote.id);
            }}
            onPay={() => {
              setQuoteId(null);
              setPayingId(viewingQuote.id);
            }}
          />
        )}
      </FormModal>

      {/* Payment  */}
      <FormModal open={!!paying} onOpenChange={(o: boolean) => !o && setPayingId(null)} size="md">
        {paying && <PaymentDialog key={paying.id} request={paying} onConfirm={confirmPayment} onCancel={() => setPayingId(null)} />}
      </FormModal>

      {/* Receipt*/}
      <FormModal open={!!viewingReceipt} onOpenChange={(o: boolean) => !o && setReceiptId(null)} size="lg">
        {viewingReceipt && <ReceiptView request={viewingReceipt} />}
      </FormModal>
    </div>
  );
};

const Empty = ({ title, text }: { title: string; text: string }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
    <Inbox className="h-10 w-10 text-gray-300" />
    <p className="mt-3 font-medium text-gray-700">{title}</p>
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);
export default RequestsPage;
