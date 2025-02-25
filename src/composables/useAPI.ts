import { useI18n } from '#imports'
import useToasterStore from '@/stores/useToaster'
// import useProjectsStore from '@/stores/useProjects'
import merge from 'lodash.merge'
import { useRuntimeConfig } from '#imports'
export const getFormDataHeaders = () => ({
    headers: {
        'content-type': 'multipart/form-data',
    },
})
const useAPI = (url: string, options) => {
    const defaultOptions = () => {
        let _localStorage = null
        if (import.meta.client) _localStorage = window.localStorage
        let localStorage = _localStorage
        const runtimeConfig = useRuntimeConfig()
        return {
            baseURL:
                runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/',
            method: 'GET',
            onRequest({ options }) {
                const accessToken = localStorage?.getItem('ACCESS_TOKEN')
                if (accessToken) options.headers.set('Authorization', `Bearer ${accessToken}`)
            },
            onRequestError() {
                // Handle the request errors
            },
            onResponse({ response }) {
                // Process the response data
                localStorage?.setItem('token', response._data.token)
            },
            onResponseError({ options, error }) {
                if (options.noError) {
                    // console.error(error)
                    return Promise.resolve(null)
                }

                const { t } = useI18n()

                const toaster = useToasterStore()
                const originalRequest: any = error.config

                // We could add specific notification to display the errors
                // And we could also handle refresh token there if needed when catching error
                if (error.response) {
                    const { data, status }: { data: any; status: number } = error.response
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
                        toaster.pushError(t('message.error.unauthorized'))
                    } else if (status === 422) {
                        toaster.pushError(t('message.error.unprocessable-entity'))
                    } else if (status === 502) {
                        toaster.pushError(t('message.error.bad-gateway'))
                    }

                    // TODO : is this still used ?
                    if (status === 403 && !originalRequest._retry) {
                        originalRequest._retry = true

                        return Promise.reject(error)
                    }
                }

                return Promise.reject(error)
            },
        }
    }

    const _options = merge(defaultOptions(), options)
    return $fetch(url, _options)
}

export default useAPI
