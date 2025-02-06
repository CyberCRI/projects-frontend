import fixLeaflet from '@/app/fixLeaflet'
import quickLogin from '@/app/quickLogin'

import initApp from '@/app/initApp'
import initAnalytics from '@/app/initAnalytics'
import initUser from '@/app/initUser'
import initOrganization from './app/initOrganization'
import initSentry from '@/app/initSentry'
import { useRuntimeConfig } from '#imports'

import '@/design/scss/reset.scss'
import '@/design/scss/main.scss'

// quick reirect to keycloak login if url says so
quickLogin()

// bug fix for leaflet's marker
// TODO: check if it is still needed
fixLeaflet()

// TODO: this is probably not used anymore, check this
window['socket'] = { connected: false }

export default async function main(): Promise<void> {
    const runtimeConfig = useRuntimeConfig()
    // add org code to html class for personalized fonts
    document.querySelector('html').classList.add('org-' + runtimeConfig.public.appApiOrgCode)

    // init app
    //await initApp(async (app) => {
    await initAnalytics()
    await initUser()
    await initOrganization()
    //await initSentry(app)
    //})
}

// let's go
//main()
