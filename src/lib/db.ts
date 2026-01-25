import fs from "fs/promises";
import path from "path";
import { PropFirm } from "@/lib/data";
import { cache } from "react";

// Force dynamic execution for data fetching to ensure fresh data
export const dynamic = 'force-dynamic';

const FIRMS_DB_PATH = path.join(process.cwd(), "src/lib/firms.json");
const PAGES_DB_PATH = path.join(process.cwd(), "src/lib/pages.json");
const BLOG_DB_PATH = path.join(process.cwd(), "src/lib/blog.json");
const SUBSCRIBERS_DB_PATH = path.join(process.cwd(), "src/lib/subscribers.json");
const CATEGORIES_DB_PATH = path.join(process.cwd(), "src/lib/categories.json");
const SETTINGS_DB_PATH = path.join(process.cwd(), "src/lib/settings.json");

// --- UTILS ---
async function readJson(filePath: string) {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

// --- FIRMS ---

export const getFirms = cache(async (): Promise<PropFirm[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('Firm')
            .select('*')
            .order('featured', { ascending: false })
            .order('rating', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching firms from DB:", error);
        return [];
    }
});

export async function getFirmById(id: string): Promise<PropFirm | undefined> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('Firm')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data || undefined;
    } catch (error) {
        console.error("Error fetching firm:", error);
        return undefined;
    }
}

export async function saveFirm(firm: PropFirm) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('Firm')
        .upsert(firm);

    if (error) throw error;
}

export async function deleteFirm(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('Firm')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// --- PAGES ---

export interface Page {
    slug: { en: string; es: string; };
    title: { en: string; es: string; };
    content: { en: string; es: string; };
    lastUpdated: string;
}

export const getPages = cache(async (): Promise<Page[]> => {
    return (await readJson(PAGES_DB_PATH)) || [];
});

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
    const pages = await getPages();
    return pages.find(p => p.slug.en === slug || p.slug.es === slug);
}

export async function savePage(page: Page) {
    const pages = await getPages();
    const index = pages.findIndex(p => p.slug.en === page.slug.en);

    if (index >= 0) {
        pages[index] = page;
    } else {
        pages.push(page);
    }

    await fs.writeFile(PAGES_DB_PATH, JSON.stringify(pages, null, 4));
}

export async function deletePage(slug: string) {
    const pages = await getPages();
    const newPages = pages.filter(p => p.slug.en !== slug && p.slug.es !== slug);
    await fs.writeFile(PAGES_DB_PATH, JSON.stringify(newPages, null, 4));
}

// --- BLOG ---

export interface BlogPost {
    id: string;
    slug: string;
    title: { en: string; es: string; };
    excerpt: { en: string; es: string; };
    content: { en: string; es: string; };
    date: string; // For compatibility, mapped from publishedAt
    publishedAt?: string;
    author: string;
    imageUrl: string;
    category: string;
}

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('BlogPost')
            .select('*')
            .order('publishedAt', { ascending: false });

        if (error) throw error;

        // Map publishedAt to date for compatibility
        return (data || []).map(post => ({
            ...post,
            date: post.publishedAt
        }));
    } catch (error) {
        console.error("Error fetching blog posts from DB:", error);
        return [];
    }
});

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('BlogPost')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data ? { ...data, date: data.publishedAt } : undefined;
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return undefined;
    }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('BlogPost')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data ? { ...data, date: data.publishedAt } : undefined;
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return undefined;
    }
}

export async function saveBlogPost(post: BlogPost) {
    const supabase = await createClient();
    const { date, ...postData } = post;
    const { error } = await supabase
        .from('BlogPost')
        .upsert({
            ...postData,
            publishedAt: post.publishedAt || post.date
        });

    if (error) throw error;
}

export async function deleteBlogPost(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('BlogPost')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// --- SUBSCRIBERS ---

import { createClient } from "@/lib/supabase/server";

export interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
}

export const getSubscribers = cache(async (): Promise<Subscriber[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('Subscriber')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching subscribers from DB:", error);
        return [];
    }
});

// We don't save subscribers via this file anymore, it's done directly in the form action or API
// But keeping a compatible signature if needed, or just removing it.
// The previous saveSubscriber used to write to JSON. We can remove it or update it.
// For now, let's remove the file-based save logic as it is not used by the new form.

// --- CATEGORIES ---

export const getBlogCategories = cache(async (): Promise<string[]> => {
    return (await readJson(CATEGORIES_DB_PATH)) || [];
});

export async function saveBlogCategory(category: string) {
    const categories = await getBlogCategories();
    if (categories.includes(category)) return;

    categories.push(category);
    await fs.writeFile(CATEGORIES_DB_PATH, JSON.stringify(categories.sort(), null, 4));
}

export async function deleteBlogCategory(category: string) {
    const categories = await getBlogCategories();
    const newCategories = categories.filter(c => c !== category);
    await fs.writeFile(CATEGORIES_DB_PATH, JSON.stringify(newCategories, null, 4));
}

// --- TRANSLATIONS (Dynamic) ---

export interface TranslationsDB {
    [key: string]: {
        en: string;
        es: string;
    }
}

const TRANSLATIONS_DB_PATH = path.join(process.cwd(), "src/lib/translations.json");

export const getDynamicTranslations = cache(async (): Promise<TranslationsDB> => {
    return (await readJson(TRANSLATIONS_DB_PATH)) || {};
});

export async function saveDynamicTranslation(key: string, en: string, es: string) {
    const translations = await getDynamicTranslations();
    translations[key] = { en, es };
    await fs.writeFile(TRANSLATIONS_DB_PATH, JSON.stringify(translations, null, 4));
}

export async function deleteDynamicTranslation(key: string) {
    const translations = await getDynamicTranslations();
    if (translations[key]) {
        delete translations[key];
        await fs.writeFile(TRANSLATIONS_DB_PATH, JSON.stringify(translations, null, 4));
    }
}

// --- SETTINGS ---

export interface Settings {
    socials: {
        facebook: string;
        instagram: string;
        telegram: string;
    }
}

const DEFAULT_SETTINGS: Settings = {
    socials: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        telegram: "https://t.me"
    }
};

export const getSettings = cache(async (): Promise<Settings> => {
    return (await readJson(SETTINGS_DB_PATH)) || DEFAULT_SETTINGS;
});

export async function saveSettings(settings: Settings) {
    await fs.writeFile(SETTINGS_DB_PATH, JSON.stringify(settings, null, 4));
}
