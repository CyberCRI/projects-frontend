import { defineNuxtPlugin } from '#imports'

import useToasterStore from '@/stores/useToaster'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (err: any, vm, info) => {
    if (import.meta.client) {
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
    } else {
      // server side
      console.warn(`Vue:Error: ${err}\n\nTrace: ${info}`)
    }
  }

  nuxtApp.vueApp.config.warnHandler = (msg, vm, trace) => {
    console.warn(`Vue:Warn: ${msg}\n\nTrace: ${trace}`)
  }
})
