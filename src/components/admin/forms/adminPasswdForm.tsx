"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FieldError, PasswordInput, PasswordStrength } from "@/components/auth/passwdInput";
import { adminPasswordSchema, validate, type FieldErrors } from "@/components/shared/FormValidation";
import { useAdminSetPassword, useSendPasswordLink } from "@/hooks/useAuth";

type Target = { id: string; names?: string; firstName?: string; lastName?: string; email: string; passwordSetAt?: string | null };

const AdminPasswordDialog = ({ user, onOpenChange }: { user: Target | null; onOpenChange: (open: boolean) => void }) => {
  const setPassword = useAdminSetPassword();
  const sendLink = useSendPasswordLink();
  const busy = setPassword.isPending || sendLink.isPending;

  return (
    <AlertDialog open={!!user} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <AlertDialogContent className="sm:max-w-2xl! p-8" >
        {user && (
          <AdminPasswordForm
            key={user.id}
            user={user}
            onCancel={() => onOpenChange(false)}
            onSendLink={() => sendLink.mutate(user.id, { onSuccess: () => onOpenChange(false) })}
            onSave={(password, notifyUser) => setPassword.mutate({ userId: user.id, password, notifyUser }, { onSuccess: () => onOpenChange(false) })}
            sending={sendLink.isPending}
            saving={setPassword.isPending}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AdminPasswordForm = ({
  user,
  onCancel,
  onSendLink,
  onSave,
  sending,
  saving,
}: {
  user: Target;
  onCancel: () => void;
  onSendLink: () => void;
  onSave: (password: string, notifyUser: boolean) => void;
  sending: boolean;
  saving: boolean;
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});

  const name = user.names || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email;
  const pending = !user.passwordSetAt;
  const busy = sending || saving;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate(adminPasswordSchema, { password, confirmPassword, notifyUser });
    if (!result.ok) return setErrors(result.errors);
    onSave(result.data.password, result.data.notifyUser);
  };

  return (
    <form onSubmit={submit} noValidate>
      <AlertDialogHeader className="text-left">
        <AlertDialogTitle>Update password</AlertDialogTitle>
        <AlertDialogDescription>
          For <span className="font-medium text-ink">{name}</span> ({user.email}).
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="grid gap-4 py-5">
        {/* Option 1: link by email */}
        <div className="rounded-xl border border-navy-300/50 bg-navy-50/50 p-3.5">
          <p className="text-base font-medium text-ink">{pending ? "Resend the invitation" : "Send a reset link"}</p>
          <p className="mt-0.5 text-sm text-ink/80">
            {pending
              ? "They haven't set a password yet. They'll get a new invitation (valid 48 hours)."
              : "They choose their own password. The link works once, for 60 minutes."}
          </p>
          <Button type="button" variant="outline" size="lg" className="mt-3 bg-white" onClick={onSendLink} disabled={busy}>
            <Mail className="h-4 w-4" /> {sending ? "Sending..." : pending ? "Resend invitation" : "Email reset link"}
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm text-ink/60">
          <span className="h-px flex-1 bg-navy-300/50" /> or set it yourself <span className="h-px flex-1 bg-navy-300/50" />
        </div>

        {/* Option 2: set it directly */}
        <fieldset disabled={busy} className="grid gap-4">
          <div>
            <label htmlFor="apPassword" className="mb-1.5 block text-sm font-medium text-ink">
              New password
            </label>
            <PasswordInput
              id="apPassword"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((x) => ({ ...x, password: "" }));
              }}
              invalid={!!errors.password}
              maxLength={128}
            />
            <FieldError text={errors.password} />
            <PasswordStrength password={password} />
          </div>

          <div>
            <label htmlFor="apConfirm" className="mb-1.5 block text-sm font-medium text-ink">
              Confirm password
            </label>
            <PasswordInput
              id="apConfirm"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((x) => ({ ...x, confirmPassword: "" }));
              }}
              invalid={!!errors.confirmPassword}
              maxLength={128}
            />
            <FieldError text={errors.confirmPassword} />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-300/50 p-3 hover:bg-navy-50/50">
            <input type="checkbox" checked={notifyUser} onChange={(e) => setNotifyUser(e.target.checked)} className="mt-0.5 h-4 w-4" />
            <span>
              <span className="block text-sm font-medium text-ink">Email the user that their password changed</span>
            </span>
          </label>
        </fieldset>
      </div>

      <AlertDialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" className="bg-title text-white hover:bg-title/90" disabled={busy}>
          {saving ? "Saving..." : "Set password"}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};
export default AdminPasswordDialog;
