import HttpRequest from "@/lib/admin/httpRequest";

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

  uploadLogo: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await HttpRequest.post("/company-profile/logo", form);
    return res.data;
  },

  removeLogo: async () => {
    const res = await HttpRequest.delete("/company-profile/logo");
    return res.data;
  },
};
