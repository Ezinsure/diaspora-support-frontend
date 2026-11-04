"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, KeyRound, LogOut, MonitorX } from "lucide-react";
import ChangePasswordDialog from "@/components/admin/forms/changePasswdForm";
import { useLogout, useMe } from "@/hooks/useAuth";

/**
 * Signed-in user + "Change password" + "Sign out" for the admin header / sidebar.
 *   <UserMenu />
 */
const UserMenu = () => {
  const { data: user } = useMe();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const [changing, setChanging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;
  const initials = user.names
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  const item = "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-ink/80 hover:bg-navy-50 disabled:opacity-50";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 hover:bg-navy-50"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold uppercase text-title ring-1 ring-navy-300/60">
          {initials}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-[10rem] truncate text-sm font-medium text-ink">{user.names}</span>
          <span className="block text-xs capitalize text-ink/50">{user.role}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-ink/40" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-navy-300/50 bg-white p-1.5 shadow-lg">
          <div className="border-b border-navy-300/40 px-2.5 pb-2.5 pt-1.5">
            <p className="truncate text-sm font-medium text-ink">{user.names}</p>
            <p className="truncate text-xs text-ink/55">{user.email}</p>
          </div>
          <div className="pt-1.5">
            <button
              type="button"
              role="menuitem"
              className={item}
              onClick={() => {
                setOpen(false);
                setChanging(true);
              }}
            >
              <KeyRound className="h-4 w-4" /> Change password
            </button>
            <button type="button" role="menuitem" className={item} disabled={logout.isPending} onClick={() => logout.mutate(true)}>
              <MonitorX className="h-4 w-4" /> Sign out of all devices
            </button>
            <button type="button" role="menuitem" className={`${item} text-destructive hover:bg-destructive/5`} disabled={logout.isPending} onClick={() => logout.mutate(false)}>
              <LogOut className="h-4 w-4" /> {logout.isPending ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}

      <ChangePasswordDialog open={changing} onOpenChange={setChanging} />
    </div>
  );
};

export default UserMenu;
