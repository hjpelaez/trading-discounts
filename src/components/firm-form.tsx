"use client";

import { saveFirmAction } from "@/actions/firm-actions";
import { extractFirmDataFromURL } from "@/actions/ai-actions";
import { PropFirm } from "@/lib/data";
import { ChevronLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

function SubmitButton({ loading }: { loading: boolean }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        >
            {loading ? "Saving..." : "Save Firm"} <Save className="ml-2 h-4 w-4" />
        </button>
    );
}

export function FirmForm({ firm }: { firm?: PropFirm }) {
    const [activeTab, setActiveTab] = useState("basic");
    const [langTab, setLangTab] = useState<"en" | "es">("en");
    const [autoFillUrl, setAutoFillUrl] = useState("");
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
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    setValue(baseName, value.es || value.en || "");
                } else if (Array.isArray(value)) {
                    setValue(baseName, value.join(", "));
                } else {
                    setValue(baseName, value);
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
        { id: "basic", label: "Basic Info" },
        { id: "details", label: "Firm Details" },
        { id: "trading", label: "Trading Info" },
        { id: "payout", label: "Payout & Rules" },
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

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-6xl">
            <input type="hidden" name="id" value={firm?.id || ""} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">{firm ? `Edit ${firm.name}` : "New Firm"}</h1>
                </div>
                <SubmitButton loading={loading} />
            </div>

            {/* AI Auto-Fill Section */}
            <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-6">
                <div className="flex items-start gap-4">
                    <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">✨ AI Auto-Fill (Powered by Llama 3.3)</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {firm
                                ? "Update this firm's data by pasting their website URL and letting AI extract the latest information."
                                : "Paste the firm's website URL and let AI extract all the information automatically."
                            }
                        </p>
                        <div className="flex gap-3">
                            <input
                                type="url"
                                value={autoFillUrl}
                                onChange={(e) => setAutoFillUrl(e.target.value)}
                                placeholder="https://propfirmtrader.com/prop-firm/blueberry-funded"
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
                                    <>Extracting...</>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {firm ? "Update Data" : "Auto-Fill"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
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
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* Basic Info Tab */}
                <div className={activeTab === "basic" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Información Básica</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre de la Firma *</label>
                                <input name="name" defaultValue={firm?.name} required className="w-full rounded-md border bg-background px-3 py-2" placeholder="ej. Apex Trader" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descripción *</label>
                                <textarea
                                    name="description"
                                    defaultValue={typeof firm?.description === 'string' ? firm.description : (firm?.description as { en: string; es: string })?.en || ""}
                                    required
                                    rows={3}
                                    className="w-full rounded-md border bg-background px-3 py-2"
                                    placeholder="resumen de marketing..."
                                />
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
                                <label className="text-sm font-medium">Max Allocation</label>
                                <input name="maxAllocation" defaultValue={firm?.maxAllocation || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="e.g. $2,000,000" />
                                <p className="text-xs text-muted-foreground">Maximum account size</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Broker</label>
                                <input name="broker" defaultValue={firm?.broker || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="e.g. Blueberry Markets" />
                                <p className="text-xs text-muted-foreground">Underlying broker name</p>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Categories & Platforms</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categories *</label>
                                <input name="categories" defaultValue={firm?.categories?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="crypto, forex, futures" />
                                <p className="text-xs text-muted-foreground">Comma separated: crypto, forex, futures, stocks</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Platforms *</label>
                                <input name="platforms" defaultValue={firm?.platforms?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="MT4, MT5, cTrader" />
                                <p className="text-xs text-muted-foreground">Comma separated trading platforms</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Instruments</label>
                                <input name="instruments" defaultValue={firm?.instruments?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="CFD, Stocks, Futures" />
                                <p className="text-xs text-muted-foreground">Comma separated instrument types</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assets</label>
                                <input name="assets" defaultValue={firm?.assets?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Crypto, Metals, FX, Indices" />
                                <p className="text-xs text-muted-foreground">Comma separated asset classes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trading Info Tab */}
                <div className={activeTab === "trading" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Trading Parameters</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Min Price ($) *</label>
                                <input name="minPrice" defaultValue={firm?.minPrice} type="number" className="w-full rounded-md border bg-background px-3 py-2" />
                                <p className="text-xs text-muted-foreground">Minimum challenge price</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Max Leverage *</label>
                                <input name="maxLeverage" defaultValue={firm?.maxLeverage} className="w-full rounded-md border bg-background px-3 py-2" placeholder="e.g. 1:100" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Drawdown Type *</label>
                                <select name="drawdownType" defaultValue={firm?.drawdownType} className="w-full rounded-md border bg-background px-3 py-2">
                                    <option value="Trailing">Trailing</option>
                                    <option value="Static">Static</option>
                                    <option value="Balance-based">Balance-based</option>
                                    <option value="Step-based">Step-based</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Features & Rules</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Features *</label>
                                <textarea name="features" defaultValue={firm?.features?.join(", ") || ""} rows={3} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Features (comma separated)" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rules *</label>
                                <textarea name="rules" defaultValue={firm?.rules?.join(", ") || ""} rows={3} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Rules (comma separated)" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout & Rules Tab */}
                <div className={activeTab === "payout" ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Payout Information</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Payment Methods *</label>
                                <input name="paymentMethods" defaultValue={firm?.paymentMethods?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Credit Card, Crypto, Wire Transfer" />
                                <p className="text-xs text-muted-foreground">Comma separated payment methods</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Payout Methods</label>
                                <input name="payoutMethods" defaultValue={firm?.payoutMethods?.join(", ") || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Crypto, Riseworks, Wire Transfer" />
                                <p className="text-xs text-muted-foreground">Comma separated withdrawal methods</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Payout Frequency</label>
                                <input name="payoutFrequency" defaultValue={firm?.payoutFrequency || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="e.g. 14 days, Bi-weekly" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Minimum Payout</label>
                                <input name="minPayout" defaultValue={firm?.minPayout || ""} className="w-full rounded-md border bg-background px-3 py-2" placeholder="e.g. $100" />
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Detailed Rules</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Consistency Rules</label>
                                <textarea name="consistencyRules" defaultValue={firm?.consistencyRules || ""} rows={4} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Detailed consistency rules..." />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prohibited Practices</label>
                                <textarea name="prohibitedPractices" defaultValue={firm?.prohibitedPractices?.join(", ") || ""} rows={4} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Prohibited practices..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
