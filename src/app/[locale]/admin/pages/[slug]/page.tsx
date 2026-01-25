import { getPageBySlug } from "@/lib/db";
import { PageForm } from "@/components/page-form";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) notFound();

    return (
        <div className="container mx-auto py-10">
            <PageForm page={page} />
        </div>
    );
}
