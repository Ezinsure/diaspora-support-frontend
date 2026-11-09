"use client";

import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PublicRequestService, type PublicService, type SubmitRequestBody, type SubmitRequestResult } from "@/services/publicRequest";

export const browserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
};

export const publicError = (err: any): { message: string; reference?: string } => {
  if (axios.isAxiosError(err)) {
    if (!err.response) return { message: "We can't reach our server right now. Check your connection, or message us on WhatsApp." };
    const data: any = err.response.data;
    const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
    if (err.response.status === 429) return { message: "Too many attempts. Please wait a minute and try again." };
    return { message: msg || "Something went wrong. Please try again.", reference: data?.reference };
  }
  return { message: "Something went wrong. Please try again." };
};



export const usePublicServices = () =>
  useQuery({
    queryKey: ["public", "request-services"],
    queryFn: () => PublicRequestService.getServices().then((r) => r.data),
    select: (res: any) =>
      ((res?.data ?? []) as any[])
        .filter((s) => s.isActive !== false)
        .map((s) => ({ id: s.id, name: s.name, description: s.description ?? null })) as PublicService[],
    staleTime: 10 * 60_000,
  });


export const useSubmitRequest = () =>
  useMutation<SubmitRequestResult, any, SubmitRequestBody>({
    mutationFn: (body) => PublicRequestService.submit(body).then((r) => r.data),
  });