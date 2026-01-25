"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("pft-favorites");
        if (stored) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing favorites", e);
            }
        }
    }, []);

    const toggleFavorite = (id: string) => {
        const newList = favorites.includes(id)
            ? favorites.filter((i) => i !== id)
            : [...favorites, id];

        setFavorites(newList);
        localStorage.setItem("pft-favorites", JSON.stringify(newList));
    };

    return { favorites, toggleFavorite, isFavorite: (id: string) => favorites.includes(id) };
}
