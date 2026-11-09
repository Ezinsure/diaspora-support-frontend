
import PublicHttp from "@/lib/publicHttp";
 
const BASE = "/public/requests";
 
export type TrackedRequest = {
  reference: string;
  service: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | string;
  statusLabel: string;
  statusNote: string | null;
  requiredDocuments: string[];
  currency: string;
  amountDue: number | null;
  amountPaid: number;
  balance: number | null;
  paymentStatus: string;
  proforma: {
    number: string;
    items: { description: string; quantity: number; unitPrice: number; feeId?: string | null }[];
    total: number;
    currency: string;
    validUntil: string | null;
    note: string | null;
  } | null;
  customer: { firstName: string; lastName: string };
  // Files we have for this request (names only, never a download link)
  documents: { label: string | null; fileName: string; createdAt: string; fromYou: boolean }[];
  createdAt: string;
  updatedAt: string;
};
 
export type AccessToken = { token: string; expiresAt: string };
 
const bearer = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });
 
export const PublicTrackService = {
  // One request: number + the email used
  track: (body: { reference: string; email: string }) => PublicHttp.post<TrackedRequest>(`${BASE}/track`, body),
 
  // All requests: a 6-digit code by email
  sendCode: (email: string) => PublicHttp.post<{ message: string }>(`${BASE}/access-code`, { email }),
  verifyCode: (email: string, code: string) =>
    PublicHttp.post<AccessToken & { requests: TrackedRequest[] }>(`${BASE}/verify-code`, { email, code }),
  // The customer sends documents (multipart: reference, email, label?, files)
  uploadDocuments: (reference: string, email: string, files: File[], label?: string, onProgress?: (percent: number) => void) => {
    const form = new FormData();
    form.append("reference", reference);
    form.append("email", email);
    if (label) form.append("label", label);
    files.forEach((f) => form.append("files", f));
    return PublicHttp.post<TrackedRequest>(`${BASE}/documents`, form, {
      timeout: 5 * 60_000,
      onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
    });
  },
 
  mine: (token: string) => PublicHttp.get<TrackedRequest[]>(`${BASE}/mine`, bearer(token)),
};