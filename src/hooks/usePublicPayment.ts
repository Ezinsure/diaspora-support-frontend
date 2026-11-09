
"use client";
 
import { PublicPaymentService } from "@/services/publicPayment";
import { useMutation, useQuery } from "@tanstack/react-query";
 
type Who = { reference: string; email: string };
 
// Find the request. poll=true while waiting for a MoMo approval (every 5 s).
export const usePublicPaymentLookup = (who: Who | null, poll = false) =>
  useQuery({
    queryKey: ["public-payment", who?.reference?.toUpperCase(), who?.email?.toLowerCase()],
    queryFn: () => PublicPaymentService.lookup(who as Who).then((r) => r.data),
    enabled: !!who,
    retry: false,
    refetchInterval: poll ? 5_000 : false,
  });
 
export const usePublicPay = () =>
  useMutation({
    mutationFn: (body: Who & { channel: "card" | "momo"; phone?: string }) => PublicPaymentService.pay(body).then((r) => r.data),
  });