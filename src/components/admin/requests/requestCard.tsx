"use client";

import { useRef, useState } from "react";
import { Check, Copy, CreditCard, FileText, Mail, MessageCircle, Paperclip, Pencil, Receipt, ReceiptText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import {
  amountDue,
  canEdit,
  canPay,
  canUpload,
  currencyOf,
  formatDate,
  formatMoney,
  hasQuotation,
  hasReceipt,
  isOpen,
  isPaid,
  statusInfo,
} from "./requestStatus";

const initials = (r: any) => `${r.firstName?.[0] ?? ""}${r.lastName?.[0] ?? ""}`.toUpperCase() || "?";

const RequestCard = ({
  request,
  onEdit,
  onUpload,
  onPay,
  onViewQuotation,
  onViewReceipt,
}: {
  request: any;
  onEdit: (r: any) => void;
  onUpload: (r: any, files: File[]) => void;
  onPay: (r: any) => void;
  onViewQuotation: (r: any) => void;
  onViewReceipt: (r: any) => void;
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
  const required: string[] = request.requiredDocuments ?? [];
  const amount = amountDue(request);
  const currency = currencyOf(request);
  const paid = isPaid(request);
  const quoted = hasQuotation(request);
  const needsAgreement = isOpen(request) && !paid && amount <= 0;
  const waLink = `https://wa.me/${String(request.whatsapp).replace(/\D/g, "")}`;

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-sm">

      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
        <button
          type="button"
          onClick={copyRef}
          title="Copy reference"
          className="group inline-flex items-center gap-1.5 font-mono text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {request.reference}
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />}
        </button>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", st.badge)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} /> {st.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials(request)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-title">{request.firstName} {request.lastName}</p>
            <p className="truncate text-base text-primary">{request.service}</p>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-gray-700">
          <a href={`mailto:${request.email}`} className="flex items-center gap-2 truncate hover:text-gray-900">
            <Mail className="h-3 w-3 shrink-0 text-gray-700" /> <span className="truncate">{request.email}</span>
          </a>
          <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gray-900">
            <MessageCircle className="h-3 w-3 shrink-0 text-gray-700" /> {request.whatsapp}
          </a>
        </div>

        {request.note && (
          <p className="line-clamp-2 rounded-lg bg-gray-50 px-3 py-2 text-base text-ink" title={request.note}>
            {request.note}
          </p>
        )}

        {request.statusNote && request.status === "cancelled" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            <span className="font-medium">Reason:</span> {request.statusNote}
          </p>
        )}

        {/* Next step hint while we're still talking to the customer */}
        {needsAgreement && (
          <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Call or WhatsApp the customer, then use <span className="font-semibold">Edit</span> to add the documents and the amount (or a quotation).
          </p>
        )}

        {/* Documents / amount / payment */}
        <div className="grid grid-cols-3 gap-2 text-base">
          <div className="rounded-lg border border-gray-200 px-3 py-2">
            <p className="text-ink/80">Documents</p>
            <p className="mt-0.5 flex items-center gap-1 font-medium text-gray-900">
              <Paperclip className="h-3.5 w-3.5 text-gray-400" />
              {required.length ? `${docs.length}/${required.length}` : docs.length}
            </p>
          </div>

          <button
            type="button"
            disabled={!quoted}
            onClick={() => quoted && onViewQuotation(request)}
            title={quoted ? "View quotation" : undefined}
            className={cn("rounded-lg border border-gray-200 px-3 py-2 text-left", quoted ? "hover:border-primary/40 hover:bg-primary/5" : "cursor-default")}
          >
            <p className="text-ink/80">{quoted ? "Quotation" : "Amount"}</p>
            {amount > 0 ? (
              <p className={cn("mt-0.5 truncate font-medium", quoted ? "text-primary" : "text-gray-900")}>{formatMoney(amount, currency)}</p>
            ) : (
              <p className="mt-0.5 font-medium text-gray-500">Not set</p>
            )}
          </button>

          <button
            type="button"
            disabled={!paid}
            onClick={() => paid && onViewReceipt(request)}
            title={paid ? "View receipt" : undefined}
            className={cn("rounded-lg border border-gray-200 px-3 py-2 text-left", paid ? "hover:border-emerald-300 hover:bg-emerald-50" : "cursor-default")}
          >
            <p className="text-ink/80">Payment</p>
            {paid ? <p className="mt-0.5 font-medium text-emerald-700">Paid</p> : <p className="mt-0.5 font-medium text-amber-700">Not paid</p>}
          </button>
        </div>

        {/* Required documents (from the call) */}
        {required.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Required</p>
            <ul className="flex flex-wrap gap-1.5">
              {required.slice(0, 4).map((d) => (
                <li key={d} className="inline-flex max-w-44 items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600" title={d}>
                  <FileText className="h-3 w-3 shrink-0" /> <span className="truncate">{d}</span>
                </li>
              ))}
              {required.length > 4 && <li className="rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-500">+{required.length - 4} more</li>}
            </ul>
          </div>
        )}
        <p className="mt-auto text-sm text-ink/70">Created {formatDate(request.createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 px-5 py-3">
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

        {!paid && isOpen(request) && (
          <Button
            size="sm"
            className="gap-1.5"
            disabled={!canPay(request)}
            title={!canPay(request) ? "Set the amount (or a quotation) in Edit first" : undefined}
            onClick={() => onPay(request)}
          >
            <CreditCard className="h-4 w-4" /> Make payment
          </Button>
        )}

        {quoted && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onViewQuotation(request)}>
            <ReceiptText className="h-4 w-4" /> Quotation
          </Button>
        )}

        {hasReceipt(request) && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onViewReceipt(request)}>
            <Receipt className="h-4 w-4" /> Receipt
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