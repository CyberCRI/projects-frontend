import useKeycloak from '@/api/auth/keycloak'
import { checkExpiredToken } from '@/api/auth/keycloakUtils'
import useUsersStore from '@/stores/useUsers'
// import router from '@/router'

export default async function initUser() {
  const keycloak = useKeycloak()
  // Remove tokens if obsolete
  checkExpiredToken()

  // refresh token (the refresh loop come later and is async,
  // so it doesn't return soon enough for route guards like requireAdmin)
  const usersStore = useUsersStore()
  if (localStorage.getItem('ACCESS_TOKEN')) {
    await usersStore.doRefreshToken()
  }

  const loginSearchParams = new URLSearchParams(window.location.search)
  // Log in user after redirection is successful from keycloack
  await keycloak.loginIfValidState(loginSearchParams)

  if (usersStore?.keycloak_id) await usersStore.getUser(usersStore.keycloak_id)

  const state = loginSearchParams.get('state')
    ? JSON.parse(loginSearchParams.get('state') as string)
    : null

  if (state) {
    let nextPage = state.fromURL.replace(window.location.origin, '')
    if (nextPage.includes('discover')) {
      nextPage = nextPage.replace('discover', 'dashboard')
    }
    // TODO do this the nuxt way
    const router = useRouter()
    router.push(nextPage)
  }

  // to check: was at the end of app.ts main
  keycloak.refreshTokenLoop.start()
}
