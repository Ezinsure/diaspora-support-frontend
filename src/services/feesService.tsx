import HttpRequest from "@/lib/admin/httpRequest";

const BASE = "/service-fees";

export const ServiceFeeService = {

  getAll: (params?: any) => HttpRequest.get(BASE, { params }),

  // Active fees grouped by service (for the website / request form)
  getPublic: (serviceId?: string) => HttpRequest.get(`${BASE}/public`, { params: serviceId ? { serviceId } : undefined }),

  getOne: (id: string) => HttpRequest.get(`${BASE}/${id}`),

  create: (data: Record<string, unknown>) => HttpRequest.post(BASE, data),

  // Any field, incl. linking / unlinking a service ({ serviceId: null }) and { isActive }
  update: (id: string, data: Record<string, unknown>) => HttpRequest.patch(`${BASE}/${id}`, data),

  remove: (id: string) => HttpRequest.delete(`${BASE}/${id}`),
};