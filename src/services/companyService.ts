import HttpRequest from "@/lib/admin/httpRequest";
import { checkLogo } from "@/lib/files";

export const CompanyService = {
  get: async () => {
    const res = await HttpRequest.get("/company-profile");
    return res.data ?? null;
  },

  save: async (data: any) => {
    const res = await HttpRequest.put("/company-profile", data);
    return res.data;
  },

  update: async (data: any) => {
    const res = await HttpRequest.patch("/company-profile", data);
    return res.data;
  },

  uploadLogo: async (file: File, onProgress?: (percent: number) => void) => {
    const problem = checkLogo(file);
    if (problem) throw new Error(problem);
    const form = new FormData();
    form.append("file", file);
    const res = await HttpRequest.post("/company-profile/logo", form, {
      onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
    });
    return res.data;
  },

  removeLogo: async () => {
    const res = await HttpRequest.delete("/company-profile/logo");
    return res.data;
  },
};
