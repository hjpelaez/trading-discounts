import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD') // separate accents from letters
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-+|-+$/g, ''); // trim dashes from ends
}

export function parseBilingual(val: any, locale: string) {
    if (!val) return "";

    let current = val;
    let attempts = 0;

    // Recursive "Onion Peeler"
    while (attempts < 5) {
        // 1. Try to parse if it looks like a JSON string
        if (typeof current === 'string' && (current.trim().startsWith('{') || current.trim().startsWith('"'))) {
            try {
                const parsed = JSON.parse(current);
                current = parsed;
                // console.log(`[parseBilingual] parsed JSON depth ${attempts}`);
            } catch (e) {
                // console.error(`[parseBilingual] parse error at depth ${attempts}:`, e);
                break;
            }
        }

        // 2. If it's an object, try to extract the locale
        else if (typeof current === 'object' && current !== null) {
            const candidate = current[locale as "en" | "es"] || current.en || current.es;

            if (candidate !== undefined) {
                current = candidate;
                // console.log(`[parseBilingual] found candidate at depth ${attempts}`);
            } else {
                break;
            }
        }
        else {
            break;
        }

        attempts++;
    }

    if (typeof current === 'object') return ""; // Safety fallback: prevent returning raw JSON if extraction failed
    return String(current);
}

export function parseBilingualArray(val: any, locale: string): string[] {
    if (!val) return [];

    let current = val;
    let attempts = 0;

    while (attempts < 5) {
        if (typeof current === 'string' && (current.trim().startsWith('{') || current.trim().startsWith('['))) {
            try {
                current = JSON.parse(current);
            } catch (e) {
                break;
            }
        } else if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
            // It's an object (likely a map), try to get the array for the locale
            const candidate = current[locale as "en" | "es"] || current.en || current.es;
            if (candidate !== undefined) {
                current = candidate;
            } else {
                break;
            }
        } else {
            // It's an array or something else we successfully unwrapped to
            break;
        }
        attempts++;
    }

    if (Array.isArray(current)) return current;

    // Fallback: If it resolved to a string, try to split by comma
    if (typeof current === 'string' && current.trim().length > 0) {
        return current.split(',').map(s => s.trim()).filter(Boolean);
    }

    return [];
}
