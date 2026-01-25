"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();

    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }, 300);

    return (
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
                type="search"
                placeholder="Search firms..."
                className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("q")?.toString()}
            />
            {isPending && (
                <div className="absolute right-3 top-3 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
        </div>
    );
}
