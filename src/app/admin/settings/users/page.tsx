"use client";

import { useState } from "react";
import { CircleDot, Layers, Plus, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  EmptyState,
  PageHeader,
  formatDate,
} from "@/components/admin/setting-ui";
import { cn } from "../../../../../lib/utils";
import StatusBadge from "@/components/shared/statusBadge";
import { RowActions } from "@/components/shared/RowsActions";
import UserFormDialog from "@/components/admin/forms/UsersForm";
import AdminPasswordDialog from "@/components/admin/forms/adminPasswdForm";
import {
  type AppUser,
  type UserFormValues,
  type UserStatus,
  useCreateUser,
  useDebouncedValue,
  useDeleteUser,
  UserRole,
  useSetUserStatus,
  useUpdateUser,
  useUsers,
  useUserStats,
} from "@/hooks/useUsers";
import Pagination from "@/components/shared/Pagination";
import SearchInput from "@/components/shared/SearchInput";
import FilterSelect from "@/components/shared/FilterSelect";
import { UserCardSkeleton } from "@/components/admin/skeleton/userSkeleton";

const UsersPage = () => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [view, setView] = useState<AppUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<AppUser | null>(null);
  const [toggling, setToggling] = useState<AppUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<AppUser | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const search = useDebouncedValue(query);
  const { data, isLoading, isFetching, isError } = useUsers({
    search,
    role: roleFilter,
    status: statusFilter,
  });
  const { data: stats } = useUserStats();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const setUserStatus = useSetUserStatus();
  const deleteUser = useDeleteUser();

  const users = data?.users ?? [];
  const totalPages = data?.totalPages;
  const totalAll = stats?.total ?? data?.total ?? 0;
  const filtering = !!query || roleFilter !== "all" || statusFilter !== "all";
  const ROLES: { value: UserRole; label: string }[] = [
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" },
    { value: "finance", label: "Finance" },
    { value: "hr", label: "HR" },
    { value: "dev", label: "Dev" },
  ];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (user: AppUser) => {
    setEditing(user);
    setFormOpen(true);
  };

  const closeForm = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditing(null);
  };

  const saveUser = (values: UserFormValues) => {
    const onSuccess = () => closeForm(false);
    if (editing) updateUser.mutate({ id: editing.id, values }, { onSuccess });
    else createUser.mutate(values, { onSuccess });
  };

  const openPasswordUpdate = (user: AppUser) => setPasswordUser(user);

  const openStatusConfirmation = (user: AppUser) => setToggling(user);

  const confirmToggle = () => {
    if (!toggling) return;
    const next: UserStatus =
      toggling.status === "active" ? "deactivated" : "active";
    setUserStatus.mutate(
      { id: toggling.id, status: next },
      { onSettled: () => setToggling(null) },
    );
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteUser.mutate(deleting.id, { onSettled: () => setDeleting(null) });
  };

  const deactivating = toggling?.status === "active";

  return (
    <div>
      <PageHeader
        title="Users & roles"
        description="Staff who can access the admin dashboard."
        action={
          <Button
            onClick={openCreate}
            className="rounded-md bg-title px-4 text-white hover:bg-title/90"
          >
            <Plus className="h-4 w-4" /> Create user
          </Button>
        }
      />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name, email or phone"
          label="Search users"
          loading={isFetching && !isLoading}
        />

        <FilterSelect
          label="Role"
          icon={ShieldCheck}
          heading="Filter by role"
          value={roleFilter}
          onChange={(v) => setRoleFilter(v as typeof roleFilter)}
          className="sm:w-52"
          options={[
            { value: "all", label: "All roles", count: stats?.total },
            ...ROLES.map((r, i) => ({
              value: r.value,
              label: r.label,
              count: stats?.role?.[r.value] ?? 0,
              separatorBefore: i === 0,
            })),
          ]}
        />

        <FilterSelect
          label="Status"
          icon={CircleDot}
          showLabel
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as typeof statusFilter)}
          className="sm:w-52"
          options={[
            { value: "all", label: "All", count: stats?.total },
            {
              value: "active",
              label: "Active",
              dot: "bg-emerald-500",
              count: stats?.active,
            },
            {
              value: "deactivated",
              label: "Deactivated",
              dot: "bg-red-500",
              count: stats?.deactivated,
            },
          ]}
        />
      </div>

      <p
        className={cn(
          "mt-4 text-sm text-ink/55",
          isFetching && !isLoading && "opacity-60",
        )}
      >
        {isLoading
          ? "Loading users…"
          : `${data?.total ?? 0} of ${totalAll} users`}
      </p>

      {isError ? (
        <div className="mt-4">
          <EmptyState
            title="Couldn't load users"
            text="Check your connection and refresh the page."
          />
        </div>
      ) : isLoading ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={filtering ? "No users found" : "No users yet"}
            text={
              filtering
                ? "Try a different search or filter."
                : "Create the first user to give someone access."
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-4 lg:gap-8 md:grid-cols-2 2xl:grid-cols-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="group min-w-0 overflow-hidden rounded-xl border bg-white transition-colors hover:border-navy-300"
              >
                <div className="flex items-center gap-3 p-4">
                  <Avatar user={u} />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold text-ink">
                      {u.firstName} {u.lastName}
                    </h2>
                    <p className="mt-1 truncate text-base text-ink/70">
                      {u.email}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <RowActions
                      user={u}
                      onView={setView}
                      onEdit={openEdit}
                      onUpdatePassword={openPasswordUpdate}
                      onToggleStatus={openStatusConfirmation}
                      onDelete={setDeleting}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-y border-navy-300/40 bg-navy-50/40 px-4 py-3">
                  <span className="text-sm font-medium capitalize text-ink">
                    {u.role.replace(/_/g, " ")}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-ink/30" />

                  <StatusBadge status={u.status} />

                  {!u.passwordSetAt && <InvitePending />}
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-ink/70 uppercase">
                      Phone number
                    </p>
                    <p className="mt-1 truncate text-base font-medium text-ink/90">
                      {u.phone || "Not provided"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-ink/70 uppercase">Date added</p>
                    <p className="mt-1 text-base font-medium text-ink/90">
                      {formatDate(u.createdAt)}
                    </p>
                  </div>

                  <div className="col-span-2 flex items-center justify-between gap-3 border-t border-navy-300/40 pt-3">
                    <span className="text-sm text-ink/70">Last active</span>
                    <span className="truncate text-base text-ink/90">
                      {u.lastActiveAt
                        ? formatDate(u.lastActiveAt, true)
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            className="mt-4"
            page={page}
            totalPages={totalPages}
            total={data?.total ?? 0}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            isFetching={isFetching}
            itemName="users"
          />
        </>
      )}

      {/* Create / edit */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={closeForm}
        user={editing}
        onSave={saveUser}
        isSaving={createUser.isPending || updateUser.isPending}
      />
      <AlertDialog
        open={!!view}
        onOpenChange={(open) => !open && setView(null)}
      >
        <AlertDialogContent className=" sm:max-w-2xl! p-6">
          {view && (
            <>
              <div className="px-6 pt-6">
                <AlertDialogHeader className="text-left">
                  <div className="flex items-start gap-4">
                    <Avatar user={view} />

                    <div className="min-w-0 flex-1 pt-0.5">
                      <AlertDialogTitle className="text-lg font-semibold tracking-tight text-ink">
                        {view.firstName} {view.lastName}
                      </AlertDialogTitle>

                      <AlertDialogDescription className="mt-1 break-all text-base">
                        {view.email}
                      </AlertDialogDescription>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-navy-50 px-2.5 py-1 text-sm font-medium capitalize text-ink">
                          {view.role.replace(/_/g, " ")}
                        </span>

                        <StatusBadge status={view.status} />

                        {!view.passwordSetAt && <InvitePending />}
                      </div>
                    </div>
                  </div>
                </AlertDialogHeader>
              </div>

              <div className="px-6 py-5">
                <h3 className="mb-4 text-base font-semibold text-ink">
                  Account information
                </h3>

                <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                  <Detail
                    label="Phone number"
                    value={view.phone || "Not provided"}
                  />
                  <Detail
                    label="Date created"
                    value={formatDate(view.createdAt)}
                  />
                  <Detail
                    label="Created by"
                    value={view.createdBy?.names ?? "—"}
                  />
                  {view?.updatedBy && <Detail
                    label="Updated by"
                    value={view.updatedBy?.names ?? "—"}
                  />}
                  <Detail
                    label="Last active"
                    value={
                      view.lastActiveAt
                        ? formatDate(view.lastActiveAt, true)
                        : "Never"
                    }
                  />
                  <Detail
                    label="Password setup"
                    value={
                      view.passwordSetAt ? (
                        <span>Set on {formatDate(view.passwordSetAt)}</span>
                      ) : (
                        <InvitePending />
                      )
                    }
                  />
                </dl>
              </div>

              <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-navy-300/40 bg-navy-50/40 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setView(null)}
                >
                  Close
                </Button>

                <Button
                  type="button"
                  className="bg-title text-white hover:bg-title/90"
                  onClick={() => {
                    const u = view;
                    setView(null);
                    openEdit(u);
                  }}
                >
                  Edit user
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      {/* Update password: email a link or set it */}
      <AdminPasswordDialog
        user={passwordUser}
        onOpenChange={(open) => !open && setPasswordUser(null)}
      />

      {/* Activate / deactivate */}
      <ConfirmDialog
        open={!!toggling}
        onOpenChange={(open) =>
          !open && !setUserStatus.isPending && setToggling(null)
        }
        title={deactivating ? "Deactivate user?" : "Activate user?"}
        description={
          <>
            <span className="font-medium text-ink">
              {toggling?.firstName} {toggling?.lastName}
            </span>{" "}
            {deactivating
              ? "won't be able to access the dashboard until activated again."
              : "will be able to access the dashboard again."}
          </>
        }
        confirmLabel={
          setUserStatus.isPending
            ? "Saving..."
            : deactivating
              ? "Deactivate"
              : "Activate"
        }
        onConfirm={confirmToggle}
      />

      {/* Delete */}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) =>
          !open && !deleteUser.isPending && setDeleting(null)
        }
        title="Delete user?"
        description={
          <>
            <span className="font-medium text-ink">
              {deleting?.firstName} {deleting?.lastName}
            </span>{" "}
            will lose access to the dashboard.
          </>
        }
        confirmLabel={deleteUser.isPending ? "Deleting..." : "Delete user"}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
export default UsersPage

const Avatar = ({ user }: { user: AppUser }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold uppercase text-title ring-1 ring-navy-300/60">
    {user.firstName?.[0] ?? "?"}
    {user.lastName?.[0] ?? ""}
  </span>
);

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="min-w-0 space-y-1.5">
    <dt className="text-sm font-medium text-ink/50">{label}</dt>
    <dd className="break-words text-base font-medium text-ink/90">
      {value}
    </dd>
  </div>
);

// User was invited but hasn't set a password yet
const InvitePending = () => (
  <span className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-sm font-medium text-amber-700">
    Invite pending
  </span>
);
