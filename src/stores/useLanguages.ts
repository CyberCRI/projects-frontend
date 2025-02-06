import { defineStore } from 'pinia'
import type { LanguageType } from '@/models/types'
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

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

    return { all, current }
})

export default useLanguagesStore
