import i18n from '@/locales/i18n'

import useToasterStore from '@/stores/useToaster'
import useProjectsStore from '@/stores/useProjects'

const defaultOptions = () => {
    return {
        baseURL:
            import.meta.env.VITE_APP_API_URL + '/' + import.meta.env.VITE_APP_API_DEFAULT_VERSION,
        method: 'GET',
        onRequest({ request, options }) {
            const accessToken = localStorage.getItem('ACCESS_TOKEN')
            if (accessToken) options.headers.set('Authorization', `Bearer ${accessToken}`)
        },
        onRequestError({ request, options, error }) {
            // Handle the request errors
        },
        onResponse({ request, response, options }) {
            // Process the response data
            localStorage.setItem('token', response._data.token)
        },
        onResponseError({ request, response, options, error }) {
            if (options.noError) {
                console.error(error)
                return Promise.reject(error)
            }

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
                    toaster.pushError(
                        //message: i18n.messages[i18n.locale].message['error']['unauthorized'],
                        i18n.global.t('message.error.unauthorized')
                    )
                } else if (status === 422) {
                    toaster.pushError(
                        // message: i18n.messages[i18n.locale].message['error']['unprocessable-entity'],
                        i18n.global.t('message.error.unprocessable-entity')
                    )
                } else if (status === 502) {
                    toaster.pushError(
                        // message: i18n.messages[i18n.locale].message['error']['bad-gateway'],
                        i18n.global.t('message.error.bad-gateway')
                    )
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

const useAPI = (url: string, options) => {
    const _options = { ...defaultOptions(), ...options }
    return useFetch(url, options)
}

export default useAPI
