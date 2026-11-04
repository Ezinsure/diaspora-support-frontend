"use client";

import { useState } from "react";
import { CalendarDays, Clock, KeyRound, LogOut, Mail, MonitorX, Phone, ShieldCheck, UserRound } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { useProfile, type Profile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import ChangePasswordDialog from "./forms/changePasswdForm";

const formatDate = (d: string | null, withTime = false) =>
    d
        ? new Date(d).toLocaleString("en-GB", {
            timeZone: "Africa/Kigali",
            day: "numeric",
            month: "short",
            year: "numeric",
            ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
        })
        : "—";

const Avatar = ({ profile, size = "md" }: { profile: Profile | null; size?: "md" | "lg" }) => (
    <span
        className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold uppercase text-title ring-1 ring-navy-300/60",
            size === "lg" ? "h-18 w-18 text-xl ring-4 ring-navy-50" : "h-10 w-10 text-base",
        )}
        aria-hidden
    >
        {profile?.initials ?? <UserRound className="h-[18px] w-[18px]" />}
    </span>
);

const AccountMenu = () => {
    const { profile } = useProfile();
    const logout = useLogout();
    const [viewing, setViewing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const itemClass = "cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink/80 focus:bg-navy-50 data-[highlighted]:bg-navy-50";

    return (
        <>
            <div className="hidden min-w-0 text-right sm:block">
                <p className="max-w-[12rem] truncate text-base font-semibold text-ink">{profile?.names ?? " "}</p>
                <p className="text-sm text-ink/70">{profile?.roleLabel ?? ""}</p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label="Account menu"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-white/80 shadow-sm transition hover:ring-4 hover:ring-navy-300/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy-300/40 data-[popup-open]:ring-4 data-[popup-open]:ring-navy-300/40"
                >
                    <Avatar profile={profile} />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl border-navy-300/50 bg-white p-1.5 shadow-lg shadow-navy-900/5">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="flex items-center gap-3 px-2.5 py-2 font-normal">
                            <Avatar profile={profile} />
                            <span className="min-w-0">
                                <span className="block truncate text-base font-semibold text-ink">{profile?.names}</span>
                                <span className="block truncate text-sm text-ink/70">{profile?.email}</span>
                            </span>
                        </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-1 bg-navy-300/40" />

                    <DropdownMenuGroup>
                        <DropdownMenuItem className={itemClass} onClick={() => setViewing(true)}>
                            <UserRound className="h-4 w-4 text-ink/70" /> View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className={itemClass} onClick={() => setChangingPassword(true)}>
                            <KeyRound className="h-4 w-4 text-ink/70" /> Change password
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-1 bg-navy-300/40" />

                    <DropdownMenuGroup>
                        {/* <DropdownMenuItem className={itemClass} disabled={logout.isPending} onClick={() => logout.mutate(true)}>
                            <MonitorX className="h-4 w-4 text-ink/70" /> Sign out of all devices
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                            className={cn(itemClass, " data-[highlighted]:bg-destructive/5")}
                            disabled={logout.isPending}
                            onClick={() => logout.mutate(false)}
                        >
                            <LogOut className="h-4 w-4" /> {logout.isPending ? "Signing out…" : "Sign out"}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProfileDialog
                open={viewing}
                onOpenChange={setViewing}
                profile={profile}
                onChangePassword={() => {
                    setViewing(false);
                    setChangingPassword(true);
                }}
            />
            <ChangePasswordDialog open={changingPassword} onOpenChange={setChangingPassword} />
        </>
    );
};

const ProfileDialog = ({
    open,
    onOpenChange,
    profile,
    onChangePassword,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: Profile | null;
    onChangePassword: () => void;
}) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="overflow-hidden p-0! md:pb-6! sm:max-w-xl!">
            {profile && (
                <>
                    {/* Banner + avatar */}
                    <div className="h-20 bg-[radial-gradient(400px_160px_at_0%_0%,#D9E5FE_0%,transparent_70%),radial-gradient(400px_160px_at_100%_0%,#DDF3EE_0%,transparent_70%)] bg-navy-50" />
                    <div className="-mt-8 px-6">
                        <Avatar profile={profile} size="lg" />
                    </div>

                    <AlertDialogHeader className="px-6 pt-3 text-left">
                        <AlertDialogTitle className="text-lg">{profile.names}</AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-lg border border-navy-300/50 bg-navy-50 px-2 py-0.5 text-sm font-medium text-navy-700">
                                <ShieldCheck className="h-3.5 w-3.5" /> {profile.roleLabel}
                            </span>
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-sm font-medium",
                                    profile.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
                                )}
                            >
                                <span className={cn("h-1.5 w-1.5 rounded-full", profile.status === "active" ? "bg-emerald-500" : "bg-red-500")} />
                                {profile.status === "active" ? "Active" : "Deactivated"}
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <dl className="mx-6 mt-5 divide-y divide-navy-300/40 rounded-xl border border-navy-300/50">
                        <Row icon={Mail} label="Email" value={profile.email} />
                        <Row icon={Phone} label="Phone" value={profile.phone || "—"} />
                        <Row icon={Clock} label="Last sign-in" value={formatDate(profile.lastLoginAt, true)} />
                        <Row icon={KeyRound} label="Password set" value={formatDate(profile.passwordSetAt)} />
                        <Row icon={CalendarDays} label="Member since" value={formatDate(profile.createdAt)} />
                    </dl>
                    <AlertDialogFooter className="mt-5 gap-2 border-t border-navy-300/40 bg-navy-50/40 px-6 py-4">
                        <Button type="button" variant="outline" onClick={onChangePassword}>
                            <KeyRound className="h-4 w-4" /> Change password
                        </Button>
                        <Button type="button" className="bg-title text-white hover:bg-title/90" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </AlertDialogFooter>
                </>
            )}
        </AlertDialogContent>
    </AlertDialog>
);

const Row = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) => (
    <div className="flex items-center gap-3 px-3.5 py-2.5">
        <Icon className="h-4 w-4 shrink-0 text-ink/60" />
        <dt className="w-28 shrink-0 text-sm font-medium text-ink/60">{label}</dt>
        <dd className="min-w-0 flex-1 break-words text-base text-ink/90">{value}</dd>
    </div>
);
export default AccountMenu;