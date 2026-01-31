"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useTranslations } from "next-intl";

export function PriceRangeSlider() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("Common");

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
        <div className="w-full sm:w-auto flex flex-col gap-3">
            <span className="text-sm font-bold text-gray-500">{t('filters.priceLabel')}</span>

            <div className="w-full sm:w-auto bg-card p-3 rounded-xl border border-border min-w-[300px] flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-foreground min-w-[30px] text-right">${minPrice}</span>

                <div
                    className="relative h-2 w-full rounded-full grow"
                    style={{ backgroundColor: '#D1D5DB' }}
                >
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
                        style={{ background: 'transparent' }}
                        className="pointer-events-none absolute h-full w-full appearance-none bg-transparent focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:appearance-none"
                    />
                    <input
                        type="range"
                        min={MIN_LIMIT}
                        max={MAX_LIMIT}
                        value={maxPrice}
                        onChange={handleMaxChange}
                        style={{ background: 'transparent' }}
                        className="pointer-events-none absolute h-full w-full appearance-none bg-transparent focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:appearance-none"
                    />
                </div>

                <span className="text-xs font-bold font-mono text-foreground min-w-[30px]">${maxPrice}{maxPrice >= MAX_LIMIT && "+"}</span>
            </div>
        </div>
    );
}
