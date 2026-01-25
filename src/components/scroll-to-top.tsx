"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    if (pathname?.includes("/admin")) return null;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-24 right-6 z-[90] h-12 w-12 rounded-full bg-card border border-border shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}
            title="Scroll to top"
        >
            <ArrowUp className="h-5 w-5 text-primary" />
        </button>
    );
}
