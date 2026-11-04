import { Skeleton } from "@/components/ui/skeleton";

export function UserCardSkeleton() {
  return (
    <div className="min-w-0 rounded-2xl border border-navy-200/30 bg-white p-4">
      {/* Header: avatar, name, email, actions */}
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="size-11 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-32 max-w-full" />
            <Skeleton className="h-3 w-44 max-w-full" />
          </div>
        </div>

        <Skeleton className="size-8 shrink-0 rounded-md" />
      </div>

      {/* Role and status */}
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* User details */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-navy-300/40 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-24 max-w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-4 w-20 max-w-full" />
        </div>

        <div className="col-span-2 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-36 max-w-full" />
        </div>
      </div>
    </div>
  );
}