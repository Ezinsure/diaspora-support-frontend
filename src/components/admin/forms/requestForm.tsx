"use client";

import { useState } from "react";
import { FileText, Loader2, Lock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { SERVICES, formatMoney, inDays, isPaid, quotationTotal } from "../requests/requestStatus";
import QuotationItems, { emptyLine } from "../requests/quotationItems";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EMPTY = {
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "+250",
    service: "",
    note: "",
};

const validateDetails = (v: any) => {
    const e: any = {};
    if (!v.firstName.trim()) e.firstName = "First name is required";
    if (!v.lastName.trim()) e.lastName = "Last name is required";
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email";
    if (!/^\+\d{8,15}$/.test(v.whatsapp.replace(/\s/g, ""))) e.whatsapp = "Use international format, e.g. +250788123456";
    if (!v.service) e.service = "Choose a service";
    if (v.note.length > 1000) e.note = "Max 1000 characters";
    return e;
};

const Field = ({ label, error, required, children, className, hint }: any) => (
    <div className={cn("space-y-1.5", className)}>
        <label className="block text-base font-medium text-gray-700">
            {label} {required && <span className="text-red-600">*</span>}
        </label>
        {children}
        {hint && !error && <p className="text-xs text-ink/70">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
);

const inputClass = (error?: string) =>
    cn(
        "h-10 w-full rounded-lg border-[.5px] bg-white px-3 text-sm outline-none focus:ring-1",
        error ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-primary/60",
    );

// Create: who + what (from the email / WhatsApp message)
// Edit:   + what we agreed on the call: required documents, amount or quotation
const RequestForm = ({
    request,
    prefill,
    onSubmit,
    onCancel,
    isLoading,
}: {
    request?: any;
    prefill?: any;
    onSubmit: (values: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}) => {
    const isEdit = !!request;
    const paid = isEdit && isPaid(request);

    const [values, setValues] = useState<any>(
        request
            ? {
                firstName: request.firstName ?? "",
                lastName: request.lastName ?? "",
                location: request.location ?? "",
                email: request.email ?? "",
                whatsapp: request.whatsapp ?? "+250",
                service: request.service ?? "",
                note: request.note ?? "",
            }
            : { ...EMPTY, ...(prefill ?? {}) },
    );

    // ----- Edit only: agreement with the customer -----
    const [requiredDocs, setRequiredDocs] = useState<string[]>(request?.requiredDocuments ?? []);
    const [docInput, setDocInput] = useState("");
    const [wantsQuotation, setWantsQuotation] = useState<boolean>(true);
    const [agreedAmount, setAgreedAmount] = useState<string>(request?.agreedAmount ? String(request.agreedAmount) : "");
    const [quotation, setQuotation] = useState<any>(
        request?.quotation ?? { items: [emptyLine(request?.service ?? "")], validUntil: inDays(14), note: "" },
    );

    const [errors, setErrors] = useState<any>({});
    const currency = request?.quotation?.currency ?? "RWF";

    const set = (key: string) => (e: any) => {
        setValues((v: any) => ({ ...v, [key]: e.target.value }));
        if (errors[key]) setErrors((er: any) => ({ ...er, [key]: undefined }));
    };

    const addDoc = () => {
        const name = docInput.trim();
        if (!name) return;
        if (!requiredDocs.some((d) => d.toLowerCase() === name.toLowerCase())) setRequiredDocs((l) => [...l, name]);
        setDocInput("");
    };

    const submit = (e: any) => {
        e.preventDefault();
        const found: any = validateDetails(values);

        let cleanItems: any[] = [];
        if (isEdit && !paid) {
            if (wantsQuotation) {
                cleanItems = (quotation.items ?? [])
                    .map((i: any) => ({ description: String(i.description).trim(), quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) }))
                    .filter((i: any) => i.description);
                if (!cleanItems.length || quotationTotal(cleanItems) <= 0) found.quotation = "Add at least one line with a price.";
                else if (cleanItems.some((i) => i.quantity < 1 || i.unitPrice < 0)) found.quotation = "Quantity must be at least 1 and prices can't be negative.";
            } else if (agreedAmount !== "" && !(Number(agreedAmount) >= 0)) {
                found.agreedAmount = "Enter a valid amount";
            }
        }

        setErrors(found);
        if (Object.keys(found).length) return;

        const details = {
            ...values,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim().toLowerCase(),
            whatsapp: values.whatsapp.replace(/\s/g, ""),
            note: values.note.trim(),
        };

        if (!isEdit) return onSubmit(details);

        onSubmit({
            ...details,
            requiredDocuments: requiredDocs,
            // money can't change after payment
            ...(paid
                ? {}
                : {
                    quotationRequested: wantsQuotation,
                    agreedAmount: wantsQuotation ? null : agreedAmount === "" ? null : Number(agreedAmount),
                    quotation: wantsQuotation
                        ? {
                            number: request.quotation?.number ?? request.reference.replace("REQ", "QT"),
                            currency,
                            items: cleanItems,
                            validUntil: quotation.validUntil,
                            note: String(quotation.note ?? "").trim(),
                            createdAt: request.quotation?.createdAt ?? new Date().toISOString(),
                        }
                        : null,
                }),
        });
    };

    const SERVICE_OPTIONS = [
        { value: "all", label: "All services" },
        ...SERVICES.map((s) => ({ value: s, label: s })),
    ];
    const itemClass =
        "cursor-pointer rounded-lg px-2.5 py-2 text-sm " +
        "focus:bg-primary/10 focus:text-primary data-highlighted:bg-primary/10 data-highlighted:text-primary " +
        "data-[state=checked]:font-medium data-[state=checked]:text-primary data-selected:font-medium data-selected:text-primary";

    return (
        <div className="px-8 p-4 "><form onSubmit={submit} className="space-y-6 p-5 sm:p-6" noValidate>
            <div className="pr-8">
                <h2 className="text-lg font-semibold text-gray-900">{isEdit ? "Edit request" : "New request"}</h2>
                <p className="text-base text-ink/70">
                    {isEdit
                        ? `${request.reference} · add what you agreed with the customer.`
                        : "Create a request."}
                </p>
            </div>

            {/* ---------- Customer & request ---------- */}
            <section className="space-y-4">
                {isEdit && <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer & request</h3>}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" required error={errors.firstName}>
                        <input value={values.firstName} onChange={set("firstName")} className={inputClass(errors.firstName)} autoComplete="given-name" />
                    </Field>
                    <Field label="Last name" required error={errors.lastName}>
                        <input value={values.lastName} onChange={set("lastName")} className={inputClass(errors.lastName)} autoComplete="family-name" />
                    </Field>
                    <Field label="Email" required error={errors.email}>
                        <input type="email" value={values.email} onChange={set("email")} className={inputClass(errors.email)} autoComplete="email" />
                    </Field>
                    <Field label="WhatsApp number" required error={errors.whatsapp}>
                        <input type="tel" value={values.whatsapp} onChange={set("whatsapp")} className={inputClass(errors.whatsapp)} placeholder="+250788123456" autoComplete="tel" />
                    </Field>
                    <Field label="Location" required error={errors.location}>
                        <input value={values.location} onChange={set("lastName")} className={inputClass(errors.lastName)} autoComplete="family-name" />
                    </Field>
                    <Field label="Select a service" required error={errors.service} className="">
                        <Select value={values.service} onValueChange={set("service")} items={SERVICE_OPTIONS}>
                            <SelectTrigger
                                aria-label="Filter by service"
                                className="h-10! w-full rounded-xl border-gray-200 bg-white px-3 text-sm shadow-none focus:ring-2 focus:ring-primary/30 data-[state=open]:border-primary data-popup-open:border-primary md:w-56"
                            >
                                <SelectValue placeholder="All services" />
                            </SelectTrigger>

                            <SelectContent className="max-h-72 rounded-xl border-gray-200 p-1 ">
                                {SERVICE_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value} className={itemClass}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Note or comments" error={errors.note} className="sm:col-span-2">
                        <textarea
                            value={values.note}
                            onChange={set("note")}
                            rows={3}
                            maxLength={1000}
                            placeholder="What the customer asked for, deadlines, details…"
                            className={cn(inputClass(errors.note), "h-auto resize-none py-2")} />
                        <p className="text-right text-xs text-gray-400">{values.note.length}/1000</p>
                    </Field>
                </div>
            </section>

            {/* ---------- After the call: documents + amount / quotation ---------- */}
            {isEdit && (
                <section className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Agreed with the customer</h3>
                        <p className="text-sm text-ink/70">What they need to bring and how much they will pay.</p>
                    </div>

                    {/* Required documents */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700">Required documents</label>
                        <div className="flex gap-2">
                            <input
                                value={docInput}
                                onChange={(e) => setDocInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addDoc();
                                    }
                                }}
                                placeholder="e.g. National ID copy"
                                className={inputClass()} />
                            <Button type="button" variant="outline" onClick={addDoc} className="shrink-0 gap-1">
                                <Plus className="h-4 w-4" /> Add
                            </Button>
                        </div>
                        {requiredDocs.length > 0 ? (
                            <ul className="flex flex-wrap gap-1.5">
                                {requiredDocs.map((d) => (
                                    <li key={d} className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs text-gray-700 ring-1 ring-gray-200">
                                        <FileText className="h-3 w-3 text-gray-400" /> {d}
                                        <button type="button" aria-label={`Remove ${d}`} onClick={() => setRequiredDocs((l) => l.filter((x) => x !== d))} className="text-gray-400 hover:text-red-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No documents listed yet.</p>
                        )}
                    </div>

                    {/* Amount / quotation */}
                    {paid ? (
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                            <Lock className="h-4 w-4" />
                            Paid {formatMoney(request.payment.amount, request.payment.currency)} — the amount and quotation can't be changed anymore.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Does the customer want a written quotation? */}
                            {/* <div className="space-y-1.5">
                                <span className="block text-sm font-medium text-gray-700">Does the customer need a quotation?</span>
                                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5" role="radiogroup">
                                    {[
                                        { v: false, label: "No, just the amount" },
                                        { v: true, label: "Yes, make a quotation" },
                                    ].map((o) => (
                                        <button
                                            key={String(o.v)}
                                            type="button"
                                            role="radio"
                                            aria-checked={wantsQuotation === o.v}
                                            onClick={() => setWantsQuotation(o.v)}
                                            className={cn(
                                                "rounded-md px-3 py-1.5 text-sm transition-colors",
                                                wantsQuotation === o.v ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100"
                                            )}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div> */}
                            <div className="mt-8 ">
                                <h3 className="block text-lg font-medium my-2">Make Quotation for the customer</h3>
                                {wantsQuotation ? (
                                    <>
                                        <QuotationItems value={quotation} onChange={setQuotation} currency={currency} />
                                        {errors.quotation && <p className="text-sm text-red-600">{errors.quotation}</p>}
                                    </>
                                ) : (
                                    <Field
                                        label={`Amount to pay (${currency})`}
                                        error={errors.agreedAmount}
                                        hint="The amount you told the customer. Leave empty if not decided yet — payment stays locked until it's set."
                                    >
                                        <input
                                            type="number"
                                            min={0}
                                            step={100}
                                            value={agreedAmount}
                                            onChange={(e) => setAgreedAmount(e.target.value)}
                                            placeholder="e.g. 25000"
                                            className={cn(inputClass(errors.agreedAmount), "sm:max-w-60")} />
                                    </Field>
                                )}</div>
                        </div>
                    )}
                </section>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEdit ? "Save changes" : "Create request"}
                </Button>
            </div>
        </form></div>
    );
};

export default RequestForm;