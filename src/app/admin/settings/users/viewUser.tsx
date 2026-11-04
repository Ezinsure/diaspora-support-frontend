"use client";

import { Check, Copy, Mail, Pencil, Phone } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/components/admin/setting-ui";
import StatusBadge from "@/components/shared/statusBadge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { AppUser } from "@/hooks/useUsers";

export const UserAvatar = ({
  user,
  size = "md",
}: {
  user: AppUser;
  size?: "sm" | "md";
}) => (
  <span
    className={
      size === "md"
        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold uppercase text-title ring-1 ring-navy-300/60"
        : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold uppercase text-title ring-1 ring-navy-300/60"
    }
  >
    {user.firstName?.[0] ?? "?"}
    {user.lastName?.[0] ?? ""}
  </span>
);

const Detail = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={`min-w-0 ${className}`}>
    <dt className="text-sm font-medium text-ink/50">{label}</dt>
    <dd className="mt-1 break-words text-base text-ink/80">{value}</dd>
  </div>
);

const CopyButton = ({ value, label }: { value: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="inline-flex size-7 items-center justify-center rounded-lg text-ink/40 hover:bg-navy-50 hover:text-ink"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-600" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
};

const ViewUser = ({
  user,
  onClose,
}: {
  user: AppUser | null;
  onClose: () => void;
  onEdit?: (user: AppUser) => void;
  onToggleStatus?: (user: AppUser) => void;
  onDelete?: (user: AppUser) => void;
}) => {
  return (
    <AlertDialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-xl!">
        {user && (
          <>
            <AlertDialogHeader className="text-left pt-3 px-4">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="md" />
                <div className="min-w-0">
                  <AlertDialogTitle className="truncate">
                    {user.firstName} {user.lastName}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-lg border border-navy-300/50 bg-navy-50 px-2 py-0.5 text-xs font-medium capitalize text-navy-700">
                      {user.role.replace(/_/g, " ")}
                    </span>
                    <StatusBadge status={user.status} />
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>

            <div className="mt-4 rounded-xl border-[0.2px]! border-navy-300/40 p-2 mx-3">
              <div className="flex items-center gap-2 rounded-lg px-2 py-1">
                <Mail className="size-4 shrink-0 text-ink/40" />
                <a
                  href={`mailto:${user.email}`}
                  className="min-w-0 flex-1 break-all text-sm text-ink/80 hover:text-ink"
                >
                  {user.email}
                </a>
                <CopyButton value={user.email} label="email" />
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1">
                <Phone className="size-4 shrink-0 text-ink/40" />
                {user.phone ? (
                  <>
                    <a
                      href={`tel:${user.phone}`}
                      className="min-w-0 flex-1 text-sm text-ink/80 hover:text-ink"
                    >
                      {user.phone}
                    </a>
                    <CopyButton value={user.phone} label="phone number" />
                  </>
                ) : (
                  <span className="text-sm text-ink/40">No phone number</span>
                )}
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-4 pt-4 px-4">
              <Detail label="Created" value={formatDate(user.createdAt)} />
              <Detail label="Created by" value={user.createdBy?.names ?? "—"} />
              <Detail
                label="Last updated"
                value={user.updatedAt ? formatDate(user.updatedAt, true) : "—"}
              />
              <Detail
                label="Last active"
                value={
                  user.lastActiveAt
                    ? formatDate(user.lastActiveAt, true)
                    : "Never"
                }
              />
            </dl>

            <AlertDialogFooter className="mt-6 flex-col justify-end">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ViewUser;
