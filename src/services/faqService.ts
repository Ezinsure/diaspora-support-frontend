import HttpRequest from "@/lib/admin/httpRequest";

const BASE = "/faqs";

export const FaqService = {
  getAll: (params?: any) => HttpRequest.get(BASE, { params }),

  getPublished: () => HttpRequest.get(`${BASE}/published`),

  getOne: (id: string) => HttpRequest.get(`${BASE}/${id}`),

  create: (data: Record<string, unknown>) => HttpRequest.post(BASE, data),

  update: (id: string, data: Record<string, unknown>) => HttpRequest.patch(`${BASE}/${id}`, data),

  reorder: (ids: string[]) => HttpRequest.patch(`${BASE}/reorder`, { ids }),

  remove: (id: string) => HttpRequest.delete(`${BASE}/${id}`),
};