 
"use client";
 
import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, ExternalLink, Loader2, Lock, Smartphone } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicPay, usePublicPaymentLookup, } from "@/hooks/usePublicPayment";
import { publicError, TRACK_KEY } from "@/hooks/usePublicTrack";
 
export const money = (n: number, c: string) => `${c} ${Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
 
/**
 * Pay what is left on a request: card / bank (IremboPay page) or MoMo (prompt on the phone).
 * Needs the request number + the customer's email (same check as the API).
 */
const PaymentBox = ({ reference, email }: { reference: string; email: string }) => {
  const qc = useQueryClient();
  const [method, setMethod] = useState<"card" | "momo" | null>(null);
  const [phone, setPhone] = useState("");
  const [waiting, setWaiting] = useState<{ amount: number; currency: string; phone: string } | null>(null);
 
  const { data: p, isLoading, isError, error } = usePublicPaymentLookup({ reference, email }, !!waiting);
  const pay = usePublicPay();
  const balance = p?.balance ?? 0;
 
  // MoMo approved -> refresh the request on the page
  useEffect(() => {
    if (waiting && p && balance <= 0) {
      setWaiting(null);
      qc.invalidateQueries({ queryKey: TRACK_KEY });
    }
  }, [waiting, p, balance, qc]);
 
  const start = (channel: "card" | "momo") =>
    pay.mutate(
      { reference, email, channel, phone: channel === "momo" ? phone : undefined },
      {
        onSuccess: (res) => {
          if (res.channel === "card" && res.url) window.location.href = res.url; // IremboPay checkout
          if (res.channel === "momo") setWaiting({ amount: res.chargeAmount, currency: res.chargeCurrency, phone: res.phone ?? phone });
        },
      },
    );
 
  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading payment options…
      </div>
    );
  if (isError) return <p className="text-sm text-red-600">{publicError(error).message}</p>;
  if (!p) return null;
 
  if (balance <= 0 && p.quotation)
    return (
      <div className="flex items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-medium">Payment received. Thank you!</p>
          <p className="text-sm">We are working on your request and will keep you updated.</p>
        </div>
      </div>
    );
 
  if (!p.canPay)
    return p.payment.card ? null : (
      <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">Online payment is not available yet. Please contact us on WhatsApp to pay.</p>
    );
 
  if (waiting)
    return (
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-amber-900">
        <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
        <div>
          <p className="font-medium">Check your phone</p>
          <p className="text-sm">
            Approve {money(waiting.amount, waiting.currency)} on {waiting.phone} with your MoMo PIN. This page updates by itself.
          </p>
          <button type="button" onClick={() => setWaiting(null)} className="mt-1 text-xs font-medium underline-offset-4 hover:underline">
            Didn't get it? Try again
          </button>
        </div>
      </div>
    );
 
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-800">
        Left to pay: <span className="text-lg font-semibold text-gray-900">{money(balance, p.currency)}</span>
      </p>
 
      {p.openLink?.channel === "card" && (
        <a
          href={p.openLink.url}
          className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10"
        >
          Continue your card / bank payment <ExternalLink className="h-4 w-4" />
        </a>
      )}
 
      <div className="grid gap-3 sm:grid-cols-2">
        {p.payment.card && (
          <MethodCard active={method === "card"} onClick={() => setMethod("card")} icon={CreditCard} title="Card or bank" text={money(balance, p.currency)} />
        )}
        {p.payment.momo && (
          <MethodCard
            active={method === "momo"}
            onClick={() => setMethod("momo")}
            icon={Smartphone}
            title="MoMo (MTN / Airtel)"
            text={
              (p.payment.momoAmount ? money(p.payment.momoAmount, "RWF") : "") +
              (p.payment.rwfRate ? ` · 1 ${p.currency} = ${p.payment.rwfRate.toLocaleString("en-US")} RWF` : "")
            }
          />
        )}
      </div>
 
      {method === "card" && (
        <Button type="button" className="w-full gap-2" disabled={pay.isPending} onClick={() => start("card")}>
          {pay.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Pay {money(balance, p.currency)} on IremboPay
        </Button>
      )}
 
      {method === "momo" && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="MoMo number, e.g. 0788 123 456" inputMode="tel" autoComplete="tel" />
          <Button type="button" className="shrink-0 gap-2" disabled={pay.isPending || !phone.trim()} onClick={() => start("momo")}>
            {pay.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />} Send prompt
          </Button>
        </div>
      )}
 
      {pay.isError && <p className="text-sm text-red-600">{publicError(pay.error).message}</p>}
      <p className="flex items-center gap-1.5 text-xs text-gray-400">
        <Lock className="h-3 w-3" /> Secured by IremboPay. We never see your card or PIN.
      </p>
    </div>
  );
};
 
const MethodCard = ({ active, onClick, icon: Icon, title, text }: { active: boolean; onClick: () => void; icon: any; title: string; text: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-xl border p-4 text-left transition-colors ${active ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
  >
    <Icon className="h-5 w-5 text-primary" />
    <p className="mt-2 font-medium text-gray-900">{title}</p>
    <p className="text-sm text-gray-500">{text}</p>
  </button>
);
export default PaymentBox;