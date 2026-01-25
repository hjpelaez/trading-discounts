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
