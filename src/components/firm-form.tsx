"use client";

import { saveFirmAction } from "@/actions/firm-actions";
import { extractFirmDataFromURL } from "@/actions/ai-actions";
import { PropFirm } from "@/lib/data";
import { ChevronLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
// import { parseBilingual, parseBilingualArray } from "@/lib/utils"; // Removed to use local robust version

function SubmitButton({ loading }: { loading: boolean }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        >
            {loading ? "Guardando..." : "Guardar Firma"} <Save className="ml-2 h-4 w-4" />
        </button>
    );
}

// Local robust parser to handle stubborn JSON strings
function safeParseBilingual(val: any, locale: string): string {
    if (!val) return "";

    let current = val;
    let attempts = 0;

    try {
        while (attempts < 5) {
            if (typeof current === 'string' && (current.trim().startsWith('{') || current.trim().startsWith('"'))) {
                try {
                    current = JSON.parse(current);
                } catch {
                    // JSON parse failed. Tries Regex fallback.
                    // Handles:
                    // 1. "en": "..."
                    // 2. en: "..." (no key quotes)
                    // 3. 'en': '...' (single quotes)
                    // 4. Multiline content

                    // Regex explanation:
                    // (?:["']?) -> Optional opening quote for key
                    // ${locale} -> The key (en/es)
                    // (?:["']?) -> Optional closing quote for key
                    // \s*:\s* -> Separator
                    // (["']) -> Capture opening quote for value (group 1)
                    // ([\s\S]*?) -> Capture content non-greedy (group 2)
                    // \1 -> Match the same closing quote as group 1
                    // (?=\s*(?:,|})) -> Lookahead for separator or end

                    const regex = new RegExp(`(?:["']?)${locale}(?:["']?)\\s*:\\s*(["'])([\\s\\S]*?)\\1(?=\\s*(?:,|}|\\s$))`);
                    const match = regex.exec(current);

                    if (match && match[2]) {
                        // Unescape basic stuff
                        return match[2].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\r/g, '');
                    }
                    break;
                }
            } else if (typeof current === 'object' && current !== null) {
                const candidate = current[locale as "en" | "es"] || current.en || current.es;
                if (candidate !== undefined) {
                    current = candidate;
                } else {
                    break;
                }
            } else {
                break;
            }
            attempts++;
        }
    } catch (e) {
        console.error("Safe parser error:", e);
    }

    if (typeof current === 'object') return ""; // Never return object/JSON
    return String(current);
}

function safeParseArray(val: any, locale: string): string[] {
    // Reuse logic roughly but simpler for arrays
    const res = safeParseBilingual(val, locale);
    // If it returns a string that looks like a split list, fine. 
    // But `safeParseBilingual` might have returned the ARRAY if it found it?
    // No, the above logic converts to string at the end.
    // We need inspection.

    if (Array.isArray(val)) return val;

    // Note: This matches the previous behavior but let's be careful.
    // If val is {en: ["a","b"]}, safeParseBilingual returns "a,b" (join)? NO.

    // Let's implement a specific array parser
    let current = val;
    if (!current) return [];

    try {
        // simplified peel
        if (typeof current === 'string') {
            try { current = JSON.parse(current); } catch { }
        }
        if (typeof current === 'string') {
            try { current = JSON.parse(current); } catch { }
        }

        if (typeof current === 'object' && !Array.isArray(current) && current !== null) {
            current = current[locale as "en" | "es"] || current.en || current.es;
        }

        if (Array.isArray(current)) return current;
    } catch { }

    return [];
}

export function FirmForm({ firm }: { firm?: PropFirm }) {
    const [activeTab, setActiveTab] = useState("basic");
    const [langTab, setLangTab] = useState<"en" | "es">("en");
    const [autoFillUrl, setAutoFillUrl] = useState("");

    // Helpers for safety
    // Removed local helpers in favor of robust utils
    const [isExtracting, setIsExtracting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleAutoFill = async () => {
        if (!autoFillUrl.trim()) {
            alert("Please enter a URL");
            return;
        }

        setIsExtracting(true);
        try {
            const result = await extractFirmDataFromURL(autoFillUrl);

            if (!result.success || !result.data) {
                alert(`Error: ${result.error || "Failed to extract data"}`);
                return;
            }

            const data = result.data;
            const form = formRef.current;
            if (!form) return;

            // Helper to set form values
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const setValue = (name: string, value: any) => {
                const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
                if (input) {
                    if (input.type === 'checkbox') {
                        (input as HTMLInputElement).checked = !!value;
                    } else if (Array.isArray(value)) {
                        input.value = value.join(", ");
                    } else if (value !== null && value !== undefined) {
                        input.value = value.toString();
                    }
                }
            };

            // Helper for fields
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const setBilingualValue = (baseName: string, value: any) => {
                if (!value) return;

                // Case 1: Value is a bilingual object { en: ..., es: ... }
                if (typeof value === 'object' && !Array.isArray(value)) {
                    if (value.en) setValue(`${baseName}_en`, value.en);
                    if (value.es) setValue(`${baseName}_es`, value.es);
                }
                // Case 2: Value is a plain array (legacy or single-lang) -> assume English or both?
                // Actually, for bilingual fields we expect the object. 
                // But if we get a raw array, maybe just put it in EN as fallback?
                else if (Array.isArray(value)) {
                    setValue(`${baseName}_en`, value);
                }
                // Case 3: Simple string
                else {
                    setValue(`${baseName}_en`, value);
                }
            };

            // Fill all fields
            if (data.name) setValue("name", data.name);

            // Bilingual Fields
            if (data.description) setBilingualValue("description", data.description);
            if (data.features) setBilingualValue("features", data.features);
            if (data.rules) setBilingualValue("rules", data.rules);
            if (data.consistencyRules) setBilingualValue("consistencyRules", data.consistencyRules);
            if (data.prohibitedPractices) setBilingualValue("prohibitedPractices", data.prohibitedPractices);

            // Standard Fields
            if (data.rating) setValue("rating", data.rating);
            if (data.trustpilotScore) setValue("trustpilotScore", data.trustpilotScore);
            if (data.country) setValue("country", data.country);
            if (data.activeYears) setValue("activeYears", data.activeYears);
            if (data.maxAllocation) setValue("maxAllocation", data.maxAllocation);
            if (data.broker) setValue("broker", data.broker);
            if (data.categories) setValue("categories", data.categories);
            if (data.platforms) setValue("platforms", data.platforms);
            if (data.instruments) setValue("instruments", data.instruments);
            if (data.assets) setValue("assets", data.assets);
            if (data.minPrice) setValue("minPrice", data.minPrice);
            if (data.maxLeverage) setValue("maxLeverage", data.maxLeverage);
            if (data.drawdownType) setValue("drawdownType", data.drawdownType);
            if (data.paymentMethods) setValue("paymentMethods", data.paymentMethods);
            if (data.payoutMethods) setValue("payoutMethods", data.payoutMethods);
            if (data.payoutFrequency) setValue("payoutFrequency", data.payoutFrequency);
            if (data.minPayout) setValue("minPayout", data.minPayout);

            alert("✨ Form auto-filled successfully! Please review and adjust as needed.");
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            alert(`Error: ${error.message}`);
        } finally {
            setIsExtracting(false);
        }
    };

    const tabs = [
        { id: "basic", label: "Información Básica" },
        { id: "details", label: "Detalles" },
        { id: "trading", label: "Trading" },
        { id: "payout", label: "Pagos" },
    ];

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            console.log("Submitting firm form...");
            await saveFirmAction(formData);
            router.push("/admin");
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error al guardar la firma. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const descEnRef = useRef<HTMLTextAreaElement>(null);
    const descEsRef = useRef<HTMLTextAreaElement>(null);

    const handleCleanText = (locale: "en" | "es") => {
        const ref = locale === "en" ? descEnRef : descEsRef;
        if (!ref.current) return;

        const currentVal = ref.current.value;
        if (!currentVal) return;

        // Aggressive cleanup: Extract content between "locale": "..." or just the value if simple
        // Regex to find "en": "VALUE", capturing VALUE. Handles newlines.
        const regex = new RegExp(`(?:["']?)${locale}(?:["']?)\\s*:\\s*(["'])([\\s\\S]*?)\\1(?=\\s*(?:,|}|\\s$))`);
        const match = regex.exec(currentVal);

        if (match && match[2]) {
            // Clean up escaped chars
            const clean = match[2].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\r/g, '');
            ref.current.value = clean;
        } else {
            // If regex fails, maybe it's Double JSON encoded? e.g. "{\"en\": ...}"
            // Try to parse as JSON first then extract
            try {
                const parsed = JSON.parse(currentVal);
                if (typeof parsed === 'object' && parsed !== null) {
                    const candidate = parsed[locale] || parsed.en || parsed.es;
                    if (candidate) {
                        ref.current.value = candidate;
                        return;
                    }
                } else if (typeof parsed === 'string') {
                    // It was a stringified string? Try regex on that
                    const match2 = regex.exec(parsed);
                    if (match2 && match2[2]) {
                        const clean = match2[2].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\r/g, '');
                        ref.current.value = clean;
                        return;
                    }
                }
            } catch { }

            // If all else fails, do nothing (or maybe clear it? No, unsafe).
            alert("No pude limpiar el texto automáticamente. ¿Quizás ya está limpio?");
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-6xl">
            <input type="hidden" name="id" value={firm?.id || ""} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">{firm ? "Editar Firma" : "Nueva Firma"}</h1>
                </div>
                <SubmitButton loading={loading} />
            </div>

            {/* AI Auto-Fill Section */}
            <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-6 md:p-8">
                <div className="flex items-start gap-4">
                    <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">✨ AI Auto-Fill</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {firm
                                ? "Actualiza los datos de esta firma pegando la URL de su sitio web y dejando que la IA extraiga la información más reciente."
                                : "Pega la URL del sitio web de la firma y deja que la IA extraiga toda la información automáticamente."
                            }
                        </p>
                        <div className="flex gap-3">
                            <input
                                type="url"
                                value={autoFillUrl}
                                onChange={(e) => setAutoFillUrl(e.target.value)}
                                placeholder="https://apextraderfunding.com/"
                                className="flex-1 rounded-md border bg-background px-4 py-2"
                                disabled={isExtracting}
                            />
                            <button
                                type="button"
                                onClick={handleAutoFill}
                                disabled={isExtracting}
                                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isExtracting ? (
                                    <>Extrayendo...</>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {firm ? "Actualizar Datos" : "Auto-Rellenar"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground w-full text-right">La IA usará su conocimiento si la web falla.</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b flex items-center justify-between">
                <nav className="flex gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="flex bg-muted rounded-lg p-1 mb-1">
                    <button
                        type="button"
                        onClick={() => setLangTab("en")}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${langTab === "en" ? "bg-background shadow-sm font-bold text-primary" : "text-muted-foreground hover:text-primary/70"}`}
                    >
                        Inglés
                    </button>
                    <button
                        type="button"
                        onClick={() => setLangTab("es")}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${langTab === "es" ? "bg-background shadow-sm font-bold text-primary" : "text-muted-foreground hover:text-primary/70"}`}
                    >
                        Español
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* Basic Info Tab */}
                <div className={activeTab === "basic" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Contenido</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre de la Firma *</label>
                                    <input name="name" defaultValue={firm?.name} required className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. Apex Trader" />
                                </div>

                                <div className={langTab === "en" ? "block" : "hidden"}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium">Description (EN) *</label>
                                                <button type="button" onClick={() => handleCleanText('en')} className="text-xs bg-secondary px-2 py-1 rounded hover:bg-secondary/80 flex items-center gap-1">
                                                    🧹 Limpiar Texto
                                                </button>
                                            </div>
                                            <textarea
                                                ref={descEnRef}
                                                name="description_en"
                                                defaultValue={safeParseBilingual(firm?.description, 'en')}
                                                required={langTab === "en"}
                                                rows={8}
                                                className="w-full rounded-md border bg-background px-3 py-2"
                                                placeholder="Marketing summary in English..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={langTab === "es" ? "block" : "hidden"}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium">Descripción (ES) *</label>
                                                <button type="button" onClick={() => handleCleanText('es')} className="text-xs bg-secondary px-2 py-1 rounded hover:bg-secondary/80 flex items-center gap-1">
                                                    🧹 Limpiar Texto
                                                </button>
                                            </div>
                                            <textarea
                                                ref={descEsRef}
                                                name="description_es"
                                                defaultValue={safeParseBilingual(firm?.description, 'es')}
                                                required={langTab === "es"}
                                                rows={8}
                                                className="w-full rounded-md border bg-background px-3 py-2"
                                                placeholder="Resumen de marketing en español..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Enlace de Afiliado *</label>
                                <input name="link" defaultValue={firm?.link} required type="url" className="w-full rounded-md border bg-background px-3 py-2" placeholder="https://..." />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">URL del Logo</label>
                                <input name="imageUrl" defaultValue={firm?.imageUrl || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="https://.../logo.png" />
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Descuento y Métricas</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Etiqueta de Descuento *</label>
                                    <input name="discount" defaultValue={firm?.discount} required className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. 90% OFF" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Código *</label>
                                    <input name="code" defaultValue={firm?.code} required className="w-full rounded-md border bg-background px-3 py-2 font-mono" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Puntuación (0-5) *</label>
                                    <input name="rating" defaultValue={firm?.rating} type="number" step="0.1" max="5" required className="w-full rounded-md border bg-background px-3 py-2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Puntuación Trustpilot</label>
                                    <input name="trustpilotScore" defaultValue={firm?.trustpilotScore?.toString() || ""} type="number" step="0.1" max="5" className="w-full rounded-md border bg-background px-3 py-2" />
                                </div>
                            </div>

                            <div className="space-y-2 flex items-center pt-4">
                                <input type="checkbox" name="featured" id="featured" defaultChecked={firm?.featured} className="h-4 w-4" />
                                <label htmlFor="featured" className="text-sm font-medium ml-2">⭐ Destacado (Mostrar primero)</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Firm Details Tab */}
                <div className={activeTab === "details" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Detalles de la Empresa</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">País</label>
                                <input name="country" defaultValue={firm?.country || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. US, UK, VC" />
                                <p className="text-xs text-muted-foreground">Código de país o bandera emoji</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Años Activa</label>
                                <input name="activeYears" defaultValue={firm?.activeYears?.toString() || ""} type="number" className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. 3" />
                                <p className="text-xs text-muted-foreground">Years in operation</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Asignación Máxima</label>
                                <input name="maxAllocation" defaultValue={firm?.maxAllocation || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. $2,000,000" />
                                <p className="text-xs text-muted-foreground">Tamaño máximo de cuenta</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bróker</label>
                                <input name="broker" defaultValue={firm?.broker || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. Blueberry Markets" />
                                <p className="text-xs text-muted-foreground">Nombre del bróker subyacente</p>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Categorías y Plataformas</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categorías *</label>
                                <input name="categories" defaultValue={firm?.categories?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="crypto, forex, futures" />
                                <p className="text-xs text-muted-foreground">Separado por comas: crypto, forex, futures, stocks</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Plataformas *</label>
                                <input name="platforms" defaultValue={firm?.platforms?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="MT4, MT5, cTrader" />
                                <p className="text-xs text-muted-foreground">Separado por comas</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Instrumentos</label>
                                <input name="instruments" defaultValue={firm?.instruments?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="CFD, Stocks, Futures" />
                                <p className="text-xs text-muted-foreground">Separado por comas</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Activos</label>
                                <input name="assets" defaultValue={firm?.assets?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Crypto, Metals, FX, Indices" />
                                <p className="text-xs text-muted-foreground">Separado por comas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trading Info Tab */}
                <div className={activeTab === "trading" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Parámetros de Trading</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Precio Mín ($) *</label>
                                <input name="minPrice" defaultValue={firm?.minPrice} type="number" className="w-full rounded-md border bg-background px-3 py-2" />
                                <p className="text-xs text-muted-foreground">Precio mínimo del challenge</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Apalancamiento Máx *</label>
                                <input name="maxLeverage" defaultValue={firm?.maxLeverage} className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. 1:100" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de Drawdown *</label>
                                <select name="drawdownType" defaultValue={firm?.drawdownType} className="w-full rounded-md border bg-background px-3 py-2">
                                    <option value="Trailing">Trailing</option>
                                    <option value="Static">Static</option>
                                    <option value="Balance-based">Balance-based</option>
                                    <option value="Step-based">Step-based</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Características y Reglas</h2>

                            <div className={langTab === "en" ? "block" : "hidden"}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Features (EN) *</label>
                                        <textarea
                                            name="features_en"
                                            defaultValue={safeParseArray(firm?.features, 'en').join(", ")}
                                            rows={3}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            placeholder="Feature 1, Feature 2..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Rules (EN) *</label>
                                        <textarea
                                            name="rules_en"
                                            defaultValue={safeParseArray(firm?.rules, 'en').join(", ")}
                                            rows={3}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            placeholder="Rule 1, Rule 2..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={langTab === "es" ? "block" : "hidden"}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Características (ES) *</label>
                                        <textarea
                                            name="features_es"
                                            defaultValue={safeParseArray(firm?.features, 'es').join(", ")}
                                            rows={3}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            placeholder="Característica 1, Característica 2..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Reglas (ES) *</label>
                                        <textarea
                                            name="rules_es"
                                            defaultValue={safeParseArray(firm?.rules, 'es').join(", ")}
                                            rows={3}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            placeholder="Regla 1, Regla 2..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout & Rules Tab */}
                <div className={activeTab === "payout" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Información de Pagos</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Métodos de Compra *</label>
                                <input name="paymentMethods" defaultValue={firm?.paymentMethods?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Credit Card, Crypto, Wire Transfer" />
                                <p className="text-xs text-muted-foreground">Métodos para comprar el challenge</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Métodos de Retiro</label>
                                <input name="payoutMethods" defaultValue={firm?.payoutMethods?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Crypto, Riseworks, Wire Transfer" />
                                <p className="text-xs text-muted-foreground">Métodos para retirar ganancias</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Frecuencia de Retiro</label>
                                <input name="payoutFrequency" defaultValue={firm?.payoutFrequency || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. 14 días, Bi-semanal" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Retiro Mínimo</label>
                                <input name="minPayout" defaultValue={firm?.minPayout || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. $100" />
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Reglas Detalladas</h2>

                            <div className={langTab === "en" ? "block" : "hidden"}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Consistency Rules (EN)</label>
                                        <textarea
                                            name="consistencyRules_en"
                                            defaultValue={safeParseArray(firm?.consistencyRules, 'en').join(", ")}
                                            rows={4}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            placeholder="Rule 1, Rule 2..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Prohibited Practices (EN)</label>
                                        <textarea
                                            name="prohibitedPractices_en"
                                            defaultValue={safeParseArray(firm?.prohibitedPractices, 'en').join(", ")}
                                            rows={4}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            placeholder="Practice 1, Practice 2..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={langTab === "es" ? "block" : "hidden"}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Reglas de Consistencia (ES)</label>
                                        <textarea
                                            name="consistencyRules_es"
                                            defaultValue={safeParseArray(firm?.consistencyRules, 'es').join(", ")}
                                            rows={4}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            placeholder="Regla 1, Regla 2..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Prácticas Prohibidas (ES)</label>
                                        <textarea
                                            name="prohibitedPractices_es"
                                            defaultValue={safeParseArray(firm?.prohibitedPractices, 'es').join(", ")}
                                            rows={4}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                            placeholder="Práctica 1, Práctica 2..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form >
    );
}
