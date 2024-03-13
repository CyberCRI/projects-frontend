import { Icon } from 'leaflet'
import { createApp } from 'vue'
import VueAxios from 'vue-axios'

import keycloak from './api/auth/keycloak'
import { checkExpiredToken } from './api/auth/keycloakUtils'
import i18n from './locales/i18n'
import store from './store'
import { capitalize, isNotGroup, isGroup } from '@/filters'
import App from './App.vue'
import { axios } from './api/api.config'
import { clickOutside, disableFocus } from '@/directives'
import analytics from '@/analytics'
import '@/design/scss/reset.scss'
import '@/design/scss/main.scss'
import router from '@/router'
import Meta from 'vue-meta'

import { goToKeycloakLoginPage } from '@/api/auth/auth.service'

// TODO: remove this
console.log(`VITE_APP_HOME=${import.meta.env.VITE_APP_HOME}`)

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
    // Init analytics
    analytics.init()

    // Remove tokens if obsolete
    checkExpiredToken()

    // refresh token (the refresh loop come later and is async,
    // so it doesn't return soon enough for route guards like requireAdmin)
    if (localStorage.getItem('ACCESS_TOKEN')) {
        await store.dispatch('users/refreshToken')
    }

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

    // Get & Set lang from localstorage
    // if (localStorage.getItem('lang'))
    //     i18n.global.locale.value = localStorage.getItem('lang').toLowerCase()
    // else i18n.global.locale.value = import.meta.env.VITE_APP_I18N_LOCALE || 'en'

    const lang = localStorage.getItem('lang')
        ? localStorage.getItem('lang').toLowerCase()
        : import.meta.env.VITE_APP_I18N_LOCALE || 'en'

    store.dispatch('languages/updateCurrentLanguage', lang)

    if (store.state.users?.keycloak_id)
        await store.dispatch('users/getUser', store.state.users.keycloak_id)

    // Get org information on init
    await store.dispatch(
        'organizations/getCurrentOrganization',
        import.meta.env.VITE_APP_API_ORG_CODE
    )

    // eslint-disable-next-line vue/require-name-property
    // const app = Vue.createApp({
    //     router,
    //     store,
    //     i18n,
    //     render: (h) => h(App),
    // })
    const app = createApp(App)

    // Display errors / warnings
    app.config.errorHandler = (err, vm, info) => {
        const splitedError = err.toString().split(':')
        const title = splitedError.length > 1 ? splitedError[0] : 'Error'
        const message = splitedError.length > 1 ? splitedError.slice(1).join(':') : splitedError[0]
        store.dispatch('notifications/pushToast', {
            message: `<span class="error-title">${title}:</span><span>${message}</span><br><span class="error-title">Info:</span><span>${info}</span>`,
            type: 'error',
        })
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

    app.use(router, Meta)

    app.use(store)

    app.mount('#app')

    keycloak.refreshTokenLoop.start()
}

main()
