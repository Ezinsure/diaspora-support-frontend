"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, FormAlert } from "@/components/auth/passwdInput";
import { forgotPasswordSchema, validate, type FieldErrors } from "@/components/shared/FormValidation";
import { getErrorMessage } from "@/lib/admin/httpRequest";
import { useForgotPassword } from "@/hooks/useAuth";

const ForgotPasswordForm = () => {
  const params = useSearchParams();
  const forgot = useForgotPassword();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [sentTo, setSentTo] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate(forgotPasswordSchema, { email });
    if (!result.ok) return setErrors(result.errors);

    setFormError("");
    forgot.mutate(result.data.email, {
      onSuccess: () => setSentTo(result.data.email),
      onError: (err) => setFormError(getErrorMessage(err)),
    });
  };

  // Same screen whether the account exists or not (the API doesn't tell)
  if (sentTo) {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <MailCheck className="h-6 w-6" />
        </span>
        <div>
          <p className="font-medium text-ink">Check your email</p>
          <p className="mt-1.5 text-sm text-ink/60">
            If an account exists for <span className="font-medium text-ink">{sentTo}</span>, you'll get a link to reset your password. It works
            for 60 minutes. Look in spam too.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/login?email=${encodeURIComponent(sentTo)}`}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-title text-sm font-medium text-white hover:bg-title/90"
          >
            Back to sign in
          </Link>
          <Button
            type="button"
            variant="ghost"
            className="text-sm"
            onClick={() => {
              setSentTo("");
              forgot.reset();
            }}
          >
            Use another email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {formError && <FormAlert>{formError}</FormAlert>}

      <div>
        <label htmlFor="forgotEmail" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <Input
          id="forgotEmail"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          placeholder="you@company.rw"
          value={email}
          disabled={forgot.isPending}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({});
          }}
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? "forgotEmailError" : undefined}
          maxLength={160}
          className="bg-white"
        />
        <FieldError id="forgotEmailError" text={errors.email} />
      </div>

      <Button type="submit" disabled={forgot.isPending} className="h-11 w-full rounded-xl bg-title text-white hover:bg-title/90">
        {forgot.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm font-medium text-title underline-offset-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </form>
  );
};

export default ForgotPasswordForm;
