// src/app/admin/settings/users/page.tsx  →  /admin/settings/users
"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EmptyState, Field, PageHeader, formatDate, selectClass } from "@/components/admin/setting-ui";
import { mockUsers, type AppUser, type UserRole, type UserStatus } from "@/lib/mock/settings";
import { cn } from "../../../../../lib/utils";


const statusStyle: Record<UserStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  invited: "bg-amber-50 text-amber-700 ring-amber-600/20",
  deactivated: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers); // TODO: load from API
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<AppUser | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (statusFilter === "all" || u.status === statusFilter) &&
        (!q || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)),
    );
  }, [users, query, statusFilter]);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (user: AppUser) => { setEditing(user); setFormOpen(true); };

  const saveUser = (data: Omit<AppUser, "id" | "createdAt" | "lastActiveAt">) => {
    if (editing) {
      setUsers((list) => list.map((u) => (u.id === editing.id ? { ...u, ...data } : u)));
      toast.success("User updated");
    } else {
      setUsers((list) => [
        { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), lastActiveAt: null },
        ...list,
      ]);
      toast.success("User created", { description: "An invitation email will be sent." });
    }
    setFormOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Users & roles"
        description="Staff who can access the admin dashboard."
        action={
          <Button onClick={openCreate} className="rounded-full bg-title px-4 text-white hover:bg-title/90">
            <Plus className="h-4 w-4" /> Create user
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search users</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" className="bg-white pl-9" />
        </label>
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className={cn(selectClass, "sm:w-44")}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="invited">Invited</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-ink/55">{filtered.length} of {users.length} users</p>

      {filtered.length === 0 ? (
        <div className="mt-4"><EmptyState title="No users found" text="Try a different search or filter." /></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-navy-300/50 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-navy-300/50 bg-navy-50/60 text-xs uppercase tracking-wide text-ink/55">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">First name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Last name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Email</th>
                  <th scope="col" className="px-4 py-3 font-medium">Phone</th>
                  <th scope="col" className="px-4 py-3 font-medium">Created</th>
                  <th scope="col" className="px-4 py-3 font-medium">Last active</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-300/40">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-navy-50/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar user={u} />
                        <span className="font-medium text-ink">{u.firstName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink">{u.lastName}</td>
                    <td className="px-4 py-3 text-ink/75">{u.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/75">{u.phone}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/75">{formatDate(u.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/75">{u.lastActiveAt ? formatDate(u.lastActiveAt, true) : "Never"}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3">
                      <RowActions user={u} onEdit={openEdit} onDelete={setDeleting} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="mt-4 space-y-3 md:hidden">
            {filtered.map((u) => (
              <li key={u.id} className="rounded-2xl border border-navy-300/50 bg-white p-4">
                <div className="flex items-start gap-3">
                  <Avatar user={u} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{u.firstName} {u.lastName}</p>
                    <p className="truncate text-sm text-ink/65">{u.email}</p>
                    <p className="text-sm text-ink/65">{u.phone}</p>
                  </div>
                  <StatusBadge status={u.status} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-navy-300/40 pt-3 text-xs text-ink/55">
                  <span>Created {formatDate(u.createdAt)} · Active {u.lastActiveAt ? formatDate(u.lastActiveAt) : "never"}</span>
                  <RowActions user={u} onEdit={openEdit} onDelete={setDeleting} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editing} onSave={saveUser} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete user?"
        description={<><span className="font-medium text-ink">{deleting?.firstName} {deleting?.lastName}</span> will lose access to the dashboard.</>}
        confirmLabel="Delete user"
        onConfirm={() => {
          setUsers((list) => list.filter((u) => u.id !== deleting?.id)); // TODO: API call
          toast.success("User deleted");
        }}
      />
    </div>
  );
}

function Avatar({ user }: { user: AppUser }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-title ring-1 ring-navy-300/60">
      {user.firstName[0]}{user.lastName[0]}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset", statusStyle[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function RowActions({ user, onEdit, onDelete }: { user: AppUser; onEdit: (u: AppUser) => void; onDelete: (u: AppUser) => void }) {
  const name = `${user.firstName} ${user.lastName}`;
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" aria-label={`Edit ${name}`} onClick={() => onEdit(user)} className="text-ink/60 hover:text-title">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label={`Delete ${name}`} onClick={() => onDelete(user)} className="text-ink/60 hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AppUser | null;
  onSave: (data: Omit<AppUser, "id" | "createdAt" | "lastActiveAt">) => void;
}) {
  const isEdit = !!user;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSave({
      firstName: String(f.get("firstName")).trim(),
      lastName: String(f.get("lastName")).trim(),
      email: String(f.get("email")).trim().toLowerCase(),
      phone: String(f.get("phone")).trim(),
      role: f.get("role") as UserRole,
      status: (f.get("status") as UserStatus) ?? "invited",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        {/* key resets the form when switching between users */}
        <form key={user?.id ?? "new"} onSubmit={onSubmit}>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>{isEdit ? "Edit user" : "Create user"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isEdit ? "Update this user's details and access." : "They'll receive an email to set their password."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-5 sm:grid-cols-2">
            <Field label="First name" htmlFor="firstName">
              <Input id="firstName" name="firstName" defaultValue={user?.firstName} required />
            </Field>
            <Field label="Last name" htmlFor="lastName">
              <Input id="lastName" name="lastName" defaultValue={user?.lastName} required />
            </Field>
            <Field label="Email" htmlFor="userEmail" className="sm:col-span-2">
              <Input id="userEmail" name="email" type="email" defaultValue={user?.email} required />
            </Field>
            <Field label="Phone number" htmlFor="userPhone">
              <Input id="userPhone" name="phone" type="tel" defaultValue={user?.phone} required />
            </Field>
            <Field label="Role" htmlFor="role">
              <select id="role" name="role" defaultValue={user?.role ?? "staff"} className={selectClass}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            {isEdit && (
              <Field label="Status" htmlFor="status" className="sm:col-span-2">
                <select id="status" name="status" defaultValue={user.status} className={selectClass}>
                  <option value="active">Active</option>
                  <option value="invited">Invited</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </Field>
            )}
          </div>

          <AlertDialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-title text-white hover:bg-title/90">
              {isEdit ? "Save changes" : "Create user"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}