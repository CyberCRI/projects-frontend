import { defineStore } from 'pinia'
import { LanguageType } from '@/models/types'

export interface LanguageState {
    all: LanguageType[]
    current: LanguageType
}

const allLanguages: LanguageType[] = ['en', 'fr']
const userLang: LanguageType = navigator.language.split('-')[0] as LanguageType
const initialLang =
    localStorage.getItem('lang') ||
    (allLanguages.indexOf(userLang) > -1 ? userLang : null) ||
    import.meta.env.VITE_APP_I18N_LOCALE

const useToasterStore = defineStore('languages', {
    state: (): LanguageState => ({
        all: allLanguages,
        current: initialLang,
    }),
})

export default useToasterStore
