"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function PriceRangeSlider() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Default range: $0 to $1000
    const MIN_LIMIT = 0;
    const MAX_LIMIT = 1000;

    const [minPrice, setMinPrice] = React.useState(
        searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : MIN_LIMIT
    );
    const [maxPrice, setMaxPrice] = React.useState(
        searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : MAX_LIMIT
    );

    const updateUrl = useDebouncedCallback((min: number, max: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (min === MIN_LIMIT) params.delete("minPrice");
        else params.set("minPrice", min.toString());

        if (max === MAX_LIMIT) params.delete("maxPrice");
        else params.set("maxPrice", max.toString());

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), maxPrice - 1);
        setMinPrice(val);
        updateUrl(val, maxPrice);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), minPrice + 1);
        setMaxPrice(val);
        updateUrl(minPrice, val);
    };

    return (
        <div className="w-full max-w-[200px] items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground mr-2 shrink-0">Price:</span>
            <div className="flex flex-col w-full gap-2">
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span>${minPrice}</span>
                    <span>${maxPrice}{maxPrice >= MAX_LIMIT && "+"}</span>
                </div>

                <div className="relative h-2 w-full rounded-full bg-secondary">
                    {/* Track fill */}
                    <div
                        className="absolute h-full rounded-full bg-primary"
                        style={{
                            left: `${(minPrice / MAX_LIMIT) * 100}%`,
                            right: `${100 - (maxPrice / MAX_LIMIT) * 100}%`
                        }}
                    />

                    {/* Range Inputs */}
                    <input
                        type="range"
                        min={MIN_LIMIT}
                        max={MAX_LIMIT}
                        value={minPrice}
                        onChange={handleMinChange}
                        className="pointer-events-none absolute h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
                    />
                    <input
                        type="range"
                        min={MIN_LIMIT}
                        max={MAX_LIMIT}
                        value={maxPrice}
                        onChange={handleMaxChange}
                        className="pointer-events-none absolute h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
}
