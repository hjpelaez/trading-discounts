"use client";

import { m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={true}>
            <m.div
                key={pathname}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="flex-1 flex flex-col"
            >
                {children}
            </m.div>
        </AnimatePresence>
    );
}
