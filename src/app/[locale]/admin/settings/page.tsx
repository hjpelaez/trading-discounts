import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/db";
import { Settings as SettingsIcon } from "lucide-react";

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <SettingsIcon className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Configuración Global</h1>
                    <p className="text-muted-foreground">Gestiona los enlaces a redes sociales y otros ajustes generales.</p>
                </div>
            </div>

            <SettingsForm initialSettings={settings} />
        </div>
    );
}
