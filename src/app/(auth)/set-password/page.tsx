import { Suspense } from "react";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/authShell";
import SetPasswordForm from "@/components/admin/forms/setPasswdForm";

// no-referrer: the ?token=... in the URL is never sent to other sites
export const metadata: Metadata = { title: "Set your password", referrer: "no-referrer", robots: { index: false, follow: false } };

// Link from the invitation email (new user) or the reset email (forgot password)
const SetPasswordPage = () => (
  <AuthShell title="Set your password" description="Use at least 8 characters with a letter and a number.">
    <Suspense fallback={<div className="h-72" />}>
      <SetPasswordForm />
    </Suspense>
  </AuthShell>
);

export default SetPasswordPage;
