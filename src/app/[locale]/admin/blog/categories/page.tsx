import { getBlogCategories } from "@/lib/db";
import { Plus, Trash2, ChevronLeft, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { addCategoryAction, deleteCategoryAction } from "@/actions/category-actions";
import { FadeIn } from "@/components/animations";

export default async function AdminCategoriesPage() {
    const categories = await getBlogCategories();

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="h-10 w-10 flex items-center justify-center bg-card border rounded-full hover:bg-muted transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Manage Categories</h1>
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <Tag className="h-3 w-3 text-primary" /> Blog Filtering Labels
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add Category Form */}
                <FadeIn className="bg-card border rounded-3xl p-8 shadow-sm space-y-6 border-t-4 border-t-primary">
                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" /> Add New Category
                    </h3>
                    <form action={addCategoryAction} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category Name</label>
                            <input
                                name="category"
                                required
                                placeholder="e.g. Technical Analysis"
                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98"
                        >
                            Create Category
                        </button>
                    </form>
                </FadeIn>

                {/* Categories List */}
                <FadeIn delay={0.1} className="bg-card border rounded-3xl p-8 shadow-sm space-y-6">
                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" /> Active Categories
                    </h3>
                    <div className="space-y-3">
                        {categories.map((cat) => (
                            <div key={cat} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/50 transition-all">
                                <span className="font-bold text-sm">{cat}</span>
                                <form action={deleteCategoryAction.bind(null, cat)}>
                                    <button
                                        type="submit"
                                        className="h-8 w-8 flex items-center justify-center rounded-lg text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                                        title="Delete Category"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground italic text-sm">
                                No categories defined yet.
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h4 className="font-black text-primary text-xs uppercase tracking-widest mb-1">Pro Tip</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Categories are case-sensitive and will appear in the blog filter precisely as written here. Keep them short and high-impact.
                    </p>
                </div>
            </div>
        </div>
    );
}
