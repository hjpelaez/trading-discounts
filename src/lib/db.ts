import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { PropFirm } from "@/lib/data";
import { cache } from "react";

// Force dynamic execution for data fetching to ensure fresh data
export const dynamic = 'force-dynamic';

// --- FIRMS ---

export const getFirms = cache(async (): Promise<PropFirm[]> => {
    try {
        const supabase = createStaticClient();
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
        const supabase = createStaticClient();
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
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from('Page')
            .select('*');

        if (error) throw error;
        return (data || []).map(p => ({
            slug: p.slugMap,
            title: p.title,
            content: p.content,
            lastUpdated: p.lastUpdated
        }));
    } catch (error) {
        console.error("Error fetching pages from DB:", error);
        return [];
    }
});

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from('Page')
            .select('*')
            .or(`slugMap->>en.eq.${slug},slugMap->>es.eq.${slug}`)
            .single();

        if (error) throw error;
        return data ? {
            slug: data.slugMap,
            title: data.title,
            content: data.content,
            lastUpdated: data.lastUpdated
        } : undefined;
    } catch (error) {
        console.error("Error fetching page:", error);
        return undefined;
    }
}

export async function savePage(page: Page) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('Page')
        .upsert({
            slug: page.slug.en,
            slugMap: page.slug,
            title: page.title,
            content: page.content,
            lastUpdated: new Date().toISOString()
        });

    if (error) throw error;
}

export async function deletePage(slug: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('Page')
        .delete()
        .eq('slug', slug);

    if (error) throw error;
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
        const supabase = createStaticClient();
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
        const supabase = createStaticClient();
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
        const supabase = createStaticClient();
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

export interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
}

export const getSubscribers = cache(async (): Promise<Subscriber[]> => {
    try {
        const supabase = createStaticClient();
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

// --- CATEGORIES ---

export const getBlogCategories = cache(async (): Promise<string[]> => {
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from('BlogCategory')
            .select('name');

        if (error) throw error;
        return (data || []).map(c => c.name);
    } catch (error) {
        console.error("Error fetching blog categories:", error);
        return [];
    }
});

export async function saveBlogCategory(category: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('BlogCategory')
        .upsert({ name: category });

    if (error) throw error;
}

export async function deleteBlogCategory(category: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('BlogCategory')
        .delete()
        .eq('name', category);

    if (error) throw error;
}

// --- TRANSLATIONS (Dynamic) ---

export interface TranslationsDB {
    [key: string]: {
        en: string;
        es: string;
    }
}

export const getDynamicTranslations = cache(async (): Promise<TranslationsDB> => {
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from('DynamicTranslation')
            .select('*');

        if (error) throw error;

        const translations: TranslationsDB = {};
        (data || []).forEach(row => {
            translations[row.key] = { en: row.en, es: row.es };
        });
        return translations;
    } catch (error) {
        console.error("Error fetching dynamic translations:", error);
        return {};
    }
});

export async function saveDynamicTranslation(key: string, en: string, es: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('DynamicTranslation')
        .upsert({ key, en, es, updatedAt: new Date().toISOString() });

    if (error) throw error;
}

export async function deleteDynamicTranslation(key: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('DynamicTranslation')
        .delete()
        .eq('key', key);

    if (error) throw error;
}

// --- COURSES ---

export interface CourseDB {
    id: string;
    title: { en: string; es: string };
    description: { en: string; es: string };
    instructor: string;
    link: string;
    imageUrl?: string | null;
    platform: string;
    rating: number;
    duration?: string;
    featured?: boolean;
    level: string;
    language: string;
    category: string;
    priceLabel: string;
    priceMin?: number;
    priceMax?: number;
    learningPoints?: { en: string[]; es: string[] };
    curriculum?: any[]; // JSON
}

export const getCourses = cache(async (filters?: { category?: string; language?: string; minPrice?: number; maxPrice?: number; page?: number; pageSize?: number }): Promise<CourseDB[]> => {
    try {
        const supabase = createStaticClient();
        let query = supabase
            .from('Course')
            .select('*')
            .order('featured', { ascending: false })
            .order('rating', { ascending: false });

        if (filters?.category && filters.category !== 'All') {
            query = query.ilike('category', filters.category);
        }

        if (filters?.language && filters.language !== 'All') {
            query = query.eq('language', filters.language);
        }

        if (filters?.minPrice !== undefined) {
            query = query.gte('priceMin', filters.minPrice);
        }

        if (filters?.maxPrice !== undefined) {
            query = query.lte('priceMin', filters.maxPrice);
        }

        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 12;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        query = query.range(from, to);

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching courses from DB:", error);
        return [];
    }
});

export async function getCourseById(id: string): Promise<CourseDB | undefined> {
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from('Course')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data || undefined;
    } catch (error) {
        console.error("Error fetching course:", error);
        return undefined;
    }
}

export async function saveCourse(course: CourseDB) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('Course')
        .upsert({
            ...course,
            updatedAt: new Date().toISOString()
        });

    if (error) throw error;
}

export async function deleteCourse(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('Course')
        .delete()
        .eq('id', id);

    if (error) throw error;
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
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from('Setting')
            .select('*')
            .eq('id', 'default')
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        return data ? { socials: data.socials } : DEFAULT_SETTINGS;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return DEFAULT_SETTINGS;
    }
});

export async function saveSettings(settings: Settings) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('Setting')
        .upsert({ id: 'default', socials: settings.socials, updatedAt: new Date().toISOString() });

    if (error) throw error;
}
