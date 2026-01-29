"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DecorativeSeparatorProps {
    className?: string;
    icon?: React.ReactNode;
}

export function DecorativeSeparator({ className, icon }: DecorativeSeparatorProps) {
    return (
        <div className={cn("relative py-2 flex items-center justify-center", className)}>
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
            </div>

            {/* Main Divider Line */}
            <div className="absolute inset-0 flex items-center justify-center px-4 md:px-0">
                <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Center Decorative Element */}
            <div className="relative flex items-center justify-center bg-background px-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-pulse-slow">
                    {icon || <Sparkles className="h-5 w-5 text-primary" />}
                </div>
            </div>
        </div>
    );
}
