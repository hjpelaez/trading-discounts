"use client";

import { saveSettingsAction } from "@/actions/settings-actions";
import { useFormStatus } from "react-dom";
import { Save, Facebook, Instagram, Send } from "lucide-react";

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
        }
    }
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    return (
        <form action={saveSettingsAction} className="space-y-6 max-w-2xl">
            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
                <div className="space-y-4">
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

                <div className="pt-4 border-t flex justify-end">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}
