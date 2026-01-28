import { getCourses } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { FadeIn } from "@/components/animations";
import { getTranslations } from "next-intl/server";
import { CourseFilterBar } from "@/components/course-filter-bar";
import { CourseGrid } from "@/components/course-grid";

export const dynamic = 'force-dynamic';

export default async function CoursesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const tHome = await getTranslations("Home");
    const tCommon = await getTranslations("Common");
    const resolvedParams = await searchParams;

    const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
    const language = typeof resolvedParams.language === 'string' ? resolvedParams.language : undefined;
    const minPrice = typeof resolvedParams.minPrice === 'string' ? parseInt(resolvedParams.minPrice) : undefined;
    const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseInt(resolvedParams.maxPrice) : undefined;

    const filters = {
        category,
        language,
        minPrice,
        maxPrice,
        pageSize: 12
    };

    const initialCourses = await getCourses(filters);

    return (
        <div className="container mx-auto py-24 px-4 md:px-6">
            <div className="mb-12">
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4">
                    Trading <span className="text-primary">Courses</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                    Master the markets with our curated selection of top-rated trading courses.
                </p>
            </div>

            <FadeIn className="flex flex-col gap-6 mb-8 mt-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <h2 className="text-3xl font-bold tracking-tight">{tHome('topDeals')}</h2>
                    <SearchInput placeholder={tCommon('searchCoursesPlaceholder')} />
                </div>
                <CourseFilterBar />
            </FadeIn>

            <CourseGrid initialCourses={initialCourses} filters={filters} />
        </div>
    );
}
