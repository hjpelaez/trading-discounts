import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Skeleton */}
            <section className="relative bg-muted/30 border-b">
                <div className="container mx-auto py-12 md:py-20 px-4 md:px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="space-y-4 w-full md:max-w-2xl">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-3/4 md:w-1/2 rounded-lg" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-24 w-full" />
                        </div>

                        {/* CTA Card Skeleton */}
                        <div className="w-full md:w-[350px] rounded-xl border bg-card p-6 shadow-lg space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20 mx-auto" />
                                <Skeleton className="h-10 w-32 mx-auto" />
                            </div>
                            <Skeleton className="h-20 w-full rounded-lg" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content Skeleton */}
                    <div className="md:col-span-2 space-y-12">
                        <section>
                            <Skeleton className="h-8 w-48 mb-6" />
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className={`h-24 rounded-lg ${i === 4 ? "col-span-2 sm:col-span-2" : ""}`} />
                                ))}
                            </div>
                        </section>

                        <section>
                            <Skeleton className="h-8 w-64 mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-12 rounded-lg" />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div>
                        <Skeleton className="h-6 w-48 mb-4" />
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-48 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
