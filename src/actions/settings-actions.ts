"use server";

import { getSettings, saveSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveSettingsAction(formData: FormData) {
    const facebook = formData.get("facebook") as string;
    const instagram = formData.get("instagram") as string;
    const telegram = formData.get("telegram") as string;

    const currentSettings = await getSettings();

    const newSettings = {
        ...currentSettings,
        socials: {
            facebook,
            instagram,
            telegram
        }
    };

    await saveSettings(newSettings);
    revalidatePath("/");
}
