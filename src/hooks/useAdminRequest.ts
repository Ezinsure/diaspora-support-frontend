"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RequestService } from "@/services/adminRequest";
import { CustomerService } from "@/services/customerServices";
import { getErrorMessage } from "@/lib/admin/httpRequest";

export const REQUESTS_KEY = ["requests"];
export const CUSTOMERS_KEY = ["customers"];

export type RequestFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string; // -> phone
  location: string; // -> country
  serviceId: string;
  note: string; // -> description
  notifyCustomer?: boolean;
  requiredDocuments?: string[]
};

export const toApiRequest = (v: RequestFormValues) => ({
  firstName: v.firstName.trim().replace(/\s+/g, " "),
  lastName: v.lastName.trim().replace(/\s+/g, " "),
  email: v.email.trim().toLowerCase(),
  phone: v.whatsapp.replace(/[\s()-]/g, ""),
  serviceId: v.serviceId,
  country: v.location.trim() || null,
  timezone: null,
  description: v.note.trim(),
  notifyCustomer: v.notifyCustomer !== false,
});

export const toUiRequest = (r: any) => {
  const c = r.customer ?? {};
  const payments = r.payments ?? []; 
  const lastPayment = payments[0] ?? null;
  const amountPaid = Number(r.amountPaid ?? 0);

  return {
    ...r, // id, reference, status, statusNote, source, amountDue, amountPaid, currency, paymentStatus, balance, serviceId, customerId, createdAt…
    amountPaid,
    amountDue: r.amountDue === null || r.amountDue === undefined ? null : Number(r.amountDue),

    // customer
    customer: c,
    firstName: c.firstName ?? "",
    lastName: c.lastName ?? "",
    email: c.email ?? "",
    whatsapp: c.phone ?? "",
    location: c.country ?? "",

    // request
    service: r.serviceName ?? "",
    note: r.description ?? "",
    requiredDocuments: r.requiredDocuments ?? [],

    // uploaded files
    documents: (r.documents ?? []).map((d: any) => ({
      id: d.id,
      name: d.label ? `${d.label} — ${d.fileName}` : d.fileName,
      fileName: d.fileName,
      label: d.label ?? null,
      size: Number(d.size ?? 0),
      mimeType: d.mimeType,
      createdAt: d.createdAt,
      uploadedBy: d.createdBy?.names ?? null,
    })),

    // money (proforma + payments are wired in the next step)
    quotationRequested: !!r.proforma,
    quotation: r.proforma
      ? {
          number: r.proforma.number,
          currency: r.proforma.currency,
          items: r.proforma.items ?? [],
          total: Number(r.proforma.total ?? 0),
          validUntil: r.proforma.validUntil,
          note: r.proforma.note ?? "",
          createdAt: r.proforma.createdAt,
          sentAt: r.proforma.sentAt ?? null,
        }
      : null,
    agreedAmount: r.proforma ? null : r.amountDue ?? null,
    payment:
      amountPaid > 0
        ? {
            amount: amountPaid,
            currency: r.currency,
            paid: r.paymentStatus === "paid",
            paidAt: lastPayment?.paidAt ?? null,
            method: lastPayment?.method ?? null,
            receiptNumber: lastPayment?.receiptNumber ?? null,
          }
        : null,
  };
};

export type UiRequest = ReturnType<typeof toUiRequest>;

export const useRequests = (filters: any = {}) => {
  const params: any = { page: filters.page ?? 1, limit: filters.limit ?? 20, sortBy: "createdAt", order: "DESC" };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.status && filters.status !== "all") params.status = filters.status;
  if (filters.serviceId && filters.serviceId !== "all") params.serviceId = filters.serviceId;
  if (filters.payment && filters.payment !== "all") params.payment = filters.payment;

  return useQuery({
    queryKey: [...REQUESTS_KEY, "list", params],
    queryFn: () => RequestService.getAll(params).then((r) => r.data),
    select: (res: any) => ({
      requests: (res?.data ?? []).map(toUiRequest) as UiRequest[],
      total: Number(res?.total ?? 0),
      totalPages: Number(res?.totalPages ?? 1),
    }),
    placeholderData: keepPreviousData,
  });
};

export const useRequestStats = () =>
  useQuery({
    queryKey: [...REQUESTS_KEY, "stats"],
    queryFn: () => RequestService.getStats().then((r) => r.data),
    select: (s: any) => ({
      total: Number(s?.total ?? 0),
      counts: (s?.status ?? {}) as Record<string, number>,
      amountPaid: Number(s?.amountPaid ?? 0),
    }),
  });

// Full details (documents, payments, proforma)
export const useRequest = (id?: string | null) =>
  useQuery({
    queryKey: [...REQUESTS_KEY, "one", id],
    queryFn: () => RequestService.getOne(id as string).then((r) => toUiRequest(r.data)),
    enabled: !!id,
  });

// ---------- Mutations ----------

const useRefresh = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: REQUESTS_KEY });
    qc.invalidateQueries({ queryKey: CUSTOMERS_KEY });
  };
};

export const useCreateRequest = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (values: RequestFormValues) => RequestService.create(toApiRequest(values)).then((r) => r.data),
    onSuccess: (request: any, values) => {
      refresh();
      toast.success(
        `Request ${request.reference} created` + (values.notifyCustomer !== false ? `. A confirmation was emailed to ${request.customer?.email ?? values.email}.` : "."),
      );
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateRequest = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({ request, values }: { request: UiRequest; values: RequestFormValues }) => {
      const firstName = values.firstName.trim().replace(/\s+/g, " ");
      const lastName = values.lastName.trim().replace(/\s+/g, " ");
      const email = values.email.trim().toLowerCase();
      const c = request.customer ?? {};

      const customerPatch: any = {};
      if (firstName !== c.firstName) customerPatch.firstName = firstName;
      if (lastName !== c.lastName) customerPatch.lastName = lastName;
      if (email !== String(c.email ?? "").toLowerCase()) customerPatch.email = email;
      if (Object.keys(customerPatch).length) await CustomerService.update(request.customerId, customerPatch);

      const body: any = {
        description: values.note.trim(),
        phone: values.whatsapp.replace(/[\s()-]/g, ""),
        country: values.location.trim() || null,
      };
      if (values.serviceId && values.serviceId !== request.serviceId) body.serviceId = values.serviceId;
      if (values.requiredDocuments) body.requiredDocuments = values.requiredDocuments;

      return RequestService.update(request.id, body).then((r) => toUiRequest(r.data));
    },
    onSuccess: (r) => {
      refresh();
      toast.success(`Request ${r.reference} updated`);
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

//Quotation 

export const useSupportFee = (enabled = true) =>
  useQuery({
    queryKey: [...REQUESTS_KEY, "support-fee"],
    queryFn: () => RequestService.getSupportFee().then((r) => r.data as { id: string; name: string; amount: number; currency: string; description: string | null }),
    enabled,
    staleTime: 60_000,
    retry: false, // a missing SUPPORT_FEE_ID won't fix itself
  });


export const useSaveQuotation = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => RequestService.saveQuotation(id, data).then((r) => toUiRequest(r.data)),
    onSuccess: (r, { data }) =>
      toast.success(
        data.send
          ? `Quotation ${r.quotation?.number} saved and emailed to ${r.email}`
          : `Quotation ${r.quotation?.number} saved · ${r.quotation?.currency} ${Number(r.quotation?.total ?? 0).toLocaleString("en-US")}`,
      ),
    onError: (err: any) => toast.error(getErrorMessage(err)),
    onSettled: () => refresh(),
  });
};

export const useSendQuotation = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (id: string) => RequestService.sendQuotation(id).then((r) => toUiRequest(r.data)),
    onSuccess: (r) => {
      refresh();
      toast.success(`Quotation ${r.quotation?.number} emailed to ${r.email}`);
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};
