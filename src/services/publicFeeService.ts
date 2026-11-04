import HttpRequest from "@/lib/admin/httpRequest";

export type PublicFeeGroup = {
  serviceId: string;
  serviceName: string;
  fees: PublicFee[];
};
export type PublicFee = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string | null;
};

const BASE = "/service-fees/public";

export const PublicAllFeeService = {
  getAll: () => HttpRequest.get<PublicFeeGroup[]>(BASE),

  // Only one service's fees
  getForService: (serviceId: string) =>
    HttpRequest.get<PublicFeeGroup[]>(BASE, { params: { serviceId } }),
};

export const PublicFeeService = {
  getOne: (id: string) =>
    HttpRequest.get<PublicFee>(`/service-fees/public/${id}`),
};
