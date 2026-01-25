"use client";

import { motion, AnimatePresence } from "framer-motion";
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
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
        <motion.div
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
            <AnimatePresence mode="popLayout" initial={false}>
                {children}
            </AnimatePresence>
        </motion.div>
    );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            layout
            variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                show: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
            }}
            transition={{
                layout: { type: "spring", stiffness: 350, damping: 30 },
                opacity: { duration: 0.3 }
            }}
            className={cn("flex flex-col h-full", className)}
        >
            {children}
        </motion.div>
    )
}
