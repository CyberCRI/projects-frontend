import useToasterStore from '@/stores/useToaster'
// import useProjectsStore from '@/stores/useProjects'
import merge from 'lodash.merge'
import { useRuntimeConfig } from '#imports'

const useAPI = (url: string, options) => {
  const defaultOptions = () => {
    let _localStorage = null
    if (import.meta.client) _localStorage = window.localStorage
    const localStorage = _localStorage
    const runtimeConfig = useRuntimeConfig()
    const usersStore = useUsers()
    return {
      baseURL: runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/',
      method: 'GET',
      onRequest({ options }) {
        if (import.meta.client) {
          const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
          if (accessToken) options.headers.set('Authorization', `Bearer ${accessToken}`)
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
        // // keep for futur debug
        // console.error(response)
        // var e = new Error()
        // console.log(e.stack.split('\n').map((s) => s.substring(s.lastIndexOf('/'))))
        if (options.noError) {
          // console.error(error)
          return null
        }

        const toaster = useToasterStore()
        const originalRequest: any = request // response.config

        // We could add specific notification to display the errors
        // And we could also handle refresh token there if needed when catching error
        if (response) {
          const { status }: { data: any; status: number } = response

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
            toaster.pushError('message.error.unprocessable-entity', { translate: true })
          } else if (status === 502) {
            toaster.pushError('message.error.bad-gateway', { translate: true })
          }

          // TODO : is this still used ?
          if (status === 403 && !originalRequest._retry) {
            originalRequest._retry = true

            return Promise.reject(response)
          }
        }

        return Promise.reject(response)
      },
    }
  }

  const _options = merge(defaultOptions(), options)
  return $fetch(url, _options)
}

export default useAPI
