import HttpRequest from "@/lib/admin/httpRequest";

const BASE = "/activity-logs";

export const LogService = {

  getAll: (params?: any) => HttpRequest.get(BASE, { params }),

  getOne: (id: string) => HttpRequest.get(`${BASE}/${id}`),
};