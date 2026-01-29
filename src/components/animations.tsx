"use client";

import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export function FadeIn({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </m.div>
    );
}

export function StaggerContainer({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <m.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.05,
                    },
                },
            }}
            className={className}
        >
            <AnimatePresence mode="popLayout">
                {children}
            </AnimatePresence>
        </m.div>
    );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <m.div
            variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                show: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
            }}
            transition={{
                layout: { type: "spring", stiffness: 350, damping: 30 },
                opacity: { duration: 0.3 }
            }}
            className={cn("flex flex-col", className)}
        >
            {children}
        </m.div>
    )
}
