import HttpRequest from "@/lib/admin/httpRequest";

const BASE = "/users";

export const UserService = {
  getAll: (params?: any) =>
    HttpRequest.get(BASE, {
      params,
    }),

  getOne: (id: string) => HttpRequest.get(`${BASE}/${id}`),

  getStats: () => HttpRequest.get(`${BASE}/stats`),

  create: (data: Record<string, unknown>) => HttpRequest.post(BASE, data),

  update: (id: string, data: Record<string, unknown>) =>
    HttpRequest.patch(`${BASE}/${id}`, data),

  setStatus: (id: string, status: "active" | "inactive") =>
    HttpRequest.patch(`${BASE}/${id}/status`, { status }),

  remove: (id: string) => HttpRequest.delete(`${BASE}/${id}`),
};
