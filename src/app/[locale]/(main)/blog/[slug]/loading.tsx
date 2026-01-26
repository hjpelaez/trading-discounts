import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Header Skeleton */}
            <header className="relative py-24 md:py-32 overflow-hidden bg-muted/30 border-b">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <Skeleton className="h-5 w-32 mb-12" />
                    <Skeleton className="h-6 w-24 rounded-full mb-6" />
                    <Skeleton className="h-16 w-3/4 md:w-2/3 mb-8" />

                    <div className="flex items-center gap-4 pt-8 border-t border-border/10">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
            </header>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-20">
                <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl">
                    <Skeleton className="w-full aspect-[21/9]" />
                    <div className="p-8 md:p-16 space-y-6">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <div className="py-8">
                            <Skeleton className="h-8 w-1/2 mb-4" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                    </div>
                </div>
            </div>
        </div>
    );
}
