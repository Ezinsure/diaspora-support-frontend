import HttpRequest from "@/lib/admin/httpRequest";

const BASE = "/services";

export const ServicesService = {
  getAll: (params?: any) => HttpRequest.get(BASE, { params }),

  getTags: () => HttpRequest.get(`${BASE}/tags`),

  getOne: (id: string) => HttpRequest.get(`${BASE}/${id}`),

  create: (data: Record<string, unknown>) => HttpRequest.post(BASE, data),

  update: (id: string, data: Record<string, unknown>) =>
    HttpRequest.patch(`${BASE}/${id}`, data),

  remove: (id: string) => HttpRequest.delete(`${BASE}/${id}`),
};
