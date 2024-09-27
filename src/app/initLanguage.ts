import { watchEffect } from 'vue'
import i18n from '@/locales/i18n'
import useLanguagesStore from '@/stores/useLanguages'

export default async function initLanguage() {
    const languagesStore = useLanguagesStore()

    watchEffect(() => {
        const lang = languagesStore.current
        localStorage.setItem('lang', lang)
        i18n.global.locale.value = lang
        // Set lang attribute for non translated langages to be translated by browser extensions
        const html = document.documentElement
        html.setAttribute('lang', lang)
    })

    const lang = localStorage.getItem('lang')
        ? localStorage.getItem('lang').toLowerCase()
        : import.meta.env.VITE_APP_I18N_LOCALE || 'en'

    languagesStore.current = lang
}
