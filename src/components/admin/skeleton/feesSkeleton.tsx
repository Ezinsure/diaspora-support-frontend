import { Skeleton } from "@/components/ui/skeleton";

const FeeGroupsSkeleton = () => {
    return (
        <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, groupIndex) => (
                <section
                    key={groupIndex}
                    className="overflow-hidden rounded-2xl border border-navy-300/50 bg-white"
                >
                    <header className="flex items-center justify-between gap-3 border-b border-navy-300/40 bg-navy-50/40 px-5 py-3">
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-5 w-36 max-w-full rounded-md" />
                            <Skeleton className="h-4 w-64 max-w-full rounded-md" />
                        </div>
                        <Skeleton className="h-8 w-16 shrink-0 rounded-md" />
                    </header>

                    <ul className="divide-y divide-navy-300/40">
                        {Array.from({
                            length: groupIndex === 0 ? 3 : groupIndex === 1 ? 2 : 1,
                        }).map((_, feeIndex) => (
                            <li
                                key={feeIndex}
                                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
                            >
                                <div className="min-w-0 flex-1 space-y-2">
                                    <Skeleton className="h-5 w-40 max-w-full rounded-md" />
                                    <Skeleton className="h-4 w-full max-w-sm rounded-md" />
                                </div>
                                <div className="flex items-center justify-between gap-4 sm:contents">
                                    <Skeleton className="h-6 w-28 shrink-0 rounded-md sm:order-2 sm:ml-auto" />

                                    <div className="flex shrink-0 gap-1 self-end sm:order-3 sm:self-auto">
                                        <Skeleton className="h-9 w-9 rounded-md" />
                                        <Skeleton className="h-9 w-9 rounded-md" />
                                        <Skeleton className="h-9 w-9 rounded-md" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
};
export default FeeGroupsSkeleton;