"use client";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  KeyRound,
  UserRoundX,
  UserRoundCheck,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RowActionsProps<T extends { id: string; status: string }> = {
  user: T;
  label?: string;
  onView: (user: T) => void;
  onEdit: (user: T) => void;
  onUpdatePassword: (user: T) => void;
  onToggleStatus: (user: T) => void;
  onDelete: (user: T) => void;
};

export const RowActions = <T extends { id: string; status: string }>({
  user,
  label,
  onView,
  onEdit,
  onUpdatePassword,
  onToggleStatus,
  onDelete,
}: RowActionsProps<T>) => {
  const isActive = user.status.toLowerCase() === "active";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${label ?? "user"}`}
        className="inline-flex size-9 items-center justify-center rounded-xl text-ink/60 hover:bg-navy-50 hover:text-ink"
      >
        <MoreHorizontal className="size-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-52 rounded-xl border-0 border-navy-200/50 bg-white p-1.5"
      >
        <DropdownMenuItem
          onClick={() => onView(user)}
          className="cursor-pointer gap-2.5 rounded-lg py-2.5"
        >
          <Eye className="size-4 text-ink/60" />
          View details
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onEdit(user)}
          className="cursor-pointer gap-2.5 rounded-lg py-2.5"
        >
          <Pencil className="size-4 text-ink/60" />
          Edit user
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onUpdatePassword(user)}
          className="cursor-pointer gap-2.5 rounded-lg py-2.5"
        >
          <KeyRound className="size-4 text-ink/60" />
          Update password
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-navy-300/40" />

        <DropdownMenuItem
          onClick={() => onToggleStatus(user)}
          className="cursor-pointer gap-2.5 rounded-lg py-2.5"
        >
          {isActive ? (
            <>
              <UserRoundX className="size-4 text-amber-600" />
              Deactivate account
            </>
          ) : (
            <>
              <UserRoundCheck className="size-4 text-emerald-600" />
              Activate account
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-navy-300/40" />

        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="cursor-pointer gap-2.5 rounded-lg py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700"
        >
          <Trash2 className="size-4" />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
