"use client";

import { useState } from "react";
import PhoneInputImport from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, selectClass } from "../setting-ui";
import {
  ROLE_OPTIONS,
  type AppUser,
  type UserFormValues,
  type UserRole,
  type UserStatus,
} from "@/hooks/useUsers";
import { useIsDev } from "@/hooks/useProfile";
import {
  userSchema,
  validate,
  type FieldErrors,
} from "@/components/shared/FormValidation";
import { cn } from "@/lib/utils";

const PhoneInput: any = (PhoneInputImport as any).default ?? PhoneInputImport;

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "deactivated", label: "Deactivated" },
];

const FieldError = ({ id, text }: { id?: string; text?: string }) =>
  text ? (
    <p id={id} role="alert" className="mt-1 text-xs text-destructive">
      {text}
    </p>
  ) : null;

const UserFormDialog = ({
  open,
  onOpenChange,
  user,
  onSave,
  isSaving = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AppUser | null;
  onSave: (data: UserFormValues) => void;
  isSaving?: boolean;
}) => (
  <AlertDialog open={open} onOpenChange={(o) => !isSaving && onOpenChange(o)}>
    <AlertDialogContent className="sm:max-w-2xl! p-4!">
      {open && (
        <UserForm
          key={user?.id ?? "new"}
          user={user}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
          isSaving={isSaving}
        />
      )}
    </AlertDialogContent>
  </AlertDialog>
);

const UserForm = ({
  user,
  onSave,
  onCancel,
  isSaving,
}: {
  user: AppUser | null;
  onSave: (data: UserFormValues) => void;
  onCancel: () => void;
  isSaving: boolean;
}) => {
  const isEdit = !!user;
  const isDev = useIsDev();

  const [values, setValues] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    role: (user?.role ?? "user") as UserRole,
    status: (user?.status ?? "active") as UserStatus,
  });
  const [phoneComplete, setPhoneComplete] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});

  const roleLocked = user?.role === "dev" && !isDev;
  const roles: { value: UserRole; label: string }[] =
    isDev || user?.role === "dev"
      ? [
          { value: "dev", label: "Dev" },
          ...ROLE_OPTIONS.filter((r) => r.value !== "dev"),
        ]
      : ROLE_OPTIONS;

  const set = <K extends keyof typeof values>(
    field: K,
    value: (typeof values)[K],
  ) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const submit = (e: React.FormEvent) => {
    console.log("role sent:", JSON.stringify(values.role));
    e.preventDefault();
    const result = validate(userSchema, values);
    const errs: FieldErrors = result.ok ? {} : { ...result.errors };

    if (values.phone.replace(/\D/g, "").length > 3 && !phoneComplete)
      errs.phone = "Enter the full phone number";

    if (Object.keys(errs).length) return setErrors(errs);
    onSave(result.data as UserFormValues);
  };

  const err = (field: string) =>
    errors[field]
      ? { "aria-invalid": true, "aria-describedby": `${field}Error` }
      : {};

  return (
    <form onSubmit={submit} noValidate>
      <AlertDialogHeader className="px-6 py-6 text-left">
        <AlertDialogTitle>
          {isEdit ? "Edit user" : "Create user"}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {isEdit
            ? "Update this user's details and access."
            : "Add a team member. They'll get an email to set their password."}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <fieldset
        disabled={isSaving}
        className="grid gap-4 px-6 py-5 sm:grid-cols-2"
      >
        <Field label="First name" htmlFor="firstName">
          <Input
            id="firstName"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            maxLength={75}
            autoComplete="given-name"
            {...err("firstName")}
          />
          <FieldError id="firstNameError" text={errors.firstName} />
        </Field>

        <Field label="Last name" htmlFor="lastName">
          <Input
            id="lastName"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            maxLength={75}
            autoComplete="family-name"
            {...err("lastName")}
          />
          <FieldError id="lastNameError" text={errors.lastName} />
        </Field>

        <Field label="Email" htmlFor="userEmail" className="sm:col-span-2">
          <Input
            id="userEmail"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            maxLength={160}
            autoComplete="email"
            placeholder="name@company.rw"
            {...err("email")}
          />
          <FieldError id="emailError" text={errors.email} />
          {isEdit &&
            values.email.trim().toLowerCase() !== user.email.toLowerCase() && (
              <p className="mt-1 text-xs text-ink/50">
                They'll sign in with the new email.
              </p>
            )}
        </Field>

        <Field label="Phone number" htmlFor="userPhone">
          <PhoneInput
            country="rw"
            preferredCountries={[
              "rw",
              "ug",
              "ke",
              "tz",
              "bi",
              "cd",
              "us",
              "gb",
              "ca",
              "be",
              "fr",
            ]}
            value={values.phone}
            onChange={(value: string, country: any) => {
              set("phone", value ? `+${value}` : "");
              const local =
                value.length - String(country?.dialCode ?? "").length;
              setPhoneComplete(local >= 7);
            }}
            enableSearch
            searchPlaceholder="Search country"
            countryCodeEditable={false}
            disabled={isSaving}
            inputProps={{
              id: "userPhone",
              name: "phone",
              autoComplete: "tel",
              "aria-invalid": !!errors.phone || undefined,
            }}
            containerStyle={{ width: "100%" }}
            inputStyle={{
              width: "100%",
              height: "40px",
              borderRadius: "12px",
              //   borderColor: errors.phone ? "rgb(220 38 38)" : "rgb(197 208 224 / 0.6)",
              fontSize: "14px",
              paddingLeft: "52px",
            }}
            buttonStyle={{ borderRadius: "12px 0 0 12px", background: "white" }}
            dropdownStyle={{ borderRadius: "12px" }}
          />
          <FieldError id="phoneError" text={errors.phone} />
        </Field>

        <Field label="Role" htmlFor="role">
          <Select
            items={roles}
            value={values.role}
            onValueChange={(v: any) => v && set("role", v as UserRole)}
            disabled={roleLocked || isSaving}
          >
            <SelectTrigger
              id="role"
              className={cn(selectClass, errors.role)}
              aria-invalid={!!errors.role || undefined}
            >
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError id="roleError" text={errors.role} />
          {roleLocked && (
            <p className="mt-1 text-xs text-ink/50">
              Only a dev can change a dev account.
            </p>
          )}
          {!roleLocked && values.role === "dev" && (
            <p className="mt-1 text-xs text-ink/50">Dev has access.</p>
          )}
        </Field>

        {isEdit && (
          <Field label="Status" htmlFor="status" className="sm:col-span-2">
            <Select
              items={STATUS_OPTIONS}
              value={values.status}
              onValueChange={(v: any) => v && set("status", v as UserStatus)}
              disabled={roleLocked || isSaving}
            >
              <SelectTrigger id="status" className={selectClass}>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {values.status === "deactivated" &&
              user.status !== "deactivated" && (
                <p className="mt-1 text-xs text-ink/50">
                  They'll be signed out right away and can't sign in until
                  activated again.
                </p>
              )}
          </Field>
        )}
      </fieldset>

      <AlertDialogFooter className="gap-2 px-6 pb-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-title text-white hover:bg-title/90"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : isEdit ? "Save changes" : "Create user"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};
export default UserFormDialog;
