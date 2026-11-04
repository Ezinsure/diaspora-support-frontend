"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, FormAlert, PasswordInput } from "@/components/auth/passwdInput";
import { loginSchema, validate, type FieldErrors } from "@/components/shared/FormValidation";
import { getErrorMessage, refreshAccessToken } from "@/lib/admin/httpRequest";
import { safeNext, useLogin } from "@/hooks/useAuth";

const LoginForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const login = useLogin();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  const reason = params.get("reason");
  const notice =
    reason === "expired" ? "Your session ended. Please sign in again." : reason === "password-set" ? "Your password is set. Sign in to continue." : "";

  useEffect(() => {
    if (reason) return;
    let cancelled = false;
    refreshAccessToken().then((token) => {
      if (token && !cancelled) router.replace(next);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clear = (field: string) => {
    if (errors[field]) setErrors((x) => ({ ...x, [field]: "" }));
    if (formError) setFormError("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate(loginSchema, { email, password, rememberMe });
    if (!result.ok) return setErrors(result.errors);

    login.mutate(result.data, {
      onSuccess: () => router.replace(next),
      onError: (err: any) => {
        setFormError(getErrorMessage(err, "Couldn't sign in. Please try again."));
        setPassword(""); // never keep a wrong password in the field
      },
    });
  };

  const busy = login.isPending || login.isSuccess;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {formError ? <FormAlert>{formError}</FormAlert> : notice ? <FormAlert tone="success">{notice}</FormAlert> : null}

      <fieldset disabled={busy} className="space-y-5">
        <div>
          <label htmlFor="loginEmail" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <Input
            id="loginEmail"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoFocus
            placeholder="you@company.rw"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clear("email");
            }}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? "loginEmailError" : undefined}
            maxLength={160}
            className="bg-white"
          />
          <FieldError id="loginEmailError" text={errors.email} />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="loginPassword" className="text-sm font-medium text-ink">
              Password
            </label>
            <Link
              href={`/forgot-password${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`}
              className="text-sm font-medium text-title underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="loginPassword"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clear("password");
            }}
            invalid={!!errors.password}
            aria-describedby={errors.password ? "loginPasswordError" : undefined}
            maxLength={128}
          />
          <FieldError id="loginPasswordError" text={errors.password} />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded" />
          Keep me signed in for 30 days
        </label>
      </fieldset>

      <Button type="submit" disabled={busy} className="h-11 w-full rounded-xl bg-title text-white hover:bg-title/90">
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};
export default LoginForm;
