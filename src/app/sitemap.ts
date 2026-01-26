import { getBlogPosts, getCourses, getFirms, getPages } from "@/lib/db";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.propfirmmatch.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const firms = await getFirms();
    const blogPosts = await getBlogPosts();
    const courses = await getCourses({ pageSize: 1000 }); // Get all courses
    const pages = await getPages();

    const locales = ['en', 'es'];

    // Static routes
    const staticRoutes = [
        '',
        '/blog',
        '/courses',
        '/compare',
        '/contact',
        '/forex',
        '/crypto',
        '/futures'
    ];

    const sitemap: MetadataRoute.Sitemap = [];

    // 1. Static Pages
    staticRoutes.forEach(route => {
        locales.forEach(locale => {
            sitemap.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    // 2. Firms (Dynamic)
    firms.forEach(firm => {
        locales.forEach(locale => {
            sitemap.push({
                url: `${baseUrl}/${locale}/firms/${firm.id}`,
                // PropFirm interface from config might not have dynamic dates, defaulting to now or daily
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        });
    });

    // 3. Blog Posts (Dynamic)
    blogPosts.forEach(post => {
        locales.forEach(locale => {
            sitemap.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    });

    // 4. Courses (Dynamic)
    courses.forEach(course => {
        locales.forEach(locale => {
            sitemap.push({
                url: `${baseUrl}/${locale}/courses/${course.id}`,
                lastModified: new Date(), // Courses don't have updatedAt in getCourses currently, default to now or add field
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        });
    });

    // 5. Custom Pages (Dynamic)
    pages.forEach(page => {
        // Pages usually have a slug map, assuming we use the english slug as ID or mapped
        // Actually page.slug is an object {en, es}. 
        locales.forEach(locale => {
            const slug = page.slug[locale as 'en' | 'es'];
            if (slug) {
                sitemap.push({
                    url: `${baseUrl}/${locale}/${slug}`, // Assuming these are root pages or we need a prefix?
                    // Typically 'admin/pages' manages pages. If they are rendered at root (e.g. /privacy), we use that.
                    // For now assuming root-level.
                    lastModified: new Date(page.lastUpdated),
                    changeFrequency: 'monthly',
                    priority: 0.5,
                });
            }
        });
    });

    return sitemap;
}
