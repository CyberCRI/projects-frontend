import { Icon } from 'leaflet'
import { createApp, watchEffect } from 'vue'

import { axios } from './api/api.config'
import VueAxios from 'vue-axios'

import keycloak from './api/auth/keycloak'
import { checkExpiredToken } from './api/auth/keycloakUtils'

import i18n from './locales/i18n'

import pinia from './stores'

import { capitalize, isNotGroup, isGroup } from '@/filters'
import App from './App.vue'
import { clickOutside, disableFocus } from '@/directives'

import analytics from '@/analytics'
import * as Sentry from '@sentry/vue'

import '@/design/scss/reset.scss'
import '@/design/scss/main.scss'

import router from '@/router'

import { goToKeycloakLoginPage } from '@/api/auth/auth.service'

import useToasterStore from '@/stores/useToaster'
import useLanguagesStore from '@/stores/useLanguages'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

// Resolves an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
    iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'leaflet/dist/images/marker-icon.png',
    shadowUrl: 'leaflet/dist/images/marker-shadow.png',
})

window['socket'] = { connected: false }

// speedy redirect to keycloak login without loading the whole app
if (window.location.pathname === '/login') {
    goToKeycloakLoginPage()
}

async function main(): Promise<void> {
    // init app
    const app = createApp(App)
    // Display errors / warnings
    app.config.errorHandler = (err, vm, info) => {
        const toaster = useToasterStore()
        const splitedError = err.toString().split(':')
        const title = splitedError.length > 1 ? splitedError[0] : 'Error'
        const message = splitedError.length > 1 ? splitedError.slice(1).join(':') : splitedError[0]
        toaster.pushError(
            `<span class="error-title">${title}:</span><span>${message}</span><br><span class="error-title">Info:</span><span>${info}</span>`
        )
        throw err // Throw error in console so we can still trace the error location instead of doing a console.error
    }
    app.config.warnHandler = (msg, vm, trace) => {
        console.warn(`Warn: ${msg}\n\nTrace: ${trace}`)
    }

    app.directive('click-outside', clickOutside)
    app.directive('disable-focus', disableFocus)

    app.config.globalProperties.$filters = {
        capitalize,
        isNotGroup,
        isGroup,
    }

    app.use(VueAxios, axios)

    app.use(i18n)

    app.use(pinia)

    // Init analytics
    analytics.init()

    // Remove tokens if obsolete
    checkExpiredToken()

    // refresh token (the refresh loop come later and is async,
    // so it doesn't return soon enough for route guards like requireAdmin)
    const usersStore = useUsersStore()
    if (localStorage.getItem('ACCESS_TOKEN')) {
        console.log('SET USER')
        await usersStore.doRefreshToken()
    }

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

    if (usersStore?.keycloak_id) await usersStore.getUser(usersStore.keycloak_id)

    // Get org information on init
    const organizationsStore = useOrganizationsStore()
    await organizationsStore.getCurrentOrganization(import.meta.env.VITE_APP_API_ORG_CODE)

    app.use(router)

    const loginSearchParams = new URLSearchParams(window.location.search)
    // Log in user after redirection is successful from keycloack
    await keycloak.loginIfValidState(loginSearchParams)

    const state = loginSearchParams.get('state')
        ? JSON.parse(loginSearchParams.get('state') as string)
        : null

    if (state) {
        let nextPage = state.fromURL.replace(window.location.origin, '')
        if (nextPage.includes('discover')) {
            nextPage = nextPage.replace('discover', 'dashboard')
        }
        router.push(nextPage)
    }

    const SENTRY_ENABLED = import.meta.env.VITE_APP_SENTRY_ENABLED
    if (SENTRY_ENABLED) {
        Sentry.init({
            app,
            dsn: import.meta.env.VITE_APP_SENTRY_DSN,
            integrations: [
                Sentry.browserTracingIntegration({ router }),
                Sentry.replayIntegration(),
            ],
            environment: import.meta.env.VITE_APP_ENVIRONMENT,
            tracePropagationTargets: ['localhost', import.meta.env.VITE_APP_API_URL],

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for tracing.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,

            // Capture Replay for 10% of all sessions,
            // plus for 100% of sessions with an error
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            release: import.meta.env.VITE_APP_SENTRY_RELEASE,
        })
    }

    // mount app
    app.mount('#app')

    keycloak.refreshTokenLoop.start()
}

main()
