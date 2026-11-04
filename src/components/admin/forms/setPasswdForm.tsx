"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Link2Off, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, FormAlert, PasswordInput, PasswordStrength } from "@/components/auth/passwdInput";
import { setPasswordSchema, validate, type FieldErrors } from "@/components/shared/FormValidation";
import { getErrorMessage } from "@/lib/admin/httpRequest";
import { usePasswordToken, useResetPassword } from "@/hooks/useAuth";

const buttonClass = "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-title text-sm font-medium text-white hover:bg-title/90";

/**
 * /set-password?token=...
 * Same page for both emails:
 *  - invitation (new user, 48 h)  -> "Welcome, choose your password"
 *  - reset (forgot password, 60 min)
 */
const SetPasswordForm = () => {
  const token = useSearchParams().get("token");
  const check = usePasswordToken(token);
  const reset = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [doneEmail, setDoneEmail] = useState<string | null>(null);

  // ---------- States ----------

  if (!token || check.isError || (check.data && !check.data.valid)) {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Link2Off className="h-6 w-6" />
        </span>
        <div>
          <p className="font-medium text-ink">This link can't be used</p>
          <p className="mt-1.5 text-sm text-ink/60">
            {check.error ? getErrorMessage(check.error, "The link is invalid or has expired.") : "The link is incomplete."} Links work once, and only the
            newest link sent to you is valid.
          </p>
        </div>
        <Link href="/forgot-password" className={buttonClass}>
          Request a new link
        </Link>
        <Link href="/login" className="block text-sm font-medium text-title underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  if (check.isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-sm text-ink/60">
        <Loader2 className="h-6 w-6 animate-spin text-title" /> Checking your link…
      </div>
    );
  }

  if (doneEmail !== null) {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <p className="font-medium text-ink">Your password is set</p>
          <p className="mt-1.5 text-sm text-ink/60">You can now sign in with your email and new password.</p>
        </div>
        <Link href={`/login?reason=password-set${doneEmail ? `&email=${encodeURIComponent(doneEmail)}` : ""}`} className={buttonClass}>
          Sign in
        </Link>
      </div>
    );
  }

  // ---------- Form ----------

  const info = check.data!;
  const isInvite = info.type === "invite";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate(setPasswordSchema, { password, confirmPassword });
    if (!result.ok) return setErrors(result.errors);

    setFormError("");
    reset.mutate(
      { token, password: result.data.password },
      {
        onSuccess: (data) => setDoneEmail(data?.email ?? ""),
        onError: (err) => setFormError(getErrorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormAlert tone="info">
        {isInvite ? (
          <>
            Welcome{info.firstName ? `, ${info.firstName}` : ""}! Choose a password for <span className="font-medium">{info.email}</span>.
          </>
        ) : (
          <>
            Choose a new password for <span className="font-medium">{info.email}</span>. You'll be signed out of other devices.
          </>
        )}
      </FormAlert>

      {formError && <FormAlert>{formError}</FormAlert>}

      <fieldset disabled={reset.isPending} className="space-y-5">
        <div>
          <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-ink">
            {isInvite ? "Password" : "New password"}
          </label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((x) => ({ ...x, password: "" }));
            }}
            invalid={!!errors.password}
            aria-describedby={errors.password ? "newPasswordError" : undefined}
            maxLength={128}
          />
          <FieldError id="newPasswordError" text={errors.password} />
          <PasswordStrength password={password} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink">
            Confirm password
          </label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((x) => ({ ...x, confirmPassword: "" }));
            }}
            invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPasswordError" : undefined}
            maxLength={128}
          />
          <FieldError id="confirmPasswordError" text={errors.confirmPassword} />
        </div>
      </fieldset>

      <Button type="submit" disabled={reset.isPending} className="h-11 w-full rounded-xl bg-title text-white hover:bg-title/90">
        {reset.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
          </>
        ) : isInvite ? (
          "Set password"
        ) : (
          "Reset password"
        )}
      </Button>

      <p className="text-center text-xs text-ink/50">
        Link valid until {new Date(info.expiresAt).toLocaleString("en-GB", { timeZone: "Africa/Kigali", dateStyle: "medium", timeStyle: "short" })}
      </p>
    </form>
  );
};

export default SetPasswordForm;
