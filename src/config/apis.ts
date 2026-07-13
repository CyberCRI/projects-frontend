import useToasterStore from '~/stores/useToaster'
import useUsersStore from '~/stores/useUsers'

import { configureClientAPI, configureOptionsAPI } from 'shared-projects-frontend/apis'
import type { ClientAPIOptions } from 'shared-projects-frontend/apis'
import { useRuntimeConfig } from '#imports'

/**
 * this is a functions to initialize clientAPI from shared-projects-frontends (ofetch)
 *
 * @function
 * @name initializeClientApi
 * @kind variable
 * @returns {void}
 * @exports
 */
export const initializeClientApi = () => {
  // custom fetch from nuxt
  // @ts-expect-error ignore types
  configureClientAPI($fetch)

  // custom options
  configureOptionsAPI(() => {
    let _localStorage = null
    if (import.meta.client && import.meta.env.VITEST !== 'true')
      _localStorage = window?.localStorage
    const localStorage = _localStorage
    const runtimeConfig = useRuntimeConfig()

    const baseURL = runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'

    return {
      baseURL,
      method: 'GET',
      onRequest({ options }) {
        if (import.meta.client) {
          const cookie = useRequestHeaders(['cookie'])?.cookie
          if (cookie) {
            options.headers.set('cookie', cookie)
          }
          // if token alreadyset, ignore it (for MCP)
          if (options.headers.get('Authorization')) {
            return
          }

          const usersStore = useUsersStore()
          const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
          if (accessToken) {
            options.headers.set('Authorization', `Bearer ${accessToken}`)
          }
        }
      },
      onRequestError() {
        // Handle the request errors
      },
      onResponse({ response }) {
        // Process the response data
        // TODO nuxt is this needed ?
        if (response?._data) localStorage?.setItem('token', response._data.token)
      },
      async onResponseError({ request, options, response }) {
        const opts = options as ClientAPIOptions
        // // keep for futur debug
        // console.error(response)
        // var e = new Error()
        // console.log(e.stack.split('\n').map((s) => s.substring(s.lastIndexOf('/'))))
        if (opts.noError) {
          // console.error(error)
          return null
        }

        const toaster = useToasterStore()
        const originalRequest: any = request // response.config

        // We could add specific notification to display the errors
        // And we could also handle refresh token there if needed when catching error
        if (response) {
          const { status } = response

          const data: any = response._data

          if (data.type && (data.errors || data.detail)) {
            if (data.type === 'validation') {
              let message = ''
              for (const key in data.errors) {
                message += `${key}: ${data.errors[key].join(' ')}`
              }

              toaster.pushError(message)
            } else {
              toaster.pushError(data.detail)
            }
            // other error cases are kept for backward compatibility
          } else if (status === 400) {
            // Show first message
            const firstKey = Object.keys(data)[0]
            const firstValue = data[firstKey][0]
            const message = `${firstKey}: ${firstValue}`

            toaster.pushWarning(message)
          } else if (status === 401) {
            toaster.pushError('message.error.unauthorized', { translate: true })
          } else if (status === 422) {
            toaster.pushError('message.error.unprocessable-entity', {
              translate: true,
            })
          } else if (status === 502) {
            toaster.pushError('message.error.bad-gateway', { translate: true })
          }

          // TODO : is this still used ?
          if (status === 403 && typeof originalRequest === 'object' && !originalRequest._retry) {
            originalRequest._retry = true

            return Promise.reject(response)
          }
        }

        return Promise.reject(response)
      },
    } satisfies ClientAPIOptions
  })
}
