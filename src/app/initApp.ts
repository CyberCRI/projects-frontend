import { createApp } from 'vue'

import pinia from '@/stores'

import { capitalize, isNotGroup, isGroup } from '@/filters'
import App from '@/app.vue'
import { clickOutside, disableFocus } from '@/directives'

import useToasterStore from '@/stores/useToaster'
import router from '@/router'

export default async function initApp(inits) {
    // init app
    const app = createApp(App)
    // Display errors / warnings
    app.config.errorHandler = (err: any, vm, info) => {
        // silence aborted request (on home page mostly)
        if (err?.code === 'ECONNABORTED') {
            console.log('aborted request', err) // TODO nuxt check this
            return
        }

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

    // app.use(i18n)

    app.use(pinia)

    await inits(app)

    // it is important to use the router the rest of inits (else permission fail on landing protected page)
    app.use(router)

    // mount app
    app.mount('#app')

    return app
}
