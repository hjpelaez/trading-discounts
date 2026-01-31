"use client";

import { toggleFirmVisibilityAction } from "@/actions/firm-actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

interface FirmVisibilityToggleProps {
    id: string;
    isVisible: boolean;
}

export function FirmVisibilityToggle({ id, isVisible }: FirmVisibilityToggleProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            await toggleFirmVisibilityAction(id, isVisible);
        } catch (error) {
            console.error("Error toggling visibility:", error);
            alert("No se pudo cambiar la visibilidad. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`p-2 rounded-md transition-colors ${isVisible ? "text-muted-foreground hover:bg-muted hover:text-foreground" : "text-orange-500 hover:bg-orange-50"}`}
            title={isVisible ? "Ocultar" : "Mostrar"}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isVisible ? (
                <Eye className="h-4 w-4" />
            ) : (
                <EyeOff className="h-4 w-4" />
            )}
        </button>
    );
}
