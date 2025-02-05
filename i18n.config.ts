import { defineI18nConfig } from '#imports'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

export function loadLocaleMessages() {
    return {
        en,
        fr,
    }
}

export default defineI18nConfig(() => ({
    locale: import.meta.env.VITE_APP_I18N_LOCALE || 'en',
    fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: loadLocaleMessages(),
    legacy: false,
    globalInjection: true,
}))
