"use client";

import { motion } from "framer-motion";

export function BackgroundAurora() {
    return (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none select-none">
            {/* Main Aurora Blobs */}
            <motion.div
                animate={{
                    x: [0, 40, 0],
                    y: [0, 60, 0],
                    rotate: [0, 10, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, -30, 0],
                    y: [0, -50, 0],
                    rotate: [0, -15, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[130px]"
            />

            {/* Dark Mode Overlay to ensure readability */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
        </div>
    );
}
