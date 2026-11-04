"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthService } from "@/services/authService";
import { getErrorMessage, setAccessToken } from "@/lib/admin/httpRequest";

export const ME_KEY = ["auth", "me"];

// Tell other open tabs when we sign out (AuthGate listens)
export const AUTH_CHANNEL = "ds-auth";
const broadcastSignOut = () => {
  try {
    const ch = new BroadcastChannel(AUTH_CHANNEL);
    ch.postMessage("signed-out");
    ch.close();
  } catch {}
};

export type AuthRole = "dev" | "admin" | "hr" | "finance" | "staff"| "user";

export interface AuthUser {
  id: string;
  names: string;
  email: string;
  phoneNumber: string;
  role: AuthRole;
  status: "active" | "inactive";
  lastLoginAt: string | null;
  passwordSetAt: string | null;
  createdAt: string;
}
export const hasRole = (
  user: AuthUser | null | undefined,
  ...roles: AuthRole[]
) => !!user && (user.role === "dev" || roles.includes(user.role));

export const safeNext = (
  next: string | null | undefined,
  fallback = "/admin",
) =>
  next &&
  next.startsWith("/") &&
  !next.startsWith("//") &&
  !next.startsWith("/\\") &&
  !next.startsWith("/login")
    ? next
    : fallback;

export const useMe = (enabled = true) =>
  useQuery<AuthUser>({
    queryKey: ME_KEY,
    queryFn: async () => (await AuthService.getMe()).data,
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: {
      email: string;
      password: string;
      rememberMe: boolean;
    }) => (await AuthService.login(v)).data,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      qc.clear();
      qc.setQueryData(ME_KEY, data.user);
    },
  });
};

export const useLogout = () =>
  useMutation({
    mutationFn: async (everywhere: boolean = false) =>
      everywhere ? AuthService.logoutAll() : AuthService.logout(),
    onSettled: () => {
      setAccessToken(null);
      broadcastSignOut();
      window.location.replace("/login");
    },
  });

// Passwords (not signed in)
export const useForgotPassword = () =>
  useMutation({
    mutationFn: async (email: string) =>
      (await AuthService.forgotPassword(email)).data,
  });

export interface PasswordTokenInfo {
  valid: boolean;
  type: "invite" | "reset";
  email: string; 
  firstName: string;
  expiresAt: string;
}

// Is the link from the email still valid?
export const usePasswordToken = (token: string | null) =>
  useQuery<PasswordTokenInfo>({
    queryKey: ["auth", "password-token", token],
    queryFn: async () => (await AuthService.checkToken(token!)).data,
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: async (v: { token: string; password: string }) =>
      (await AuthService.resetPassword(v)).data,
  });

// Passwords (signed in)
export const useChangePassword = () =>
  useMutation({
    mutationFn: async (v: { currentPassword: string; newPassword: string }) =>
      (await AuthService.changePassword(v)).data,
    onSuccess: () => {
      toast.success("Password changed. Sign in with your new password.");
      setAccessToken(null);
      broadcastSignOut();
      setTimeout(() => window.location.replace("/login"), 800);
    },
  });

// set another user's password
export const useAdminSetPassword = () =>
  useMutation({
    mutationFn: async ({
      userId,
      password,
      notifyUser,
    }: {
      userId: string;
      password: string;
      notifyUser: boolean;
    }) =>
      (await AuthService.adminSetPassword(userId, { password, notifyUser }))
        .data,
    onSuccess: () =>
      toast.success(
        "Password updated. The user was signed out of all devices.",
      ),
    onError: (e) => toast.error(getErrorMessage(e)),
  });

//email an invitation (no password yet) or a reset link
export const useSendPasswordLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) =>
      (await AuthService.sendPasswordLink(userId)).data,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Link sent");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};
