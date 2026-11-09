
"use client";
 
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkDocuments } from "@/lib/files";
import { PublicTrackService, type AccessToken, type TrackedRequest } from "@/services/publicTrackService";
 
export { publicError } from "@/hooks/usePublicRequest";
 
export const TRACK_KEY = ["track"];
 
//  One request 
 
export const useTrackRequest = (who: { reference: string; email: string } | null) =>
  useQuery({
    queryKey: [...TRACK_KEY, "one", who?.reference, who?.email],
    queryFn: () => PublicTrackService.track(who!).then((r) => r.data),
    enabled: !!who,
    retry: false,
  });
 
//  All requests (code by email) 
// The 30-minute access is kept for this browser tab only
const STORE = "ds-track-access";
type Access = AccessToken & { email: string };
 
const readAccess = (): Access | null => {
  try {
    const a = JSON.parse(sessionStorage.getItem(STORE) ?? "null") as Access | null;
    return a && new Date(a.expiresAt).getTime() > Date.now() ? a : null;
  } catch {
    return null;
  }
};
 
export const useTrackAccess = () => {
  const [access, setAccess] = useState<Access | null>(null);
  useEffect(() => setAccess(readAccess()), []);
 
  const save = (a: Access | null) => {
    try {
      if (a) sessionStorage.setItem(STORE, JSON.stringify(a));
      else sessionStorage.removeItem(STORE);
    } catch {}
    setAccess(a);
  };
  return { access, save };
};
 
export const useSendAccessCode = () => useMutation({ mutationFn: (email: string) => PublicTrackService.sendCode(email).then((r) => r.data) });
 
export const useVerifyAccessCode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => PublicTrackService.verifyCode(email, code).then((r) => r.data),
    onSuccess: (data) => qc.setQueryData([...TRACK_KEY, "mine", data.token], data.requests),
  });
};
 
export const useMyRequests = (token?: string | null) =>
  useQuery({
    queryKey: [...TRACK_KEY, "mine", token],
    queryFn: () => PublicTrackService.mine(token!).then((r) => r.data as TrackedRequest[]),
    enabled: !!token,
    retry: false,
  });
 
// Customer uploads
export const useCustomerUpload = () => {
  const qc = useQueryClient();
  const [progress, setProgress] = useState(0);
  const mutation = useMutation({
    mutationFn: ({ reference, email, files, label }: { reference: string; email: string; files: File[]; label?: string }) => {
      const problem = checkDocuments(files);
      if (problem) throw new Error(problem);
      setProgress(0);
      return PublicTrackService.uploadDocuments(reference, email, files, label, setProgress).then((r) => r.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TRACK_KEY }),
    onSettled: () => setTimeout(() => setProgress(0), 600),
  });
  return { ...mutation, progress };
};