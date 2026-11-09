import PublicHttp from "@/lib/publicHttp";
 
const BASE = "/public/payments";
 
export type PublicQuotation = {
  number: string;
  currency: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  total: number;
  validUntil: string | null;
  note: string | null;
};
 
export type PublicRequestPayment = {
  reference: string;
  firstName: string;
  service: string;
  status: string;
  statusLabel: string;
  quotation: PublicQuotation | null;
  currency: string;
  amountPaid: number;
  balance: number | null;
  canPay: boolean;
  payment: { card: boolean; momo: boolean; momoAmount: number | null; rwfRate: number | null };
  openLink: { channel: "card" | "momo"; url: string; chargeAmount: number; chargeCurrency: string; expiresAt: string } | null;
};
 
export type PayResult = {
  channel: "card" | "momo";
  url?: string; // card: open it
  chargeAmount: number;
  chargeCurrency: string;
  phone?: string; // momo
  provider?: "MTN" | "AIRTEL";
};
 
// The customer: request number + the email they used
export const PublicPaymentService = {
  lookup: (body: { reference: string; email: string }) => PublicHttp.post<PublicRequestPayment>(`${BASE}/lookup`, body),
  pay: (body: { reference: string; email: string; channel: "card" | "momo"; phone?: string }) => PublicHttp.post<PayResult>(`${BASE}/pay`, body),
};