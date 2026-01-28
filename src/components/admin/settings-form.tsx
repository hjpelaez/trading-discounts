"use client";

import { saveSettingsAction } from "@/actions/settings-actions";
import { useFormStatus } from "react-dom";
import { Save, Facebook, Instagram, Send, LineChart, Search, ShieldCheck, ExternalLink, Share2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
            {pending ? "Guardando..." : "Guardar Cambios"}
            <Save className="h-4 w-4" />
        </button>
    );
}

interface SettingsFormProps {
    initialSettings: {
        socials: {
            facebook: string;
            instagram: string;
            telegram: string;
        };
        googleAnalyticsId: string;
        googleSearchConsoleId: string;
        recaptchaSiteKey: string;
    }
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    return (
        <form action={saveSettingsAction} className="space-y-6 max-w-2xl">
            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-8">
                {/* Redes Sociales Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-bold text-lg text-muted-foreground">Redes Sociales</h3>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Facebook className="h-4 w-4 text-blue-600" /> Facebook URL
                        </label>
                        <input
                            name="facebook"
                            defaultValue={initialSettings.socials.facebook}
                            className="w-full bg-background border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="https://facebook.com/..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Instagram className="h-4 w-4 text-pink-600" /> Instagram URL
                        </label>
                        <input
                            name="instagram"
                            defaultValue={initialSettings.socials.instagram}
                            className="w-full bg-background border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="https://instagram.com/..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Send className="h-4 w-4 text-sky-500" /> Telegram URL
                        </label>
                        <input
                            name="telegram"
                            defaultValue={initialSettings.socials.telegram}
                            className="w-full bg-background border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="https://t.me/..."
                        />
                    </div>
                </div>

                {/* Google Services Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <LineChart className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-bold text-lg text-muted-foreground">Servicios de Google</h3>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <LineChart className="h-4 w-4 text-orange-500" /> Google Analytics ID (GA4)
                            </label>
                            <a
                                href="https://analytics.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] uppercase font-black text-primary hover:underline flex items-center gap-1"
                            >
                                Consola <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                        </div>
                        <input
                            name="googleAnalyticsId"
                            defaultValue={initialSettings.googleAnalyticsId}
                            pattern="^G-[A-Z0-9]+$"
                            className="w-full bg-background border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none invalid:border-red-500"
                            placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-[11px] text-muted-foreground">
                            ⚠️ <strong>SOLO EL ID</strong> (ej: G-XXXX). No pegues el código <code>&lt;script&gt;</code> completo.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Search className="h-4 w-4 text-blue-500" /> Google Search Console (Meta Tag ID)
                            </label>
                            <a
                                href="https://search.google.com/search-console"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] uppercase font-black text-primary hover:underline flex items-center gap-1"
                            >
                                Consola <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                        </div>
                        <input
                            name="googleSearchConsoleId"
                            defaultValue={initialSettings.googleSearchConsoleId}
                            className="w-full bg-background border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                        <p className="text-[11px] text-muted-foreground">
                            ⚠️ <strong>SOLO EL CÓDIGO</strong> de verificación. No pegues la etiqueta <code>&lt;meta&gt;</code> entera.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-500" /> Google reCAPTCHA v3 (Site Key)
                            </label>
                            <a
                                href="https://www.google.com/recaptcha/admin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] uppercase font-black text-primary hover:underline flex items-center gap-1"
                            >
                                Consola <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                        </div>
                        <input
                            name="recaptchaSiteKey"
                            defaultValue={initialSettings.recaptchaSiteKey}
                            className="w-full bg-background border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        />
                        <p className="text-[11px] text-muted-foreground">
                            ⚠️ <strong>SOLO LA CLAVE DEL SITIO</strong>. No pegues scripts de carga.
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}
