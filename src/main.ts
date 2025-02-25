// import fixLeaflet from '@/app/fixLeaflet'
import quickLogin from '@/app/quickLogin'

//import initApp from '@/app/initApp'
import initAnalytics from '@/app/initAnalytics'
import initUser from '@/app/initUser'
import initOrganization from './app/initOrganization'
import initSentry from '@/app/initSentry'
import { useRuntimeConfig, useNuxtApp } from '#imports'

import '@/design/scss/reset.scss'
import '@/design/scss/main.scss'

if (import.meta.client) {
    // quick redirect to keycloak login if url says so
    quickLogin()

    // bug fix for leaflet's marker
    // TODO: check if it is still needed
    // if (import.meta.client) fixLeaflet()

    window['socket'] = { connected: false }
}

export default async function main(): Promise<void> {
    const runtimeConfig = useRuntimeConfig()
    const nuxtApp = useNuxtApp()
    // add org code to html class for personalized fonts
    document?.querySelector('html').classList.add('org-' + runtimeConfig.public.appApiOrgCode)

    await initAnalytics()
    if (import.meta.client) await initUser()
    await initOrganization()
    if (import.meta.client) await initSentry(nuxtApp.vueApp)
}

// let's go
//main()
