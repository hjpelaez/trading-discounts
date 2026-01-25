"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn("animate-pulse rounded-md bg-muted/50", className)} />
    );
}

export function FirmCardSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex flex-wrap gap-1">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-12" />
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border/50 flex justify-between">
                <div className="space-y-1">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-1 flex flex-col items-end">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-7 w-20" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="flex gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    );
}
