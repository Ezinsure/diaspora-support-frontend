import { Skeleton } from "@/components/ui/skeleton";

const RequestCardSkeleton = () => {
  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-40 max-w-full" />
            <Skeleton className="h-4 w-32 max-w-full" />
          </div>
        </div>

        
        <div className="space-y-2">
          <Skeleton className="h-4 w-48 max-w-full" />
          <Skeleton className="h-4 w-36 max-w-full" />
        </div>

      
        <div className="space-y-2 rounded-lg bg-gray-50 px-3 py-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>

       
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="space-y-2 rounded-lg border border-gray-200 px-3 py-2"
            >
              <Skeleton className="h-3 w-16 max-w-full" />
              <Skeleton className="h-4 w-20 max-w-full" />
            </div>
          ))}
        </div>

       
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />

          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
        </div>

       
        <Skeleton className="mt-auto h-4 w-36" />
      </div>

  
      <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 px-5 py-3">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="ml-auto h-8 w-16 rounded-md" />
      </div>
    </article>
  );
};
export default RequestCardSkeleton;