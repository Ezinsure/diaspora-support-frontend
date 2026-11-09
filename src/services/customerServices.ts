import HttpRequest from "@/lib/admin/httpRequest";

const BASE = "/customers";

export const CustomerService = {
  getAll: (params?: any) => HttpRequest.get(BASE, { params }),

  getStats: () => HttpRequest.get(`${BASE}/stats`),

  getOne: (id: string) => HttpRequest.get(`${BASE}/${id}`),

  update: (id: string, data: Record<string, unknown>) => HttpRequest.patch(`${BASE}/${id}`, data),
};