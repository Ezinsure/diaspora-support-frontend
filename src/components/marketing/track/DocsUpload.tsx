 
"use client";
 
import { useRef, useState } from "react";
import { CheckCircle2, Circle, FileText, Loader2, Paperclip, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOC_ACCEPT, DOC_MAX_MB } from "@/lib/files";
import { publicError, useCustomerUpload } from "@/hooks/usePublicTrack";
import type { TrackedRequest } from "@/services/publicTrackService";
 
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short" });
const same = (a?: string | null, b?: string | null) => (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
 
/**
 * The customer sends their documents here.
 * Each required document has its own Upload button (the file is labelled with its name),
 * plus "Other document" for anything else.
 */
const DocumentsUpload = ({ request: r, email }: { request: TrackedRequest; email: string }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState<string | undefined>(undefined); // which button was clicked
  const upload = useCustomerUpload();
 
  const closed = r.status === "completed" || r.status === "cancelled";
  const docs = r.documents ?? [];
  const required = r.requiredDocuments ?? [];
  const sentFor = (name: string) => docs.some((d) => same(d.label, name));
  const missing = required.filter((n) => !sentFor(n)).length;
 
  const pick = (forLabel?: string) => {
    setLabel(forLabel);
    upload.reset();
    fileRef.current?.click();
  };
 
  const error = upload.isError ? ((upload.error as any)?.response ? publicError(upload.error).message : (upload.error as Error).message) : null;
 
  if (closed && !docs.length && !required.length) return null;
 
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Your documents</h3>
          {required.length > 0 && !closed && (
            <p className="text-sm text-gray-600">{missing ? `${missing} of ${required.length} still needed` : "We have everything we asked for. Thank you!"}</p>
          )}
        </div>
        {!closed && (
          <Button type="button" variant="outline" size="sm" className="gap-1.5" disabled={upload.isPending} onClick={() => pick(undefined)}>
            <Paperclip className="h-4 w-4" /> Other document
          </Button>
        )}
      </div>
 
      {!closed && (
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={DOC_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) upload.mutate({ reference: r.reference, email, files, label });
            e.target.value = ""; // allow the same file again
          }}
        />
      )}
 
      {/* What we asked for */}
      {required.length > 0 && (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
          {required.map((name) => {
            const sent = sentFor(name);
            const busy = upload.isPending && label === name;
            return (
              <li key={name} className="flex items-center gap-3 px-3 py-2.5">
                {sent ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <Circle className="h-5 w-5 shrink-0 text-gray-300" />}
                <span className="min-w-0 flex-1 text-sm text-gray-800">
                  {name}
                  {sent && <span className="ml-2 text-xs text-emerald-700">Received</span>}
                </span>
                {!closed && (
                  <Button
                    type="button"
                    variant={sent ? "ghost" : "outline"}
                    size="sm"
                    className="shrink-0 gap-1.5"
                    disabled={upload.isPending}
                    onClick={() => pick(name)}
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {busy ? `${upload.progress}%` : sent ? "Add another" : "Upload"}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
 
      {upload.isPending && (
        <div className="space-y-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={upload.progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${upload.progress}%` }} />
          </div>
          <p className="text-xs text-gray-500">Uploading… keep this page open.</p>
        </div>
      )}
      {upload.isSuccess && <p className="text-sm text-emerald-700">Thank you, we received your file(s).</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
 
      {/* Everything we have */}
      {docs.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500">Received ({docs.length})</p>
          <ul className="space-y-1">
            {docs.map((d, i) => (
              <li key={`${d.fileName}-${i}`} className="flex items-center gap-2 text-sm text-gray-700">
                <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="min-w-0 flex-1 truncate">
                  {d.label ? <span className="font-medium">{d.label} · </span> : null}
                  {d.fileName}
                </span>
                <span className="shrink-0 text-xs text-gray-400">
                  {day(d.createdAt)} · {d.fromYou ? "by you" : "by our team"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
 
      {!closed && <p className="text-xs text-gray-400">PDF, JPG, PNG, WEBP or Word, up to {DOC_MAX_MB} MB each. Your files are private: only our team can open them.</p>}
    </section>
  );
};
 
export default DocumentsUpload;