"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, Plus, UserCheck, X } from "lucide-react";
import { useCustomerLookup, useDebouncedValue, type CustomerRow } from "@/hooks/useCustomer";
import { Button } from "@/components/ui/button";
import { cn } from "../../../../lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServices } from "@/hooks/useService";
import type { RequestFormValues } from "@/hooks/useAdminRequest";
import { requestSchema, validate } from "@/components/shared/FormValidation";

const EMPTY: RequestFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "+250",
    location: "",
    serviceId: "",
    note: "",
    notifyCustomer: true,
};

const validateDetails = (v: RequestFormValues) => {
    const result = validate(requestSchema, {
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        phone: v.whatsapp,
        serviceId: v.serviceId,
        country: v.location,
        timezone: "",
        description: v.note,
    });
    if (result.ok) return {};
    const { phone, country, description, ...rest } = result.errors;
    const e: any = { ...rest };
    if (phone) e.whatsapp = phone;
    if (country) e.location = country;
    if (description) e.note = description;
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
    const [values, setValues] = useState<RequestFormValues>(
        request
            ? {
                firstName: request.customer?.firstName ?? "",
                lastName: request.customer?.lastName ?? "",
                email: request.customer?.email ?? "",
                whatsapp: request.customer?.phone ?? "+250",
                location: request.customer?.country ?? "",
                serviceId: request.serviceId ?? "",
                note: request.description ?? "",
            }
            : { ...EMPTY, ...(prefill ?? {}) },
    );

    const { data: servicesData, isLoading: loadingServices } = useServices({ limit: 100 });
    const serviceOptions = (servicesData?.services ?? [])
        .filter((s: any) => s.isActive !== false || s.id === values.serviceId)
        .map((s: any) => ({ value: s.id as string, label: s.name as string }));

    // ----- Edit only
    const [requiredDocs, setRequiredDocs] = useState<string[]>(request?.requiredDocuments ?? []);
    const [docInput, setDocInput] = useState("");
    const [errors, setErrors] = useState<any>({});

    const setValue = (key: keyof RequestFormValues, value: any) => {
        setValues((v) => ({ ...v, [key]: value }));
        if (errors[key]) setErrors((er: any) => ({ ...er, [key]: undefined }));
    };
    const set = (key: keyof RequestFormValues) => (e: any) => setValue(key, e.target.value);

    // ----- Create only: returning customer -----
    const [linked, setLinked] = useState<CustomerRow | null>(null);
    const [suggestOpen, setSuggestOpen] = useState(false);
    const lookupTerm = useDebouncedValue(values.email, 300);
    const { data: matches = [], isFetching: searching } = useCustomerLookup(lookupTerm, !isEdit && !prefill);

    const fillFromCustomer = (c: CustomerRow) => {
        setValues((v) => ({
            ...v,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            whatsapp: c.phone || v.whatsapp,
            location: c.country ?? "",
        }));
        setErrors((er: any) => ({ ...er, firstName: undefined, lastName: undefined, email: undefined, whatsapp: undefined, location: undefined }));
        setLinked(c);
        setSuggestOpen(false);
    };

    // Not this customer
    const unlinkCustomer = () => {
        setValues((v) => ({ ...v, firstName: "", lastName: "", whatsapp: "+250", location: "" }));
        setLinked(null);
    };

    // Exact email match 
    useEffect(() => {
        if (isEdit || prefill) return;
        const typed = lookupTerm.trim().toLowerCase();
        const exact = matches.find((c) => c.email.toLowerCase() === typed);
        if (exact && linked?.id !== exact.id) fillFromCustomer(exact);
        if (linked && linked.email.toLowerCase() !== values.email.trim().toLowerCase()) setLinked(null); // email changed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matches, lookupTerm]);

    const suggestions = matches.filter((c) => c.id !== linked?.id);

    const addDoc = () => {
        const name = docInput.trim();
        if (!name) return;
        if (!requiredDocs.some((d) => d.toLowerCase() === name.toLowerCase())) setRequiredDocs((l) => [...l, name]);
        setDocInput("");
    };

    const submit = (e: any) => {
        e.preventDefault();
        const found: any = validateDetails(values);
        setErrors(found);
        if (Object.keys(found).length) return;

        const details: RequestFormValues = {
            ...values,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim().toLowerCase(),
            whatsapp: values.whatsapp.replace(/[\s()-]/g, ""),
            location: values.location.trim(),
            note: values.note.trim(),
        };

        if (!isEdit) return onSubmit(details);
        onSubmit({ ...details, requiredDocuments: requiredDocs });
    };
    

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

            {/* Customer & request*/}
            <section className="space-y-4">
                {isEdit && <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer & request</h3>}
                {!isEdit && linked && (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm">
                        <UserCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                        <p className="min-w-0 flex-1 text-emerald-900">
                            Returning customer: <span className="font-semibold">{linked.name}</span>
                            <span className="text-emerald-800/80">
                                {" "}· {linked.total} {linked.total === 1 ? "request" : "requests"}
                                {linked.open > 0 && ` (${linked.open} open)`}
                            </span>
                            <span className="block text-xs text-emerald-800/70">Details filled in. Changes you make here also update their profile.</span>
                        </p>
                        <button type="button" onClick={unlinkCustomer} className="text-xs font-medium text-emerald-800 underline-offset-4 hover:underline">
                            Not them? Clear
                        </button>
                    </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" required error={errors.firstName}>
                        <input value={values.firstName} onChange={set("firstName")} className={inputClass(errors.firstName)} autoComplete="given-name" />
                    </Field>
                    <Field label="Last name" required error={errors.lastName}>
                        <input value={values.lastName} onChange={set("lastName")} className={inputClass(errors.lastName)} autoComplete="family-name" />
                    </Field>
                    <Field
                        label="Email"
                        required
                        error={errors.email}
                        hint={!isEdit && !prefill && !linked ? "Returning customer? Type their email or name to fill in their details." : undefined}
                    >
                        <div className="relative">
                            <input
                                type="email"
                                value={values.email}
                                onChange={(e) => {
                                    set("email")(e);
                                    setSuggestOpen(true);
                                }}
                                onFocus={() => setSuggestOpen(true)}
                                onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                                className={cn(inputClass(errors.email), "pr-9")}
                                autoComplete="off"
                                role="combobox"
                                aria-expanded={suggestOpen && suggestions.length > 0}
                                aria-controls="customer-suggestions"
                            />
                            {searching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />}

                            {!isEdit && !prefill && suggestOpen && suggestions.length > 0 && (
                                <ul
                                    id="customer-suggestions"
                                    role="listbox"
                                    className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
                                >
                                    <li className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Existing customers</li>
                                    {suggestions.map((c) => (
                                        <li key={c.id} role="option" aria-selected={false}>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => fillFromCustomer(c)}
                                                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-primary/5"
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                    {(c.firstName[0] ?? "") + (c.lastName[0] ?? "")}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-medium text-gray-900">{c.name}</span>
                                                    <span className="block truncate text-xs text-gray-500">
                                                        {c.email} · {c.phone}
                                                    </span>
                                                </span>
                                                <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
                                                    {c.total} {c.total === 1 ? "request" : "requests"}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Field>
                    <Field label="WhatsApp number" required error={errors.whatsapp}>
                        <input type="tel" value={values.whatsapp} onChange={set("whatsapp")} className={inputClass(errors.whatsapp)} placeholder="+250788123456" autoComplete="tel" />
                    </Field>
                    <Field label="Country" error={errors.location} hint="Where the customer lives">
                        <input value={values.location} onChange={set("location")} className={inputClass(errors.location)} autoComplete="country-name" maxLength={100} />
                    </Field>
                    <Field label="Service" required error={errors.serviceId}>
                        <Select items={serviceOptions} value={values.serviceId || null} onValueChange={(v: any) => setValue("serviceId", v ? String(v) : "")}>
                            <SelectTrigger
                                aria-label="Service"
                                className={cn(
                                    "h-10! w-full rounded-xl bg-white px-3 text-sm shadow-none focus:ring-2 focus:ring-primary/30 data-[state=open]:border-primary data-popup-open:border-primary",
                                    errors.serviceId ? "border-red-300" : "border-gray-200",
                                )}
                            >
                                <SelectValue placeholder={loadingServices ? "Loading services…" : "Choose a service"} />
                            </SelectTrigger>

                            <SelectContent className="max-h-72 rounded-xl border-gray-200 p-1 ">
                                {serviceOptions.length === 0 ? (
                                    <p className="px-3 py-2 text-sm text-gray-500">{loadingServices ? "Loading…" : "No services yet. Create one in Settings."}</p>
                                ) : (
                                    serviceOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value} className={itemClass}>
                                            {o.label}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="What the customer needs" required error={errors.note} className="sm:col-span-2">
                        <textarea
                            value={values.note}
                            onChange={set("note")}
                            rows={3}
                            maxLength={2000}
                            placeholder="What the customer asked for, deadlines, details…"
                            className={cn(inputClass(errors.note), "h-auto resize-none py-2")} />
                        <p className="text-right text-xs text-gray-400">{values.note.length}/2000</p>
                    </Field>
                    {!isEdit && (
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-3 hover:bg-gray-50 sm:col-span-2">
                            <input
                                type="checkbox"
                                checked={values.notifyCustomer !== false}
                                onChange={(e) => setValue("notifyCustomer", e.target.checked)}
                                className="mt-0.5 h-4 w-4"
                            />
                            <span>
                                <span className="block text-sm font-medium text-gray-800">Email the customer</span>
                                <span className="block text-xs text-ink/60">They get a thank-you email with their request number and status, and a link to follow it.</span>
                            </span>
                        </label>
                    )}
                </div>
            </section>

            {/* ---------- After the call: documents + amount / quotation ---------- */}
            {isEdit && (
                <section className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Agreed with the customer</h3>
                             <p className="text-sm text-ink/70">What they need to bring. The price goes on the quotation (Make quotation on the request card).</p>
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
