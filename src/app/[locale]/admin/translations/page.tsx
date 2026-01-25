import { getDynamicTranslations } from "@/lib/db";
import { FadeIn } from "@/components/animations";
import { TranslationsManager } from "@/components/admin/translations-manager";
import path from "path";
import fs from "fs/promises";

// Utils
async function getSourceMessages() {
    const enPath = path.join(process.cwd(), "messages/en.json");
    const esPath = path.join(process.cwd(), "messages/es.json");

    const enRaw = JSON.parse(await fs.readFile(enPath, "utf-8"));
    const esRaw = JSON.parse(await fs.readFile(esPath, "utf-8"));

    return { en: enRaw, es: esRaw };
}

function flattenMessages(nestedMessages: Record<string, unknown>, prefix = ""): Record<string, string> {
    return Object.keys(nestedMessages).reduce((messages: Record<string, string>, key) => {
        const value = nestedMessages[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === "string") {
            Object.assign(messages, { [prefixedKey]: value });
        } else {
            Object.assign(messages, flattenMessages(value as Record<string, unknown>, prefixedKey));
        }

        return messages;
    }, {});
}

export default async function AdminTranslationsPage() {
    const dynamicTranslations = await getDynamicTranslations();
    const sourceMessages = await getSourceMessages();

    const flatEn = flattenMessages(sourceMessages.en);
    const flatEs = flattenMessages(sourceMessages.es);

    // Get all unique keys from both sources
    const allKeys = Array.from(new Set([...Object.keys(flatEn), ...Object.keys(flatEs)])).sort();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestor de Traducciones</h1>
                    <p className="text-muted-foreground">Gestiona todo el contenido de texto de la plataforma.</p>
                </div>
            </div>

            <FadeIn>
                <TranslationsManager
                    allKeys={allKeys}
                    flatEn={flatEn}
                    flatEs={flatEs}
                    dynamicTranslations={dynamicTranslations}
                />
            </FadeIn>
        </div>
    );
}
