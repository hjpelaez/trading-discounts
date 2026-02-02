import { LayoutDashboard, PlusCircle, Globe, FileText, Users, LogOut, GraduationCap, Building2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const t = await getTranslations({ locale: 'es', namespace: 'Admin' });

    if (!user) {
        redirect('/auth/login');
    }

    return (
        <ThemeProvider attribute="class" forcedTheme="dark">
            <div className="dark flex min-h-screen bg-background text-foreground">
                {/* Sidebar */}
                <aside className="w-64 bg-card border-r hidden md:flex flex-col">
                    <div className="p-6 border-b">
                        <Link href="/admin" className="font-bold text-xl flex items-center gap-2">
                            🛡️ Panel<span className="text-primary">Admin</span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <LayoutDashboard className="h-4 w-4" />
                            {t('dashboard')}
                        </Link>
                        <Link href="/admin/firms" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <Building2 className="h-4 w-4" />
                            {t('firms')}
                        </Link>
                        <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <FileText className="h-4 w-4" />
                            {t('pages')}
                        </Link>
                        <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <GraduationCap className="h-4 w-4" />
                            {t('courses')}
                        </Link>
                        <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <FileText className="h-4 w-4" />
                            {t('blog')}
                        </Link>
                        <Link href="/admin/subscribers" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <Users className="h-4 w-4" />
                            {t('subscribers')}
                        </Link>
                        <Link href="/admin/translations" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <Globe className="h-4 w-4" />
                            {t('translations')}
                        </Link>
                        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <Users className="h-4 w-4" />
                            {t('settings')}
                        </Link>
                        <div className="pt-4 pb-2 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                            {t('quickActions')}
                        </div>
                        <Link href="/admin/firms/new" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <PlusCircle className="h-4 w-4" />
                            {t('addFirm')}
                        </Link>
                        <Link href="/admin/courses/new" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <PlusCircle className="h-4 w-4" />
                            {t('addCourse')}
                        </Link>
                        <Link href="/admin/blog/new" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                            <PlusCircle className="h-4 w-4" />
                            {t('addPost')}
                        </Link>
                        <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            {t('viewSite')}
                        </Link>
                    </nav>

                    <div className="p-4 border-t">
                        <div className="flex items-center justify-between px-4 py-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.email}</span>
                                <span className="text-xs text-muted-foreground">Admin</span>
                            </div>
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                                    title={t('logout')}
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </ThemeProvider>
    );
}
