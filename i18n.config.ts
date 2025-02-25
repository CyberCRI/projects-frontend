import { defineI18nConfig, useRuntimeConfig } from '#imports'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

export function loadLocaleMessages() {
    return {
        en,
        fr,
    }
}

export default defineI18nConfig((): any => {
    const runtimeConfig = useRuntimeConfig()
    return {
        locale: runtimeConfig.public.appI18nLocale || 'en',
        fallbackLocale: runtimeConfig.public.appI18nFallbackLocale || 'en',
        messages: loadLocaleMessages(),
        legacy: false,
        globalInjection: true,
    }
})
