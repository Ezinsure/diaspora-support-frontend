import { Suspense } from "react";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/authShell";
import ForgotPasswordForm from "@/components/admin/forms/forgotPasswdForm";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };

const ForgotPasswordPage = () => (
  <AuthShell title="Forgot your password?" description="Enter your email and we'll send you a link to choose a new one.">
    <Suspense fallback={<div className="h-40" />}>
      <ForgotPasswordForm />
    </Suspense>
  </AuthShell>
);

export default ForgotPasswordPage;
