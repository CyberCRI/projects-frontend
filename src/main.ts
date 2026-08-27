import { useNuxtApp, useRuntimeConfig } from '#imports'
import initOrganization from './app/initOrganization'
import { initializeClientApi } from '~/config/apis'
// import quickLogin from '~/app/quickLogin'
import initSentry from '~/app/initSentry'
//import initApp from '~/app/initApp'
//import initAnalytics from '~/app/initAnalytics'
// import initUser from '~/app/initUser'
import analytics from '~/analytics'

// quick redirect to keycloak login if url says so
if (import.meta.client) {
  // initialize client apis with projects-frontend options/config
  initializeClientApi()
  // quickLogin()

  // bug fix for leaflet's marker
  // TODO: check if it is still needed
  // if (import.meta.client) fixLeaflet()
}

export default async function main(): Promise<void> {
  const runtimeConfig = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  // add org code to html class for personalized fonts
  document?.querySelector('html').classList.add('org-' + runtimeConfig.public.appApiOrgCode)

  // await initAnalytics()
  await analytics.init()
  if (import.meta.client) {
    await initOrganization()
    await initSentry(nuxtApp.vueApp)
    // await initUser()
  }
}

// let's go
//main()
