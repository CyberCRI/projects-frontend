import useKeycloak from '@/api/auth/keycloak'
import useUsersStore from '@/stores/useUsers'

export default defineNuxtRouteMiddleware(async function postLogin(to) {
  if (import.meta.client) {
    const keycloak = useKeycloak()
    const usersStore = useUsersStore()
    // const { setLocale } = useI18n()
    const loginSearchParams = new URLSearchParams(Object.entries(to.query as object)) // new URLSearchParams(window.location.search)

    // Log in user after redirection is successful from keycloack
    await keycloak.loginIfValidState(loginSearchParams)

    if (usersStore?.keycloak_id) {
      await usersStore.getUser(usersStore.keycloak_id)
      // if (usersStore.userFromApi) {
      //   console.log('setlang', usersStore.userFromApi.language)
      //   setLocale(usersStore.userFromApi.language)
      // }
    }

    const state = loginSearchParams.get('state')
      ? JSON.parse(loginSearchParams.get('state') as string)
      : null

    if (state) {
      let nextPage = state?.fromURL?.replace(window.location.origin, '') || window.location.pathname
      if (nextPage.includes('discover')) {
        nextPage = nextPage.replace('discover', 'dashboard')
      }
      return navigateTo(nextPage)
    }
  }
})
