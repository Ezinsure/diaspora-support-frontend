"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { passwordStrength } from "@/components/shared/FormValidation";

// Password field with a show / hide button
export const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          aria-invalid={invalid || undefined}
          className={cn("bg-white pr-11", invalid && "border-destructive focus-visible:ring-destructive/30", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 flex h-8 w-9 -translate-y-1/2 items-center justify-center rounded-md text-ink/45 hover:bg-navy-50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-300"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

const BAR = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];

// 4 bars + checklist under a NEW password
export const PasswordStrength = ({ password }: { password: string }) => {
  const { score, label } = passwordStrength(password);
  const rules = [
    { ok: password.length >= 8, text: "At least 8 characters" },
    { ok: /[a-zA-Z]/.test(password) && /\d/.test(password), text: "A letter and a number" },
  ];

  return (
    <div className="mt-2 space-y-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="grid flex-1 grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={cn("h-[0.5px] rounded-full transition-colors", password && score >= i ? BAR[score] : "bg-navy-300/40")} />
          ))}
        </div>
        <span className="w-16 text-right text-xs text-ink/55">{password ? label : ""}</span>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {rules.map((r) => (
          <li key={r.text} className={cn("flex items-center gap-1.5", r.ok ? "text-emerald-600" : "text-ink/50")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", r.ok ? "bg-emerald-500" : "bg-ink/25")} />
            {r.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FieldError = ({ id, text }: { id?: string; text?: string }) =>
  text ? (
    <p id={id} role="alert" className="mt-1.5 text-xs text-destructive">
      {text}
    </p>
  ) : null;

// Error / info box at the top of a form
export const FormAlert = ({ tone = "error", children }: { tone?: "error" | "success" | "info"; children: React.ReactNode }) => (
  <div
    role={tone === "error" ? "alert" : "status"}
    className={cn(
      "rounded-xl border px-3.5 py-3 text-sm",
      tone === "error" && "border-destructive/30 bg-destructive/5 text-destructive",
      tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
      tone === "info" && "border-navy-300/50 bg-navy-50 text-ink/80",
    )}
  >
    {children}
  </div>
);
