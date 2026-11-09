 
"use client";
 
import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/admin/httpRequest";
import { REQUESTS_KEY } from "@/hooks/useAdminRequest";
import { RequestService } from "@/services/adminRequest";
 
export type PaymentLinkItem = {
  id: string;
  reference: string; 
  channel: "card" | "momo";
  status: "open" | "paid" | "cancelled" | "expired";
  amount: number; 
  currency: string;
  chargeAmount: number; 
  chargeCurrency: string;
  rate: number | null;
  url: string;
  payerPhone: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  paymentMethod: string | null;
  createdAt: string;
  createdBy?: { names: string } | null;
};
 
export type PaymentLinks = { configured: boolean; momo: boolean; rwfRate: number | null; links: PaymentLinkItem[] };
 
const linksKey = (requestId?: string | null) => [...REQUESTS_KEY, "payment-links", requestId];
 
export const usePaymentLinks = (requestId?: string | null) => {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: linksKey(requestId),
    queryFn: () => RequestService.paymentLinks(requestId as string).then((r) => r.data as PaymentLinks),
    enabled: !!requestId,
    refetchInterval: (q) => ((q.state.data as PaymentLinks | undefined)?.links ?? []).some((l) => l.status === "open") ? 8_000 : false,
  });
 
  const openIds = useRef<string[]>([]);
  useEffect(() => {
    const links = query.data?.links ?? [];
    const justPaid = links.find((l) => l.status === "paid" && openIds.current.includes(l.id));
    if (justPaid) {
      toast.success(`Payment received: ${justPaid.currency} ${Number(justPaid.amount).toLocaleString("en-US")}`);
      qc.invalidateQueries({ queryKey: REQUESTS_KEY });
    }
    openIds.current = links.filter((l) => l.status === "open").map((l) => l.id);
  }, [query.data, qc]);
 
  return query;
};
 
const useRefreshLinks = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: REQUESTS_KEY });
};
 
export const useCreatePaymentLink = () => {
  const refresh = useRefreshLinks();
  return useMutation({
    mutationFn: ({ requestId, channel }: { requestId: string; channel: "card" | "momo" }) =>
      RequestService.createPaymentLink(requestId, channel).then((r) => r.data as PaymentLinkItem),
    onSuccess: () => {
      refresh();
      toast.success("Payment link ready: share it with the customer");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};
 
export const usePushMomo = () => {
  const refresh = useRefreshLinks();
  return useMutation({
    mutationFn: ({ requestId, phone }: { requestId: string; phone: string }) =>
      RequestService.pushMomo(requestId, phone).then((r) => r.data as PaymentLinkItem & { provider: string }),
    onSuccess: (l) => {
      refresh();
      toast.success(`MoMo prompt sent to ${l.payerPhone}. The customer approves it on their phone.`);
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};
 
export const useCheckPaymentLink = () => {
  const refresh = useRefreshLinks();
  return useMutation({
    mutationFn: ({ requestId, linkId }: { requestId: string; linkId: string }) =>
      RequestService.checkPaymentLink(requestId, linkId).then((r) => r.data as PaymentLinkItem),
    onSuccess: (l) => {
      refresh();
      if (l.status === "paid") toast.success("Paid: the payment is recorded");
      else toast.info(l.status === "expired" ? "This link has expired" : "Not paid yet");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};
 
export const useCancelPaymentLink = () => {
  const refresh = useRefreshLinks();
  return useMutation({
    mutationFn: ({ requestId, linkId }: { requestId: string; linkId: string }) => RequestService.cancelPaymentLink(requestId, linkId).then((r) => r.data),
    onSuccess: () => {
      refresh();
      toast.success("Payment link cancelled");
    },
    // 409 = the customer had already paid: it was recorded
    onError: (err: any) => {
      refresh();
      toast.error(getErrorMessage(err));
    },
  });
};