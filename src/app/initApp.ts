import { createApp } from 'vue'

import { axios } from '@/api/api.config'
import VueAxios from 'vue-axios'

import pinia from '@/stores'

import { capitalize, isNotGroup, isGroup } from '@/filters'
import App from '@/App.vue'
import { clickOutside, disableFocus } from '@/directives'

import i18n from '@/locales/i18n'
import useToasterStore from '@/stores/useToaster'
import router from '@/router'

export default async function initApp(inits) {
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

    await inits(app)

    // it is important to use the router the rest of inits (else permission fail on landing protected page)
    app.use(router)

    // mount app
    app.mount('#app')

    return app
}
