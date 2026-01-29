"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

export function SearchInput({ className, placeholder }: { className?: string, placeholder?: string }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();
    const t = useTranslations('Common');

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
        <div className={cn("relative flex-1 max-w-sm group", className)}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="search"
                placeholder={placeholder || t('searchPlaceholder')}
                className="w-full rounded-full border border-border bg-background pl-11 pr-5 py-3 text-sm ring-offset-background placeholder:text-muted-foreground transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary/50"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("q")?.toString()}
            />
            {isPending && (
                <div className="absolute right-3 top-3 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
        </div>
    );
}
