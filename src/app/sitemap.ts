
import { MetadataRoute } from 'next';
import { getFirms, getBlogPosts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tradingdiscounts.com'; // Fallback to example if not set
    const locales = ['en', 'es'];

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/forex',
        '/futures',
        '/crypto',
        '/blog',
        '/contact',
        '/about',
        '/compare'
    ];

    const staticEntries = staticRoutes.flatMap(route => {
        return locales.map(locale => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1.0 : 0.8,
        }));
    });

    // 2. Dynamic Firms
    const firms = await getFirms();
    const firmEntries = firms.flatMap(firm => {
        return locales.map(locale => ({
            url: `${baseUrl}/${locale}/firms/${firm.id}`,
            lastModified: new Date(), // Ideally this would come from firm.updatedAt if available
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));
    });

    // 3. Dynamic Blog Posts
    const posts = await getBlogPosts();
    const blogEntries = posts.flatMap(post => {
        return locales.map(locale => ({
            url: `${baseUrl}/${locale}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
    });

    return [
        ...staticEntries,
        ...firmEntries,
        ...blogEntries,
    ];
}
