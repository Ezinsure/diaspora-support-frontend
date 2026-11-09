"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DocumentService } from "@/services/documentService";
import { getErrorMessage } from "@/lib/admin/httpRequest";
import {
  checkDocuments,
  fileKind,
  formatFileSize,
  type FileKind,
} from "@/lib/files";

const REQUESTS_KEY = ["requests"];
const docsKey = (requestId?: string | null) => [
  ...REQUESTS_KEY,
  "documents",
  requestId,
];

export interface RequestDocumentItem {
  id: string;
  label: string | null;
  fileName: string;
  name: string;
  mimeType: string;
  size: number;
  sizeLabel: string;
  kind: FileKind;
  createdAt: string;
  uploadedBy: string | null;
}

export const toDocumentItem = (d: any): RequestDocumentItem => ({
  id: d.id,
  label: d.label ?? null,
  fileName: d.fileName ?? "",
  name: d.label ? `${d.label} — ${d.fileName}` : (d.fileName ?? ""),
  mimeType: d.mimeType ?? "",
  size: Number(d.size ?? 0),
  sizeLabel: formatFileSize(Number(d.size ?? 0)),
  kind: fileKind(d.mimeType, d.fileName),
  createdAt: d.createdAt,
  uploadedBy: d.createdBy?.names ?? null,
});

export const useRequestDocuments = (requestId?: string | null) =>
  useQuery({
    queryKey: docsKey(requestId),
    queryFn: () =>
      DocumentService.list(requestId as string).then((r) => r.data),
    select: (rows: any[]) => (rows ?? []).map(toDocumentItem),
    enabled: !!requestId,
  });

export const useDocumentUrl = (
  requestId?: string | null,
  documentId?: string | null,
) =>
  useQuery({
    queryKey: [...docsKey(requestId), "url", documentId],
    queryFn: () =>
      DocumentService.getUrl(requestId as string, documentId as string).then(
        (r) => r.data.url as string,
      ),
    enabled: !!requestId && !!documentId,
    staleTime: 4 * 60_000,
    gcTime: 4 * 60_000,
    refetchInterval: 4 * 60_000,
  });

const useRefresh = () => {
  const qc = useQueryClient();
  return (requestId: string) => {
    qc.invalidateQueries({ queryKey: docsKey(requestId) });
    qc.invalidateQueries({ queryKey: REQUESTS_KEY });
  };
};

export const useUploadDocuments = () => {
  const refresh = useRefresh();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({
      requestId,
      files,
      label,
    }: {
      requestId: string;
      files: File[];
      label?: string;
    }) => {
      const problem = checkDocuments(files);
      if (problem) throw new Error(problem);
      setProgress(0);
      return DocumentService.upload(requestId, files, label, setProgress).then(
        (r) => (r.data as any[]).map(toDocumentItem),
      );
    },
    onSuccess: (_docs, { requestId, files }) => {
      refresh(requestId);
      toast.success(
        files.length === 1
          ? `"${files[0].name}" uploaded`
          : `${files.length} documents uploaded`,
      );
    },
    onError: (err: any) =>
      toast.error(getErrorMessage(err, "Upload failed. Please try again.")),
    onSettled: () => setTimeout(() => setProgress(0), 600),
  });

  return { ...mutation, progress };
};

export const useOpenDocument = () =>
  useMutation({
    mutationFn: async ({
      requestId,
      documentId,
    }: {
      requestId: string;
      documentId: string;
    }) => {
      // Open the tab now: browsers block tabs opened after waiting for the server
      const tab = window.open("about:blank", "_blank");
      try {
        const { data } = await DocumentService.getUrl(requestId, documentId);
        if (tab) tab.location.href = data.url;
        else window.location.href = data.url;
      } catch (err) {
        tab?.close();
        throw err;
      }
    },
    onError: (err: any) =>
      toast.error(getErrorMessage(err, "Couldn't open the document")),
  });

// Saves the file to the computer
export const useDownloadDocument = () =>
  useMutation({
    mutationFn: async ({
      requestId,
      documentId,
      fileName,
    }: {
      requestId: string;
      documentId: string;
      fileName: string;
    }) => {
      const { data } = await DocumentService.getUrl(requestId, documentId);
      const res = await fetch(data.url);
      if (!res.ok) throw new Error("The download link expired. Try again.");
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = fileName || "document";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
    },
    onError: (err: any) =>
      toast.error(getErrorMessage(err, "Couldn't download the document")),
  });

export const useDeleteDocument = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({
      requestId,
      documentId,
    }: {
      requestId: string;
      documentId: string;
    }) => DocumentService.remove(requestId, documentId).then((r) => r.data),
    onSuccess: (_r, { requestId }) => {
      refresh(requestId);
      toast.success("Document removed");
    },
    onError: (err: any) => toast.error(getErrorMessage(err)),
  });
};
