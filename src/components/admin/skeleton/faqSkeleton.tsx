import { Skeleton } from "@/components/ui/skeleton";

const FaqListSkeleton = () => {
  return (
    <ul className="mt-4 space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="overflow-hidden rounded-xl border border-navy-300/50 bg-white"
        >
          <div className="flex items-center gap-3 p-4">
            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />

            <Skeleton
              className={`h-5 max-w-full rounded-md ${
                i % 2 === 0 ? "w-3/4" : "w-1/2"
              }`}
            />
            {i % 3 === 1 && (
              <Skeleton className="h-5 w-12 shrink-0 rounded-full" />
            )}

            <Skeleton className="ml-auto h-4 w-4 shrink-0 rounded-sm" />
          </div>
          {i === 0 && (
            <div className="px-4 pb-4 sm:pl-14">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 max-w-full rounded-md" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-16 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
export default FaqListSkeleton;