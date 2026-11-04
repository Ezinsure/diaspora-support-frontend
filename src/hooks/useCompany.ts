"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CompanyService } from "@/services/companyService";
import { getErrorMessage } from "@/lib/admin/httpRequest";

export const COMPANY_KEY = ["company-profile"];

const LINKEDIN_COMPANY = /^https?:\/\/(www\.)?linkedin\.com\/company\//i;

export const EMPTY_COMPANY_FORM = {
  name: "",
  about: "",
  email: "",
  phone: "",
  website: "",
  linkedin: "",
  address: "", 
  city: "",
  country: "",
};

export const companyToForm = (c: any) => {
  if (!c) return { ...EMPTY_COMPANY_FORM };
  const linkedin = (c.linkedinUrl ?? "").replace(LINKEDIN_COMPANY, "").replace(/\/+$/, "");
  return {
    name: c.name ?? "",
    about: c.about ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    website: c.websiteUrl ?? "",
    linkedin,
    address: c.address?.street ?? "",
    city: c.address?.city ?? "",
    country: c.address?.country ?? "",
  };
};

export const formToCompany = (f: any, current?: any) => {
  const clean = (v: any) => (typeof v === "string" ? v.trim() || null : null);
  const phone = (v: any) => clean(v)?.replace(/[\s()-]/g, "") ?? null;
  const url = (v: any) => {
    const s = clean(v);
    return s && !/^https?:\/\//i.test(s) ? `https://${s}` : s;
  };
  const linkedin = (v: any) => {
    const s = clean(v);
    if (!s) return null;
    if (/^https?:\/\//i.test(s) || /linkedin\.com\//i.test(s)) return url(s); 
    return `https://www.linkedin.com/company/${s.replace(/^\/+|\/+$/g, "")}`;
  };

  return {
    name: f.name.trim(),
    about: clean(f.about),
    email: clean(f.email)?.toLowerCase() ?? null,
    phone: phone(f.phone),
    websiteUrl: url(f.website),
    linkedinUrl: linkedin(f.linkedin),
    address: {
      district: current?.address?.district ?? null, 
      city: clean(f.city),
      country: clean(f.country),
    },
  };
};

// data = profile or null
export const useCompany = () =>
  useQuery({
    queryKey: COMPANY_KEY,
    queryFn: CompanyService.get,
    staleTime: 5 * 60 * 1000,
  });

export const useSaveCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ form, current }: { form: any; current?: any }) => CompanyService.save(formToCompany(form, current)),
    onSuccess: (data: any) => {
      qc.setQueryData(COMPANY_KEY, data);
      toast.success("Company profile saved");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CompanyService.update(data),
    onSuccess: (data: any) => {
      qc.setQueryData(COMPANY_KEY, data);
      toast.success("Company profile updated");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useUploadLogo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => CompanyService.uploadLogo(file),
    onSuccess: (data: any) => {
      qc.setQueryData(COMPANY_KEY, data);
      toast.success("Logo updated");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};

export const useRemoveLogo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => CompanyService.removeLogo(),
    onSuccess: (data: any) => {
      qc.setQueryData(COMPANY_KEY, data);
      toast.success("Logo removed");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};