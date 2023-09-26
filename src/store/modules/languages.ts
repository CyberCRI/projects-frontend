import { LanguageType } from '@/models/types'

import i18n from '@/locales/i18n'

export interface LanguageState {
    all: LanguageType[]
    current: LanguageType
}

const state = (): LanguageState => {
    const allLanguages: LanguageType[] = ['en', 'fr']
    const userLang: LanguageType = navigator.language.split('-')[0] as LanguageType

    return {
        all: allLanguages,
        current:
            localStorage.getItem('lang') ||
            (allLanguages.indexOf(userLang) > -1 ? userLang : null) ||
            import.meta.env.VITE_APP_I18N_LOCALE,
    }
}

const getters = {
    all: (state: LanguageState) => state.all,
    current: (state: LanguageState) => state.current,
}

const mutations = {
    SET_CURRENT_LANGUAGE(state: LanguageState, lang: LanguageType) {
        state.current = lang
        localStorage.setItem('lang', lang)
        i18n.global.locale.value = lang
        // Set lang attribute for non translated langages to be translated by browser extensions
        const html = document.documentElement
        html.setAttribute('lang', lang)
    },
}

const actions = {
    updateCurrentLanguage({ commit }, lang: LanguageType) {
        commit('SET_CURRENT_LANGUAGE', lang)
    },
}

export default {
    namespaced: true,
    getters,
    state,
    mutations,
    actions,
}
