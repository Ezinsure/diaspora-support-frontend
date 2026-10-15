"use client";

import { useRef, useState } from "react";
import {
  Check,
  Copy,
  CreditCard,
  FilePlus2,
  FileText,
  Mail,
  MessageCircle,
  Paperclip,
  Pencil,
  ReceiptText,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import {
  canEdit,
  canMakeQuotation,
  canPay,
  canUpload,
  formatDate,
  formatMoney,
  hasQuotation,
  isPaid,
  quotationTotal,
  statusInfo,
  wantsQuotation,
} from "./requestStatus";

const initials = (r: any) => `${r.firstName?.[0] ?? ""}${r.lastName?.[0] ?? ""}`.toUpperCase() || "?";

const RequestCard = ({
  request,
  onEdit,
  onUpload,
  onPay,
  onMakeQuotation,
  onViewQuotation,
}: {
  request: any;
  onEdit: (r: any) => void;
  onUpload: (r: any, files: File[]) => void;
  onPay: (r: any) => void;
  onMakeQuotation: (r: any) => void;
  onViewQuotation: (r: any) => void;
}) => {
  const st = statusInfo(request.status);
  const fileRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(request.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { }
  };

  const docs = request.documents ?? [];
  const q = request.quotation;
  const paid = isPaid(request);
  const waitingForQuote = wantsQuotation(request) && !hasQuotation(request);
  const waLink = `https://wa.me/${String(request.whatsapp).replace(/\D/g, "")}`;

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-sm">
      {/* Top: reference + status */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
        <button
          type="button"
          onClick={copyRef}
          title="Copy reference"
          className="group inline-flex items-center gap-1.5 font-mono text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          {request.reference}
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />}
        </button>
        <div className="flex items-center gap-1.5">
          {waitingForQuote && (
            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20">
              Quote requested
            </span>
          )}
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", st.badge)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} /> {st.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials(request)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">{request.firstName} {request.lastName}</p>
            <p className="truncate text-sm text-primary">{request.service}</p>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-gray-600">
          <a href={`mailto:${request.email}`} className="flex items-center gap-2 truncate hover:text-gray-900">
            <Mail className="h-4 w-4 shrink-0 text-gray-400" /> <span className="truncate">{request.email}</span>
          </a>
          <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gray-900">
            <MessageCircle className="h-4 w-4 shrink-0 text-emerald-600" /> {request.whatsapp}
          </a>
        </div>

        {request.note && (
          <p className="line-clamp-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600" title={request.note}>
            {request.note}
          </p>
        )}

        {request.statusNote && request.status === "cancelled" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            <span className="font-medium">Reason:</span> {request.statusNote}
          </p>
        )}

        {/* Documents / quotation / payment */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg border border-gray-100 px-3 py-2">
            <p className="text-gray-500">Documents</p>
            <p className="mt-0.5 flex items-center gap-1 font-medium text-gray-900">
              <Paperclip className="h-3.5 w-3.5 text-gray-400" /> {docs.length}
            </p>
          </div>

          <button
            type="button"
            disabled={!q}
            onClick={() => q && onViewQuotation(request)}
            className={cn("rounded-lg border px-3 py-2 text-left", q ? "border-gray-100 hover:border-primary/40 hover:bg-primary/5" : "border-gray-100 cursor-default")}
            title={q ? "View quotation" : undefined}
          >
            <p className="text-gray-500">Quotation</p>
            {q ? (
              <p className="mt-0.5 truncate font-medium text-primary">{formatMoney(quotationTotal(q.items), q.currency)}</p>
            ) : waitingForQuote ? (
              <p className="mt-0.5 font-medium text-violet-700">Requested</p>
            ) : (
              <p className="mt-0.5 font-medium text-gray-400">None</p>
            )}
          </button>

          <div className="rounded-lg border border-gray-100 px-3 py-2">
            <p className="text-gray-500">Payment</p>
            {paid ? (
              <p className="mt-0.5 truncate font-medium text-emerald-700">{formatMoney(request.payment.amount, request.payment.currency)}</p>
            ) : (
              <p className="mt-0.5 font-medium text-amber-700">Not paid</p>
            )}
          </div>
        </div>

        {docs.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {docs.slice(0, 3).map((d: any, i: number) => (
              <li key={i} className="inline-flex max-w-40 items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600" title={d.name}>
                <FileText className="h-3 w-3 shrink-0" /> <span className="truncate">{d.name}</span>
              </li>
            ))}
            {docs.length > 3 && <li className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500">+{docs.length - 3} more</li>}
          </ul>
        )}

        <p className="mt-auto text-xs text-gray-400">Submitted {formatDate(request.createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-5 py-3">
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onUpload(request, files);
            e.target.value = ""; // allow picking the same file again
          }}
        />
        <Button variant="outline" size="sm" className="gap-1.5" disabled={!canUpload(request)} onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" /> Documents
        </Button>

        {/* Quotation: view if it exists, make it if requested (staff can also make one without a request) */}
        {q ? (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onViewQuotation(request)}>
            <ReceiptText className="h-4 w-4" /> Quotation
          </Button>
        ) : (
          canMakeQuotation(request) && (
            <Button
              variant={waitingForQuote ? "default" : "ghost"}
              size="sm"
              className={cn("gap-1.5", !waitingForQuote && "text-gray-600")}
              onClick={() => onMakeQuotation(request)}
            >
              <FilePlus2 className="h-4 w-4" /> Make quotation
            </Button>
          )
        )}

        {canPay(request) && !waitingForQuote && (
          <Button size="sm" className="gap-1.5" onClick={() => onPay(request)}>
            <CreditCard className="h-4 w-4" /> Make payment
          </Button>
        )}

        {canEdit(request) && (
          <Button variant="ghost" size="sm" className="ml-auto gap-1.5 text-gray-600" onClick={() => onEdit(request)}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>
    </article>
  );
};

export default RequestCard;