
"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Globe,
  Loader2,
  MessageCircle,
  RefreshCw,
  Smartphone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { amountDue, balanceOf, currencyOf, formatMoney } from "../requests/requestStatus";
import {
  useCancelPaymentLink,
  useCheckPaymentLink,
  useCreatePaymentLink,
  usePaymentLinks,
  usePushMomo,
  type PaymentLinkItem,
} from "@/hooks/usePayment";

const day = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("en-GB", { timeZone: "Africa/Kigali", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

// +250 788… -> 0788…, only for Rwandan numbers (MoMo)
const rwLocal = (phone?: string) => {
  const d = String(phone ?? "").replace(/\D/g, "");
  return d.startsWith("2507") ? `0${d.slice(3)}` : d.startsWith("07") ? d : "";
};

const STATUS: Record<PaymentLinkItem["status"], string> = {
  open: "bg-amber-50 text-amber-800 ring-amber-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-500/20",
  expired: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

/**
 * Payment with IremboPay:
 *  - Card / bank: a link the customer opens (USD)
 *  - MoMo: a prompt on the customer's phone (RWF, converted)
 *  * The customer can also pay alone on the website (/track): works even when emails fail.
 */
const PaymentDialog = ({ request, onCancel }: { request: any; onCancel: () => void; onConfirm?: (p: any) => void }) => {
  const { data, isLoading, isError } = usePaymentLinks(request.id);
  const create = useCreatePaymentLink();
  const push = usePushMomo();
  const check = useCheckPaymentLink();
  const cancel = useCancelPaymentLink();

  const [phone, setPhone] = useState(rwLocal(request.whatsapp));
  const [copied, setCopied] = useState<string | null>(null);

  const currency = currencyOf(request);
  const total = amountDue(request);
  const balance = balanceOf(request);
  const links = data?.links ?? [];
  const open = links.find((l: any) => l.status === "open") ?? null;
  const past = links.filter((l: any) => l.status !== "open");
  const momoAmount = data?.rwfRate ? Math.ceil(balance * data.rwfRate) : null;
  const busy = create.isPending || push.isPending;

  const sitePay = `${process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== "undefined" ? window.location.origin : "")}/track?ref=${request.reference}`;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch { }
  };

  const waText = (url: string) =>
    `https://wa.me/${String(request.whatsapp ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(
      `Hello ${request.firstName}, here is the link to pay ${formatMoney(balance, currency)} for your request ${request.reference}: ${url}`,
    )}`;

  return (
    <div className="space-y-5 p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-start gap-3 pr-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CreditCard className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
          <p className="truncate text-sm text-ink/70">
            {request.reference} · {request.firstName} {request.lastName} · {request.service}
          </p>
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <Box label="Quotation">{formatMoney(total, currency)}</Box>
        <Box label="Paid" tone="green">
          {formatMoney(Number(request.amountPaid ?? 0), currency)}
        </Box>
        <Box label="Left to pay" tone={balance > 0 ? "amber" : "green"}>
          {formatMoney(balance, currency)}
        </Box>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : isError ? (
        <Notice tone="amber">Couldn't load the payment links. Refresh and try again.</Notice>
      ) : balance <= 0 ? (
        <Notice tone="green" icon={CheckCircle2}>
          Fully paid. The receipt is on the request card.
        </Notice>
      ) : !data?.configured ? (
        <Notice tone="amber">
          Online payment is not set up yet. Add the IremboPay keys to the API .env (IREMBOPAY_SECRET_KEY, IREMBOPAY_PAYMENT_ACCOUNT, IREMBOPAY_PRODUCT_CODE).
        </Notice>
      ) : (
        <>
          {/* Waiting for the customer */}
          {open && (
            <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  {open.channel === "momo" ? <Smartphone className="h-4 w-4 text-amber-700" /> : <CreditCard className="h-4 w-4 text-amber-700" />}
                  {open.channel === "momo" ? "MoMo" : "Card / bank link"} · {formatMoney(open.chargeAmount, open.chargeCurrency)}
                  {open.chargeCurrency !== open.currency && <span className="font-normal text-gray-500">= {formatMoney(open.amount, open.currency)}</span>}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
                  <Loader2 className="h-3 w-3 animate-spin" /> Waiting for the customer
                </span>
              </div>

              {open.channel === "momo" ? (
                <p className="text-sm text-gray-600">
                  Prompt sent to <span className="font-medium text-gray-900">{open.payerPhone}</span>. They approve it with their MoMo PIN; this updates by itself.
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 text-xs text-gray-700 ring-1 ring-gray-200">{open.url}</code>
                  <Button type="button" variant="outline" size="sm" className="gap-1.5 bg-white" onClick={() => copy(open.url, "link")}>
                    {copied === "link" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} Copy
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="gap-1.5 bg-white" render={<a href={waText(open.url)} target="_blank" rel="noreferrer" />}>
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5" render={<a href={open.url} target="_blank" rel="noreferrer" />}>
                    <ExternalLink className="h-4 w-4" /> Open
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-amber-200/70 pt-3">
                <p className="text-xs text-gray-500">
                  {open.reference} · valid until {day(open.expiresAt)}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 bg-white"
                    disabled={check.isPending}
                    onClick={() => check.mutate({ requestId: request.id, linkId: open.id })}
                  >
                    {check.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Check payment
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={cancel.isPending}
                    onClick={() => cancel.mutate({ requestId: request.id, linkId: open.id })}
                  >
                    {cancel.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} Cancel link
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Ways to pay */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <CreditCard className="h-4 w-4 text-primary" /> Card or bank
                </p>
                <p className="mt-1 text-xs text-gray-500">A link to IremboPay's page. Good for customers abroad.</p>
              </div>
              <p className="text-lg font-semibold tabular-nums text-gray-900">{formatMoney(balance, currency)}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-auto gap-1.5"
                disabled={busy || (open?.channel === "card")}
                onClick={() => create.mutate({ requestId: request.id, channel: "card" })}
              >
                {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                {open?.channel === "card" ? "Link ready above" : open ? "Switch to a card link" : "Create payment link"}
              </Button>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Smartphone className="h-4 w-4 text-primary" /> MoMo (MTN / Airtel)
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {data.momo && data.rwfRate && currency !== "RWF" ? `Paid in RWF · 1 ${currency} = ${data.rwfRate.toLocaleString("en-US")} RWF` : "A prompt on a Rwandan phone."}
                </p>
              </div>
              {data.momo ? (
                <>
                  <p className="text-lg font-semibold tabular-nums text-gray-900">{momoAmount ? formatMoney(momoAmount, "RWF") : "—"}</p>
                  <div className="mt-auto flex gap-2">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0788 123 456"
                      inputMode="tel"
                      aria-label="MoMo number"
                      className="h-9 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <Button type="button" className="shrink-0 gap-1.5" disabled={busy || !phone.trim()} onClick={() => push.mutate({ requestId: request.id, phone })}>
                      {push.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />} Send prompt
                    </Button>
                  </div>
                </>
              ) : (
                <p className="mt-auto text-xs text-amber-700">Not set up: add IREMBOPAY_PAYMENT_ACCOUNT_RWF and IREMBOPAY_RWF_PER_{currency} to the API .env.</p>
              )}
            </div>
          </div>

          {open && <p className="text-xs text-gray-500">Making a new link or prompt cancels the open one, so the customer never pays twice.</p>}

          {/* Website: works without email */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
            <Globe className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="min-w-0 flex-1">
              The customer can also pay alone on the website with <span className="font-medium text-gray-900">{request.reference}</span> and their email.
            </span>
            <Button type="button" variant="ghost" size="sm" className="gap-1.5" onClick={() => copy(sitePay, "site")}>
              {copied === "site" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} Copy page link
            </Button>
          </div>
        </>
      )}

      {/* History */}
      {past.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">History</p>
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 text-sm">
            {past.map((l: PaymentLinkItem) => (
              <li key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2">
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset", STATUS[l.status])}>{l.status}</span>
                <span className="text-gray-900">{l.channel === "momo" ? "MoMo" : "Card / bank"}</span>
                <span className="tabular-nums text-gray-600">{formatMoney(l.chargeAmount, l.chargeCurrency)}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {l.reference} · {day(l.paidAt ?? l.createdAt)}
                  {l.createdBy?.names ? ` · ${l.createdBy.names}` : " · website"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    </div>
  );
};

const Box = ({ label, tone, children }: { label: string; tone?: "green" | "amber"; children: React.ReactNode }) => (
  <div className="rounded-lg border border-gray-100 px-3 py-2">
    <p className="text-xs text-gray-500">{label}</p>
    <p className={cn("font-semibold tabular-nums", tone === "green" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-gray-900")}>{children}</p>
  </div>
);

const Notice = ({ tone, icon: Icon = AlertTriangle, children }: { tone: "amber" | "green"; icon?: any; children: React.ReactNode }) => (
  <div className={cn("flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm", tone === "green" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900")}>
    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
    <span>{children}</span>
  </div>
);
export default PaymentDialog;