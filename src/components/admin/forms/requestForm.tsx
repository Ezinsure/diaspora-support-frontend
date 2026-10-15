"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { SERVICES } from "../requests/requestStatus";

const EMPTY = {
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "+250",
    service: "",
    note: "",
    quotationRequested: false,
};

const validate = (v: any) => {
    const e: any = {};
    if (!v.firstName.trim()) e.firstName = "First name is required";
    if (!v.lastName.trim()) e.lastName = "Last name is required";
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email";
    if (!/^\+\d{8,15}$/.test(v.whatsapp.replace(/\s/g, ""))) e.whatsapp = "Use international format, e.g. +250788123456";
    if (!v.service) e.service = "Choose a service";
    if (v.note.length > 1000) e.note = "Max 1000 characters";
    return e;
};

const Field = ({ label, error, required, children, className }: any) => (
    <div className={cn("space-y-1.5", className)}>
        <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-600">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
);

const inputClass = (error?: string) =>
    cn(
        "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:ring-2",
        error ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-primary/30",
    );

// request: pass one to edit, leave empty to create
// prefill: start a new request with known customer details
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
    const [values, setValues] = useState<any>(
        request
            ? {
                firstName: request.firstName ?? "",
                lastName: request.lastName ?? "",
                email: request.email ?? "",
                whatsapp: request.whatsapp ?? "+250",
                service: request.service ?? "",
                note: request.note ?? "",
                quotationRequested: !!request.quotationRequested,
            }
            : { ...EMPTY, ...(prefill ?? {}) },
    );
    const [errors, setErrors] = useState<any>({});

    const set = (key: string) => (e: any) => {
        setValues((v: any) => ({ ...v, [key]: e.target.value }));
        if (errors[key]) setErrors((er: any) => ({ ...er, [key]: undefined }));
    };

    const submit = (e: any) => {
        e.preventDefault();
        const found = validate(values);
        setErrors(found);
        if (Object.keys(found).length) return;
        onSubmit({
            ...values,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim().toLowerCase(),
            whatsapp: values.whatsapp.replace(/\s/g, ""),
            note: values.note.trim(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-5 p-5 sm:p-6" noValidate>
            <div>
                <h2 className="text-lg font-semibold text-gray-900">{isEdit ? "Edit request" : "New request"}</h2>
                <p className="text-sm text-gray-500">
                    {isEdit
                        ? `Reference ${request.reference}. You can edit while it is pending or needs a quotation.`
                        : "Tell us who you are and what you need. We'll reply on WhatsApp."}
                </p>
            </div>

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
                <Field label="Service requested" required error={errors.service} className="sm:col-span-2">
                    <select value={values.service} onChange={set("service")} className={inputClass(errors.service)}>
                        <option value="" disabled>Choose a service</option>
                        {SERVICES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Note or comments" error={errors.note} className="sm:col-span-2">
                    <textarea
                        value={values.note}
                        onChange={set("note")}
                        rows={4}
                        maxLength={1000}
                        placeholder="Anything we should know? Deadlines, details…"
                        className={cn(inputClass(errors.note), "h-auto resize-none py-2")}
                    />
                    <p className="text-right text-xs text-gray-400">{values.note.length}/1000</p>
                </Field>

                {/* Optional: only customers who want a written price */}
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-3 hover:bg-gray-50 sm:col-span-2">
                    <input
                        type="checkbox"
                        checked={values.quotationRequested}
                        onChange={(e) => setValues((v: any) => ({ ...v, quotationRequested: e.target.checked }))}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[var(--primary)]"
                    />
                    <span>
                        <span className="block text-sm font-medium text-gray-900">I need a quotation</span>
                        <span className="block text-xs text-gray-500">
                            We'll send a written price before you pay. Leave it unticked and we'll tell you the price on WhatsApp.
                        </span>
                    </span>
                </label>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEdit ? "Save changes" : "Submit request"}
                </Button>
            </div>
        </form>
    );
};

export default RequestForm;