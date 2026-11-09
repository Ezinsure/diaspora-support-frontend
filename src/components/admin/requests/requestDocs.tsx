"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ExternalLink, Eye, FileImage, FileText, FolderOpen, Loader2, Paperclip, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormModal from "@/components/admin/modal/EditModal";
import { DOC_ACCEPT, DOC_MAX_FILES, DOC_MAX_MB, formatFileSize, fileKind, type FileKind } from "@/lib/files";
import { cn } from "../../../../lib/utils";
import { useDeleteDocument, useDocumentUrl, useDownloadDocument, useOpenDocument, useUploadDocuments } from "@/hooks/useDocoments";

const shortDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short", year: "numeric" }) : "";

const KindIcon = ({ kind, className }: { kind: FileKind; className?: string }) =>
    kind === "image" ? <FileImage className={className} /> : <FileText className={className} />;

const RequestDocuments = ({ request, readOnly = false }: { request: any; readOnly?: boolean }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const upload = useUploadDocuments();

    const docs: any[] = request.documents ?? [];
    const closed = ["completed", "cancelled"].includes(request.status);
    const canEdit = !readOnly && !closed;
    const totalSize = docs.reduce((s, d) => s + Number(d.size ?? 0), 0);

    const pick = () => fileRef.current?.click();
    const close = useCallback(() => setOpen(false), []);

    return (
        <>
            {canEdit && (
                <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept={DOC_ACCEPT}
                    className="hidden"
                    onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length) upload.mutate({ requestId: request.id, files });
                        e.target.value = "";
                    }}
                />
            )}

            {/* Card summary */}
            <div className="rounded-xl border border-ink/20 bg-gray-50/60 p-3">
                <div className="flex items-center gap-3">
                    {docs.length > 0 ? (
                        <div className="flex shrink-0 -space-x-2">
                            {docs.length > 3 && (
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-[11px] font-semibold text-gray-600 ring-2 ring-white">
                                    +{docs.length - 3}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 ring-1 ring-gray-200">
                            <Paperclip className="h-4 w-4" />
                        </span>
                    )}

                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setOpen(true)}>
                        <p className="text-sm font-medium text-gray-800">
                            {docs.length ? `${docs.length} ${docs.length === 1 ? "document" : "documents"}` : "No documents yet"}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                            {docs.length ? `${formatFileSize(totalSize)} · last added ${shortDate(docs[0]?.createdAt)}` : canEdit ? "Upload the documents" : "Nothing was uploaded"}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                        {canEdit && (
                            <Button type="button" variant="outline" size="lg" className="gap-1.5 bg-white" disabled={upload.isPending} onClick={pick}>
                                {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                {upload.isPending ? `${upload.progress}%` : "Upload"}
                            </Button>
                        )}
                    </div>
                </div>

                {upload.isPending && <ProgressBar value={upload.progress} className="mt-3" />}
            </div>

            <FormModal open={open} onOpenChange={(o: boolean) => setOpen(o)} size="lg">
                {open && <DocumentsDialog request={request} docs={docs} canEdit={canEdit} onUpload={pick} upload={upload} onClose={close} />}
            </FormModal>
        </>
    );
};

const DocumentsDialog = ({
    request,
    docs,
    canEdit,
    onUpload,
    upload,
    onClose,
}: {
    request: any;
    docs: any[];
    canEdit: boolean;
    onUpload: () => void;
    upload: ReturnType<typeof useUploadDocuments>;
    onClose: () => void;
}) => {
    const openDoc = useOpenDocument();
    const download = useDownloadDocument();
    const remove = useDeleteDocument();
    const customer = [request.firstName, request.lastName].filter(Boolean).join(" ");

    useEffect(() => {
        if (!docs.length && !upload.isPending) onClose();
    }, [docs.length, upload.isPending, onClose]);

    return (
        <div className="space-y-5 p-5 sm:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FolderOpen className="h-5 w-5" />
                    </span>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                        <p className="text-sm text-gray-500">
                            {request.reference}
                            {customer && ` · ${customer}`} · {docs.length} {docs.length === 1 ? "file" : "files"}
                        </p>
                    </div>
                </div>
                {canEdit && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        disabled={upload.isPending}
                        onClick={onUpload}
                        title={`PDF, JPG, PNG, WEBP or Word · up to ${DOC_MAX_FILES} files · ${DOC_MAX_MB} MB each`}
                    >
                        {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {upload.isPending ? `Uploading ${upload.progress}%` : "Add files"}
                    </Button>
                )}
            </div>

            {upload.isPending && <ProgressBar value={upload.progress} />}

            {/* List */}
            <ul className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                {docs.map((d) => {
                    const kind = fileKind(d.mimeType, d.fileName);
                    const busy =
                        (openDoc.isPending && openDoc.variables?.documentId === d.id) ||
                        (download.isPending && download.variables?.documentId === d.id) ||
                        (remove.isPending && remove.variables?.documentId === d.id);

                    return (
                        <li
                            key={d.id}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 transition-colors hover:border-gray-300 hover:bg-gray-50/60",
                                busy && "pointer-events-none opacity-60",
                            )}
                        >
                            <Thumb requestId={request.id} doc={d} kind={kind} />

                            <button type="button" onClick={() => openDoc.mutate({ requestId: request.id, documentId: d.id })} className="min-w-0 flex-1 text-left" title="Open">
                                <span className="block truncate text-sm font-medium text-gray-900 group-hover:underline">{d.label || d.fileName}</span>
                                <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-gray-500">
                                    {d.label && <span className="max-w-[14rem] truncate">{d.fileName}</span>}
                                    {d.label && <span aria-hidden>·</span>}
                                    <span className="uppercase">{kind === "other" ? "file" : kind}</span>
                                    <span aria-hidden>·</span>
                                    <span>{formatFileSize(Number(d.size ?? 0))}</span>
                                    {d.createdAt && (
                                        <>
                                            <span aria-hidden>·</span>
                                            <span>{shortDate(d.createdAt)}</span>
                                        </>
                                    )}
                                    {d.uploadedBy && (
                                        <>
                                            <span aria-hidden>·</span>
                                            <span>by {d.uploadedBy}</span>
                                        </>
                                    )}
                                </span>
                            </button>

                            <div className="flex shrink-0 items-center gap-0.5">
                                {busy ? (
                                    <Loader2 className="mx-2 h-4 w-4 animate-spin text-gray-400" />
                                ) : (
                                    <>
                                        <IconButton label="Open" onClick={() => openDoc.mutate({ requestId: request.id, documentId: d.id })}>
                                            <ExternalLink className="h-4 w-4" />
                                        </IconButton>
                                        <IconButton label="Download" onClick={() => download.mutate({ requestId: request.id, documentId: d.id, fileName: d.fileName })}>
                                            <Download className="h-4 w-4" />
                                        </IconButton>
                                        {canEdit && (
                                            <IconButton
                                                label="Remove"
                                                danger
                                                onClick={() => {
                                                    if (window.confirm(`Remove "${d.label || d.fileName}" from this request?`)) {
                                                        remove.mutate({ requestId: request.id, documentId: d.id });
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </IconButton>
                                        )}
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

// Small preview for images
const Thumb = ({ requestId, doc, kind }: { requestId: string; doc: any; kind: FileKind }) => {
    const { data: url } = useDocumentUrl(requestId, kind === "image" ? doc.id : null);
    return url ? (
        <img src={url} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-gray-200" />
    ) : (
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1")}>
            <KindIcon kind={kind} className="h-5 w-5" />
        </span>
    );
};

const ProgressBar = ({ value, className }: { value: number; className?: string }) => (
    <div className={cn("h-1 overflow-hidden rounded-full bg-gray-200", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${value}%` }} />
    </div>
);

const IconButton = ({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors",
            danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-gray-100 hover:text-gray-700",
        )}
    >
        {children}
    </button>
);
export default RequestDocuments;