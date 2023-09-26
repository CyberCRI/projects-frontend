import { createI18n } from 'vue-i18n'
import en from './en.json'
import fr from './fr.json'

export function loadLocaleMessages() {
    return {
        en,
        fr,
    }
}

export default createI18n({
    locale: import.meta.env.VITE_APP_I18N_LOCALE || 'en',
    fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: loadLocaleMessages(),
    legacy: false,
    globalInjection: true,
})
