import { defineStore } from 'pinia'
import type { LanguageType } from '@/models/types'
import { ref, watchEffect } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useNuxtApp } from '#imports'

export interface LanguageState {
    all: LanguageType[]
    current: LanguageType
}

// fix undefined localStaorage on sever
let _localStorage = null
if (import.meta.client) _localStorage = window.localStorage
let localStorage = _localStorage

const useLanguagesStore = defineStore('languages', () => {
    const runtimeConfig = useRuntimeConfig()

    const allLanguages: LanguageType[] = ['en', 'fr']
    const userLang: LanguageType = navigator?.language?.split('-')[0] as LanguageType
    const initialLang =
        localStorage?.getItem('lang') ||
        (allLanguages.indexOf(userLang) > -1 ? userLang : null) ||
        runtimeConfig.public.appI18nLocale

    const all = useState(() => allLanguages)
    const current = useState(() => initialLang)

    watchEffect(() => {
        const lang = current.value
        localStorage?.setItem('lang', lang)
        useNuxtApp().$i18n.setLocale(lang)
        // Set lang attribute for non translated langages to be translated by browser extensions
        if (import.meta.client) {
            const html = document.documentElement
            html.setAttribute('lang', lang)
        }
    })

    return { all, current }
})

export default useLanguagesStore
