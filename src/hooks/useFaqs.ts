"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FaqService } from "@/services/faqService";
import { getErrorMessage } from "@/lib/admin/httpRequest";

export const FAQS_KEY = ["faqs"];
const LIST_KEY = [...FAQS_KEY, "list"];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  updatedAt?: string;
}

export type FaqFormValues = {
  question: string;
  answer: string;
  isPublished: boolean;
};

const toFaqItem = (f: any): FaqItem => ({
  id: f.id,
  question: f.question ?? "",
  answer: f.answer ?? "",
  sortOrder: Number(f.sortOrder ?? 0),
  isPublished: f.isPublished !== false,
  updatedAt: f.updatedAt,
});

export const useFaqs = () =>
  useQuery({
    queryKey: LIST_KEY,
    queryFn: () =>
      FaqService.getAll({
        page: 1,
        limit: 100,
        sortBy: "sortOrder",
        order: "ASC",
      }).then((r) => r.data),
    select: (res: any) => (res?.data ?? []).map(toFaqItem) as FaqItem[],
  });

const useRefresh = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: FAQS_KEY });
};

export const useCreateFaq = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (values: FaqFormValues) =>
      FaqService.create(values).then((r) => toFaqItem(r.data)),
    onSuccess: () => {
      refresh();
      toast.success("Question added");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateFaq = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<FaqFormValues>;
    }) => FaqService.update(id, values).then((r) => toFaqItem(r.data)),
    onSuccess: () => {
      refresh();
      toast.success("Question updated");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const usePublishFaq = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      FaqService.update(id, { isPublished }).then((r) => toFaqItem(r.data)),
    onSuccess: (faq) => {
      refresh();
      toast.success(
        faq.isPublished ? "Shown on the website" : "Hidden from the website",
      );
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

// Website: published questions only
export const usePublishedFaqs = () =>
  useQuery({
    queryKey: [...FAQS_KEY, "published"],
    queryFn: () => FaqService.getPublished().then((r) => r.data),
    select: (res: any) =>
      ((Array.isArray(res) ? res : (res?.data ?? [])) as any[])
        .map(toFaqItem)
        .filter((f) => f.isPublished)
        .sort((a, b) => a.sortOrder - b.sortOrder) as FaqItem[],
    staleTime: 5 * 60_000,
  });

// Moves instantly on screen,
export const useReorderFaqs = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => FaqService.reorder(ids).then((r) => r.data),
    onMutate: async (ids: string[]) => {
      await qc.cancelQueries({ queryKey: LIST_KEY });
      const previous = qc.getQueryData<any>(LIST_KEY);
      if (previous?.data) {
        const byId = new Map(previous.data.map((f: any) => [f.id, f]));
        const reordered = ids
          .map((id, i) => ({ ...(byId.get(id) as any), sortOrder: i }))
          .filter((f) => f.id);
        qc.setQueryData(LIST_KEY, { ...previous, data: reordered });
      }
      return { previous };
    },
    onError: (err: any, _ids, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(LIST_KEY, ctx.previous);
      toast.error(getErrorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: FAQS_KEY }),
  });
};

export const useDeleteFaq = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (id: string) => FaqService.remove(id).then((r) => r.data),
    onSuccess: () => {
      refresh();
      toast.success("Question deleted");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};
