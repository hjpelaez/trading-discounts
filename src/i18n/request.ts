import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getDynamicTranslations } from '@/lib/db';
import deepmerge from 'deepmerge';

export default getRequestConfig(async ({ requestLocale }: { requestLocale: Promise<string | undefined> }) => {
    // This typically corresponds to the `[locale]` segment
    const localeInput = await requestLocale;

    // Ensure that a valid locale is used
    const locale = (localeInput && routing.locales.includes(localeInput as "en" | "es"))
        ? localeInput as "en" | "es"
        : routing.defaultLocale;

    const userMessages = (await import(`../../messages/${locale}.json`)).default;
    const dynamicTranslations = await getDynamicTranslations();

    const overrides: Record<string, unknown> = {};
    Object.entries(dynamicTranslations).forEach(([key, value]) => {
        const parts = key.split('.');
        const translatedValue = value[locale as 'en' | 'es'];

        let current: any = overrides; // Internal traversal still needs flexibility
        for (let i = 0; i < parts.length - 1; i++) {
            current[parts[i]] = current[parts[i]] || {};
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = translatedValue;
    });

    const messages = deepmerge(userMessages, overrides);

    return {
        locale,
        messages: messages as Record<string, unknown>
    };
});
