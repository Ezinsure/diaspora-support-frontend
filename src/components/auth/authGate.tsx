"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { getAccessToken, getErrorMessage, goToLogin, refreshAccessToken, setAccessToken } from "@/lib/admin/httpRequest";
import { AUTH_CHANNEL, hasRole, useMe, type AuthRole } from "@/hooks/useAuth";

const FullPageLoader = ({ text }: { text: string }) => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-navy-50/60 text-sm text-ink/60">
    <Loader2 className="h-6 w-6 animate-spin text-title" />
    {text}
  </div>
);

/**
 * Wrap the admin layout with this.
 * On page load the access token is gone (it's only in memory), so we ask /auth/refresh
 * for a new one using the httpOnly cookie. No cookie / expired -> /login?next=...
 */
const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(() => !!getAccessToken());
  const me = useMe(ready);

  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    refreshAccessToken().then((token) => {
      if (cancelled) return;
      if (token) setReady(true);
      else goToLogin();
    });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  // Signed out in another tab -> sign out here too
  useEffect(() => {
    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel(AUTH_CHANNEL);
      ch.onmessage = (e) => {
        if (e.data === "signed-out") {
          setAccessToken(null);
          window.location.replace("/login");
        }
      };
    } catch { }
    return () => ch?.close();
  }, []);

  if (!ready || me.isLoading) return <FullPageLoader text="Loading your dashboard…" />;
  if (me.isError || !me.data) {
    // A 401 is already redirecting to /login; anything else (server down...) -> retry
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-navy-50/60 px-4 text-center text-sm text-ink/60">
        <p className="font-medium text-ink">Couldn't load your account</p>
        <p>{getErrorMessage(me.error)}</p>
        <button type="button" onClick={() => me.refetch()} className="mt-1 rounded-xl bg-title px-4 py-2 text-sm font-medium text-white hover:bg-title/90">
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGate;

