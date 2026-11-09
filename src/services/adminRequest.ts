import HttpRequest from "@/lib/admin/httpRequest";

const BASE = "/requests";

export const RequestService = {
  getAll: (params?: any) => HttpRequest.get(BASE, { params }),

  getStats: (params?: any) => HttpRequest.get(`${BASE}/stats`, { params }),

  getOne: (id: string) => HttpRequest.get(`${BASE}/${id}`),

  create: (data: Record<string, unknown>) => HttpRequest.post(BASE, data),

  update: (id: string, data: Record<string, unknown>) => HttpRequest.patch(`${BASE}/${id}`, data),

  //  Quotation (proforma) 
  getSupportFee: () => HttpRequest.get(`${BASE}/support-fee`),

  // Create or replace. 
  saveQuotation: (id: string, data: Record<string, unknown>) => HttpRequest.put(`${BASE}/${id}/proforma`, data),

  // Email it to the customer
  sendQuotation: (id: string) => HttpRequest.post(`${BASE}/${id}/proforma/send`),

    //  IremboPay 

  // -> { configured, momo, rwfRate, links: [...] }
  paymentLinks: (id: string) => HttpRequest.get(`${BASE}/${id}/payment-links`),

  // Card / bank link for what is left to pay (an open one on the same channel is reused)
  createPaymentLink: (id: string, channel: "card" | "momo") => HttpRequest.post(`${BASE}/${id}/payment-links`, { channel }),

  // MoMo prompt on the customer's phone (RWF)
  pushMomo: (id: string, phone: string) => HttpRequest.post(`${BASE}/${id}/payment-links/momo`, { phone }),

  // Ask IremboPay now if it was paid
  checkPaymentLink: (id: string, linkId: string) => HttpRequest.post(`${BASE}/${id}/payment-links/${linkId}/check`),

  cancelPaymentLink: (id: string, linkId: string) => HttpRequest.delete(`${BASE}/${id}/payment-links/${linkId}`),

  // Documents 
  listDocuments: (id: string) => HttpRequest.get(`${BASE}/${id}/documents`),

  uploadDocuments: (id: string, files: File[], label?: string) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    if (label?.trim()) form.append("label", label.trim());
    return HttpRequest.post(`${BASE}/${id}/documents`, form, { timeout: 120_000 }); 
  },

  documentUrl: (id: string, documentId: string) => HttpRequest.get(`${BASE}/${id}/documents/${documentId}/url`),

  removeDocument: (id: string, documentId: string) => HttpRequest.delete(`${BASE}/${id}/documents/${documentId}`),
};