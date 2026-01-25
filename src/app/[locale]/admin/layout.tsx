import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PlusCircle, Globe, FileText, Users } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
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
                        Panel de Control
                    </Link>
                    <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                        <FileText className="h-4 w-4" />
                        Páginas
                    </Link>
                    <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                        <FileText className="h-4 w-4" />
                        Blog
                    </Link>
                    <Link href="/admin/subscribers" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                        <Users className="h-4 w-4" />
                        Suscriptores
                    </Link>
                    <Link href="/admin/translations" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                        <Globe className="h-4 w-4" />
                        Traducciones
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                        <Users className="h-4 w-4" />
                        Configuración
                    </Link>
                    <div className="pt-4 pb-2 px-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Acciones Rápidas
                    </div>
                    <Link href="/admin/firms/new" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
                        <PlusCircle className="h-4 w-4" />
                        Añadir Firma
                    </Link>
                    <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        Ver Sitio Web
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <UserButton showName />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
