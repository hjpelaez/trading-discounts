import { TableSkeleton } from "@/components/skeletons";

export default function Loading() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
                <div className="h-10 w-32 bg-muted/50 rounded animate-pulse" />
            </div>
            <TableSkeleton />
        </div>
    );
}
