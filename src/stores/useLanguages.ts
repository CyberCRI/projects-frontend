import { defineStore } from 'pinia'
import type { LanguageType } from '@/models/types'
import { ref, watchEffect } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useI18n } from '#imports'

export interface LanguageState {
    all: LanguageType[]
    current: LanguageType
}

const useLanguagesStore = defineStore('languages', () => {
    const runtimeConfig = useRuntimeConfig()

    const allLanguages: LanguageType[] = ['en', 'fr']
    const userLang: LanguageType = navigator.language.split('-')[0] as LanguageType
    const initialLang =
        localStorage.getItem('lang') ||
        (allLanguages.indexOf(userLang) > -1 ? userLang : null) ||
        runtimeConfig.public.appI18nLocale

    const all = ref(allLanguages)
    const current = ref(initialLang)
    const { setLocale } = useI18n()

    watchEffect(() => {
        const lang = current.value
        localStorage.setItem('lang', lang)
        setLocale(lang)
        // Set lang attribute for non translated langages to be translated by browser extensions
        const html = document.documentElement
        html.setAttribute('lang', lang)
    })

    return { all, current }
})

export default useLanguagesStore
