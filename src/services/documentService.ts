import HttpRequest from "@/lib/admin/httpRequest";

const base = (requestId: string) => `/requests/${requestId}/documents`;

export const DocumentService = {
  list: (requestId: string) => HttpRequest.get(base(requestId)),

  upload: (requestId: string, files: File[], label?: string, onProgress?: (percent: number) => void) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    if (label?.trim()) form.append("label", label.trim());
    return HttpRequest.post(base(requestId), form, {
      timeout: 5 * 60_000, 
      onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
    });
  },

  getUrl: (requestId: string, documentId: string) => HttpRequest.get(`${base(requestId)}/${documentId}/url`),

  remove: (requestId: string, documentId: string) => HttpRequest.delete(`${base(requestId)}/${documentId}`),
};