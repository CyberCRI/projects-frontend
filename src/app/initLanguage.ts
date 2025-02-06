import { watchEffect } from 'vue'
import i18n from '@/locales/i18n'
import useLanguagesStore from '@/stores/useLanguages'
import { useRuntimeConfig } from '#imports'

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
    const runtimeConfig = useRuntimeConfig()

    const lang = localStorage.getItem('lang')
        ? localStorage.getItem('lang').toLowerCase()
        : runtimeConfig.public.appI18nLocale || 'en'

    languagesStore.current = lang
}
