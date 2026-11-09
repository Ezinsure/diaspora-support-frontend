 
"use client";
 
import { Ban, Check, Inbox, Loader, PartyPopper } from "lucide-react";
import type { TrackedRequest } from "@/services/publicTrackService";
import PaymentBox, { money } from "./PaymentBox";
import DocumentsUpload from "./DocsUpload";
 
const day = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short", year: "numeric" }) : "";
 
const STEPS = [
  { key: "pending", label: "Received", text: "We have your request and are reviewing it.", icon: Inbox },
  { key: "in_progress", label: "In progress", text: "We are working on it for you.", icon: Loader },
  { key: "completed", label: "Completed", text: "All done.", icon: PartyPopper },
];
 
export const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-600/20",
  in_progress: "bg-blue-50 text-blue-700 ring-blue-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};
 
// One request as the customer sees it: progress, what to send, quotation, payment
const RequestDetails = ({ request: r, email }: { request: TrackedRequest; email: string }) => {
  const cancelled = r.status === "cancelled";
  const current = Math.max(STEPS.findIndex((s) => s.key === r.status), 0);
  const q = r.proforma;
  const closed = cancelled || r.status === "completed";
 
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Hello {r.customer.firstName},</p>
          <h2 className="text-xl font-semibold text-title">{r.service}</h2>
          <p className="font-mono text-sm text-gray-500">
            {r.reference} · sent {day(r.createdAt)}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_TONE[r.status] ?? "bg-gray-100 text-gray-700 ring-gray-500/20"}`}>
          {r.statusLabel}
        </span>
      </div>
 
      {/* Progress */}
      {cancelled ? (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-red-800">
          <Ban className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">This request was cancelled</p>
            {r.statusNote && <p className="text-sm">{r.statusNote}</p>}
          </div>
        </div>
      ) : (
        <ol className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s, i) => {
            const done = i < current || r.status === "completed";
            const now = i === current && r.status !== "completed";
            const Icon = done ? Check : s.icon;
            return (
              <li
                key={s.key}
                className={`rounded-xl border p-3 ${now ? "border-primary/40 bg-primary/5" : done ? "border-emerald-200 bg-emerald-50/50" : "border-gray-200"}`}
                aria-current={now ? "step" : undefined}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    now ? "bg-primary text-white" : done ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className={`mt-2 text-sm font-medium ${done || now ? "text-gray-900" : "text-gray-400"}`}>{s.label}</p>
                {now && <p className="text-xs text-gray-600">{r.statusNote || s.text}</p>}
              </li>
            );
          })}
        </ol>
      )}
 
      {/* What they asked */}
      <section className="space-y-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Your request</h3>
        <p className="whitespace-pre-line rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">{r.description}</p>
      </section>
 
      {/* Documents: the customer uploads them here */}
      <DocumentsUpload request={r} email={email} />
 
      {/* Quotation */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{q ? `Quotation ${q.number}` : "Quotation"}</h3>
        {!q ? (
          <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {cancelled ? "No quotation." : "We are preparing your quotation. You will be able to pay here as soon as it is ready."}
          </p>
        ) : (
          <>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {q.items.map((it, i) => (
                  <tr key={i}>
                    <td className="py-2 text-gray-800">
                      {it.description}
                      {Number(it.quantity) !== 1 && <span className="text-gray-400"> × {it.quantity}</span>}
                    </td>
                    <td className="py-2 text-right tabular-nums text-gray-800">{money(Number(it.quantity) * Number(it.unitPrice), q.currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200">
                <tr>
                  <td className="py-2 font-medium text-gray-600">Total</td>
                  <td className="py-2 text-right font-semibold tabular-nums text-gray-900">{money(q.total, q.currency)}</td>
                </tr>
                {r.amountPaid > 0 && (
                  <tr>
                    <td className="py-1 text-gray-600">Paid</td>
                    <td className="py-1 text-right tabular-nums text-emerald-700">− {money(r.amountPaid, r.currency)}</td>
                  </tr>
                )}
              </tfoot>
            </table>
            {q.validUntil && <p className="text-xs text-gray-500">Valid until {day(q.validUntil)}</p>}
            {q.note && <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">{q.note}</p>}
          </>
        )}
      </section>
 
      {/* Pay */}
      {q && !cancelled && (
        <section className="space-y-2 border-t border-gray-100 pt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Payment</h3>
          <PaymentBox reference={r.reference} email={email} />
        </section>
      )}
    </div>
  );
};
 
export default RequestDetails;