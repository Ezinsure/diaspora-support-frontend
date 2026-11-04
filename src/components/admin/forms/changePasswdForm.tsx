"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FieldError, FormAlert, PasswordInput, PasswordStrength } from "@/components/auth/passwdInput";
import { changePasswordSchema, validate, type FieldErrors } from "@/components/shared/FormValidation";
import { getErrorMessage } from "@/lib/admin/httpRequest";
import { useChangePassword } from "@/hooks/useAuth";

/**
 * "Change password" for the signed-in user (profile menu).
 * After saving, every session ends (this one too) -> sign in again.
 */
const ChangePasswordDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const change = useChangePassword();
  return (
    <AlertDialog open={open} onOpenChange={(o) => !change.isPending && onOpenChange(o)}>
      <AlertDialogContent className="sm:max-w-md">{open && <ChangePasswordForm onCancel={() => onOpenChange(false)} change={change} />}</AlertDialogContent>
    </AlertDialog>
  );
};

const ChangePasswordForm = ({ onCancel, change }: { onCancel: () => void; change: ReturnType<typeof useChangePassword> }) => {
  const [values, setValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  const set = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((x) => ({ ...x, [field]: "" }));
    if (formError) setFormError("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate(changePasswordSchema, values);
    if (!result.ok) return setErrors(result.errors);

    change.mutate(
      { currentPassword: result.data.currentPassword, newPassword: result.data.newPassword },
      { onError: (err) => setFormError(getErrorMessage(err)) },
    );
  };

  const busy = change.isPending || change.isSuccess;

  return (
    <form onSubmit={submit} noValidate>
      <AlertDialogHeader className="text-left">
        <AlertDialogTitle>Change password</AlertDialogTitle>
        <AlertDialogDescription>You'll be signed out of all devices and sign in again with the new password.</AlertDialogDescription>
      </AlertDialogHeader>

      <fieldset disabled={busy} className="grid gap-4 py-5">
        {formError && <FormAlert>{formError}</FormAlert>}

        <div>
          <label htmlFor="cpCurrent" className="mb-1.5 block text-sm font-medium text-ink">
            Current password
          </label>
          <PasswordInput id="cpCurrent" autoComplete="current-password" value={values.currentPassword} onChange={set("currentPassword")} invalid={!!errors.currentPassword} maxLength={128} />
          <FieldError text={errors.currentPassword} />
        </div>

        <div>
          <label htmlFor="cpNew" className="mb-1.5 block text-sm font-medium text-ink">
            New password
          </label>
          <PasswordInput id="cpNew" autoComplete="new-password" value={values.newPassword} onChange={set("newPassword")} invalid={!!errors.newPassword} maxLength={128} />
          <FieldError text={errors.newPassword} />
          <PasswordStrength password={values.newPassword} />
        </div>

        <div>
          <label htmlFor="cpConfirm" className="mb-1.5 block text-sm font-medium text-ink">
            Confirm new password
          </label>
          <PasswordInput id="cpConfirm" autoComplete="new-password" value={values.confirmPassword} onChange={set("confirmPassword")} invalid={!!errors.confirmPassword} maxLength={128} />
          <FieldError text={errors.confirmPassword} />
        </div>
      </fieldset>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90" disabled={busy}>
          {busy ? "Saving..." : "Change password"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};

export default ChangePasswordDialog;
