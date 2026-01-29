"use client";

import { m, AnimatePresence } from "framer-motion";
import { CheckCircle2, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessToastProps {
    message: string;
    onClose: () => void;
}

export function SuccessToast({ message, onClose }: SuccessToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <m.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-foreground text-background px-6 py-4 rounded-2xl shadow-2xl border border-white/10 min-w-[300px]"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20">
                <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-black leading-none mb-1">Copiado con Éxito</p>
                <p className="text-xs opacity-70 font-medium">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="hover:bg-white/10 p-1 rounded-lg transition-colors"
            >
                <X className="h-4 w-4 opacity-50" />
            </button>
        </m.div>
    );
}
