 
"use client";
 
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, KeyRound, Loader2, Lock, LogOut, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  publicError,
  useMyRequests,
  useSendAccessCode,
  useTrackAccess,
  useTrackRequest,
  useVerifyAccessCode,
} from "@/hooks/usePublicTrack";
import RequestDetails, { STATUS_TONE } from "./RequestDetails";
import { money } from "./PaymentBox";
 
const EMAIL_RE = /^\S+@\S+\.\S+$/;
 
/**
 * /track: customers follow their requests without an account.
 *  - "One request": request number + the email used
 *  - "All my requests": a 6-digit code sent by email (30 minutes)
 * /track?ref=REQ-2026-0001 fills the number.
 */
const TrackPage = () => {
  const [tab, setTab] = useState<"one" | "all">("one");
 
  // ----- One request -----
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [who, setWho] = useState<{ reference: string; email: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const one = useTrackRequest(who);
 
  // ----- All requests -----
  const { access, save } = useTrackAccess();
  const [codeEmail, setCodeEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const sendCode = useSendAccessCode();
  const verify = useVerifyAccessCode();
  const mine = useMyRequests(access?.token);
  const [openRef, setOpenRef] = useState<string | null>(null);
 
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) setReference(ref.toUpperCase());
  }, []);
 
  // A saved access (same tab, < 30 min) opens the list directly
  useEffect(() => {
    if (access) setTab("all");
  }, [access]);
 
  // Token expired -> back to the email step
  useEffect(() => {
    if (mine.isError) save(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mine.isError]);
 
  const findOne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return setFormError("Enter your request number, e.g. REQ-2026-0001");
    if (!EMAIL_RE.test(email.trim())) return setFormError("Enter the email you used for the request");
    setFormError(null);
    setWho({ reference: reference.trim().toUpperCase(), email: email.trim().toLowerCase() });
  };
 
  const askCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(codeEmail.trim())) return setFormError("Enter your email");
    setFormError(null);
    sendCode.mutate(codeEmail.trim().toLowerCase(), { onSuccess: () => setCodeSent(true) });
  };
 
  const checkCode = (e: React.FormEvent) => {
    e.preventDefault();
    const em = codeEmail.trim().toLowerCase();
    verify.mutate({ email: em, code: code.trim() }, { onSuccess: (d) => save({ token: d.token, expiresAt: d.expiresAt, email: em }) });
  };
 
  const signOut = () => {
    save(null);
    setCodeSent(false);
    setCode("");
    setOpenRef(null);
    verify.reset();
  };
 
  const card = "mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8";
 
  // ---------- One request: details ----------
  if (tab === "one" && who && one.data) {
    return (
      <div className={card}>
        <BackButton onClick={() => setWho(null)}>Find another request</BackButton>
        <RequestDetails request={one.data} email={who.email} />
      </div>
    );
  }
 
  // ---------- All requests: one opened ----------
  const opened = access && openRef ? (mine.data ?? []).find((r) => r.reference === openRef) : null;
  if (tab === "all" && access && opened) {
    return (
      <div className={card}>
        <BackButton onClick={() => setOpenRef(null)}>All my requests</BackButton>
        <RequestDetails request={opened} email={access.email} />
      </div>
    );
  }
 
  return (
    <div className={`${card} space-y-6`}>
      <div>
        <h1 className="text-2xl font-semibold text-title">Track your request</h1>
        <p className="mt-1 text-sm text-gray-600">See where your request is, your quotation, and pay online.</p>
      </div>
 
      {/* Tabs */}
      <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1 text-sm font-medium">
        {(
          [
            ["one", "One request"],
            ["all", "All my requests"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => {
              setTab(key);
              setFormError(null);
            }}
            className={`rounded-lg px-3 py-2 transition-colors ${tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
          >
            {label}
          </button>
        ))}
      </div>
 
      {tab === "one" ? (
        /* ---------- Number + email ---------- */
        <form onSubmit={findOne} noValidate className="space-y-4">
          <Field label="Request number">
            <Input value={reference} onChange={(e) => setReference(e.target.value.toUpperCase())} placeholder="REQ-2026-0001" autoComplete="off" />
          </Field>
          <Field label="Email" hint="The email you used when you sent the request.">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </Field>
          {(formError || one.isError) && <p className="text-sm text-red-600">{formError || publicError(one.error).message}</p>}
          <Button type="submit" className="w-full gap-2" disabled={one.isFetching}>
            {one.isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Find my request
          </Button>
        </form>
      ) : access ? (
        /* ---------- List ---------- */
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 text-sm text-gray-600">
            <span className="truncate">
              Signed in as <span className="font-medium text-gray-900">{access.email}</span>
            </span>
            <button type="button" onClick={signOut} className="inline-flex shrink-0 items-center gap-1 text-gray-500 hover:text-gray-900">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
 
          {mine.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your requests…
            </div>
          ) : (mine.data ?? []).length === 0 ? (
            <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">No requests yet for this email.</p>
          ) : (
            <ul className="space-y-2">
              {(mine.data ?? []).map((r) => (
                <li key={r.reference}>
                  <button
                    type="button"
                    onClick={() => setOpenRef(r.reference)}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-gray-300 hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">{r.service}</p>
                      <p className="font-mono text-xs text-gray-500">{r.reference}</p>
                      {r.balance !== null && r.balance > 0 && r.status !== "cancelled" && (
                        <p className="mt-1 text-xs font-medium text-amber-700">To pay: {money(r.balance, r.currency)}</p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_TONE[r.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {r.statusLabel}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-400">For your safety, this access ends 30 minutes after you entered the code.</p>
        </div>
      ) : !codeSent ? (
        /* ---------- Email -> code ---------- */
        <form onSubmit={askCode} noValidate className="space-y-4">
          <Field label="Email" hint="We'll email you a 6-digit code to see all your requests.">
            <Input type="email" value={codeEmail} onChange={(e) => setCodeEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </Field>
          {(formError || sendCode.isError) && <p className="text-sm text-red-600">{formError || publicError(sendCode.error).message}</p>}
          <Button type="submit" className="w-full gap-2" disabled={sendCode.isPending}>
            {sendCode.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Send me a code
          </Button>
          <p className="text-xs text-gray-500">No email from us? Use “One request” with your request number instead.</p>
        </form>
      ) : (
        /* ---------- Code ---------- */
        <form onSubmit={checkCode} noValidate className="space-y-4">
          <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {sendCode.data?.message ?? "If we have requests for this email, we sent you a 6-digit code."} Check <span className="font-medium">{codeEmail}</span>, and
            your spam folder.
          </p>
          <Field label="6-digit code">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="text-center font-mono text-lg tracking-[0.4em]"
            />
          </Field>
          {verify.isError && <p className="text-sm text-red-600">{publicError(verify.error).message}</p>}
          <Button type="submit" className="w-full gap-2" disabled={verify.isPending || code.length !== 6}>
            {verify.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} See my requests
          </Button>
          <div className="flex justify-between text-sm">
            <button type="button" onClick={() => setCodeSent(false)} className="text-gray-500 hover:text-gray-900">
              Change email
            </button>
            <button
              type="button"
              disabled={sendCode.isPending}
              onClick={() => sendCode.mutate(codeEmail.trim().toLowerCase())}
              className="text-primary hover:underline disabled:opacity-50"
            >
              Send a new code
            </button>
          </div>
        </form>
      )}
 
      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <Lock className="h-3 w-3" /> We only show your requests to you.
      </p>
    </div>
  );
};
 
const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    {children}
    {hint && <span className="block text-xs text-gray-500">{hint}</span>}
  </label>
);
 
const BackButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
    <ArrowLeft className="h-4 w-4" /> {children}
  </button>
);
export default TrackPage;