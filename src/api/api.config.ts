import a, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

import store from '@/store'
import useToasterStore from '@/stores/useToaster'

import i18n from '@/locales/i18n'

export const axios = a.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true, // allow to set cookie from response
})

// this is a special version of axios
// that doesn't use an interceptor to inject the user token as authorization header
// it is currently needed by regiter links
// as there user token need to be replaced with invitation token
export const axiosNoToken = a.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true, // allow to set cookie from response
})

// this is a special version of axios
// that doesn't use an interceptor to signal errors in toaters
// it is currently needed by people.service.ts searchPeopleByExactMail()
// as the error here just mean that we need to create a new account
export const axiosNoErrorMessage = a.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true, // allow to set cookie from response
})

export const configFormData = {
    headers: {
        'content-type': 'multipart/form-data',
    },
}

// Handle all requests
const request = (config: InternalAxiosRequestConfig) => {
    // additional headers if needed
    const accessToken = localStorage.getItem('ACCESS_TOKEN')

    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
}

const requestNoToken = (config: InternalAxiosRequestConfig) => {
    return config
}

// Handle errors on all requests
const requestError = (error: AxiosError) => Promise.reject(error)

// Handle all responses
const response = (response: AxiosResponse) => response

// Handle errors on responses
const responseError = (error: AxiosError) => {
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
}

const responseNoToatError = (error: AxiosError) => {
    return Promise.reject(error)
}

// Interceptors
axios.interceptors.request.use(request, requestError)
axios.interceptors.response.use(response, responseError)
axiosNoToken.interceptors.request.use(requestNoToken, requestError)
axiosNoToken.interceptors.response.use(response, responseError)
axiosNoErrorMessage.interceptors.request.use(request, requestError)
axiosNoErrorMessage.interceptors.response.use(response, responseNoToatError)

// TODO: remove functions below once we moved everything to new API
export const getAxiosConfig = (etag?) => {
    const header = {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Cur-Project-ID': store.state.projects.project.id,
            'Api-Base-Org-ID': import.meta.env.VITE_APP_API_ORG_CODE,
        },
    }
    if (etag) {
        header['headers']['If-Match'] = etag
    }

    return header
}

// SAFARI OLD CACHE HACK ... STILL VALID IN 2019 ... SAD.
export const noCache = (url) => {
    const ts = new Date().getTime()
    const ncurl = new URL(url)
    ncurl.searchParams.append('ts', String(ts))

    return ncurl.toString()
}

export const getAxiosConfigExt = () => {
    const header = {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
        },
        withCredentials: false,
    }

    return header
}

export const handleAsyncError = (error) => {
    return error
}
