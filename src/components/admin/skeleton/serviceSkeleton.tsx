import { Skeleton } from "@/components/ui/skeleton";

const ServiceListSkeleton = () => {
    return (
        <ul className="mt-6 divide-y divide-navy-300/40 overflow-hidden rounded-2xl border border-navy-300/50 bg-white">
            {Array.from({ length: 3 }).map((_, index) => (
                <li
                    key={index}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start"
                >
                    {/* Service details */}
                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Skeleton className="h-5 w-40 max-w-full" />
                            <Skeleton className="h-5 w-14 rounded-full" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full max-w-2xl" />
                            <Skeleton className="h-4 w-3/4 max-w-xl" />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-20 rounded-md" />
                            <Skeleton className="h-6 w-14 rounded-md" />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex shrink-0 gap-1 self-end sm:self-start">
                        <Skeleton className="size-9 rounded-md" />
                        <Skeleton className="size-9 rounded-md" />
                        <Skeleton className="size-9 rounded-md" />
                    </div>
                </li>
            ))}
        </ul>
    );
}
export default ServiceListSkeleton