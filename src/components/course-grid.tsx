"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CourseDB } from "@/lib/db";
import { CourseCard } from "@/components/course-card";
import { fetchMoreCourses } from "@/actions/get-courses-action";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CourseGridProps {
    initialCourses: CourseDB[];
    filters: {
        category?: string;
        language?: string;
        minPrice?: number;
        maxPrice?: number;
    };
}

export function CourseGrid({ initialCourses, filters }: CourseGridProps) {
    const t = useTranslations("Courses");
    const [courses, setCourses] = useState<CourseDB[]>(initialCourses);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [ref, inView] = useInView();

    // Reset when details change (filters changed from parent)
    useEffect(() => {
        setCourses(initialCourses);
        setPage(1);
        setHasMore(true); // Reset hasMore assuming there might be more if filters change, though parent handles initial load.
        // Actually, if initialCourses < pageSize, hasMore is false.
        if (initialCourses.length < 12) setHasMore(false);
    }, [initialCourses]);

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadMore();
        }
    }, [inView, hasMore, isLoading]);

    const loadMore = async () => {
        setIsLoading(true);
        const nextPage = page + 1;
        try {
            const newCourses = await fetchMoreCourses(nextPage, filters);

            if (newCourses.length === 0) {
                setHasMore(false);
            } else {
                setCourses((prev) => [...prev, ...newCourses]);
                setPage(nextPage);
                if (newCourses.length < 12) setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more courses", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (courses.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">{t('noResults')}</p>
                <p className="text-sm mt-2">{t('tryAdjusting')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <div key={course.id} className="flex flex-col">
                        <CourseCard course={course} />
                    </div>
                ))}
            </div>

            {/* Load More Trigger */}
            {hasMore && (
                <div ref={ref} className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                </div>
            )}

            {!hasMore && courses.length > 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    {t('endOfList')}
                </div>
            )}
        </div>
    );
}
