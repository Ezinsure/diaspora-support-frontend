import PublicHttp from "@/lib/publicHttp";

export type PublicService = { id: string; name: string; description?: string | null };

export type SubmitRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; 
  serviceId: string;
  country?: string | null;
  timezone?: string | null; 
  description: string;
};

export type SubmitRequestResult = {
  reference: string; 
  status: string; 
  service: string;
  message: string;
};

export const PublicRequestService = {
  
  getServices: () =>
    PublicHttp.get("/services", { params: { isActive: true, page: 1, limit: 100, sortBy: "name", order: "ASC" } }),

  submit: (body: SubmitRequestBody) => PublicHttp.post<SubmitRequestResult>("/requests/submit", body),
};