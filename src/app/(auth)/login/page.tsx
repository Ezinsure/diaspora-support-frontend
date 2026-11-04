import { Suspense } from "react";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/authShell";
import LoginForm from "@/components/admin/forms/loginForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

const LoginPage = () => (
  <AuthShell title="Welcome Back" description="Sign in with the your email.">
    <Suspense fallback={<div className="h-72" />}>
      <LoginForm />
    </Suspense>
  </AuthShell>
);

export default LoginPage;