"use client";

import { useState, useEffect } from "react";

export function useComparison() {
    const [comparisonList, setComparisonList] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("pft-comparison");
        if (stored) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setComparisonList(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing comparison list", e);
            }
        }

        // Listen for changes from other tabs/instances
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "pft-comparison") {
                setComparisonList(e.newValue ? JSON.parse(e.newValue) : []);
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const toggleComparison = (id: string) => {
        const newList = comparisonList.includes(id)
            ? comparisonList.filter((i) => i !== id)
            : [...comparisonList, id].slice(0, 4); // Limit to 4 for UX

        setComparisonList(newList);
        localStorage.setItem("pft-comparison", JSON.stringify(newList));

        // Dispatch custom event for same-tab sync
        window.dispatchEvent(new Event("pft-comparison-update"));
    };

    const clearComparison = () => {
        setComparisonList([]);
        localStorage.removeItem("pft-comparison");
        window.dispatchEvent(new Event("pft-comparison-update"));
    };

    // Effect for same-tab sync
    useEffect(() => {
        const handleUpdate = () => {
            const stored = localStorage.getItem("pft-comparison");
            setComparisonList(stored ? JSON.parse(stored) : []);
        };
        window.addEventListener("pft-comparison-update", handleUpdate);
        return () => window.removeEventListener("pft-comparison-update", handleUpdate);
    }, []);

    return { comparisonList, toggleComparison, clearComparison };
}
