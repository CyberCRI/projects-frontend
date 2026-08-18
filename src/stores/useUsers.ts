import type {
  NotificationSettingsForm,
  NotificationsSettings,
  UserSlugOrId,
  UserModel,
} from 'shared-projects-frontend/models'

import {
  getProjectCategoriesFollow,
  getUser as _getUser,
  getUserNotificationSettings,
  patchUserNotificationSettings,
} from 'shared-projects-frontend/apis'
import { logoutFromKeycloak, refreshAccessToken } from '~/api/auth/auth.service'
import { checkExpiredToken } from '~/api/auth/keycloakUtils'
import { removeApiCookie } from '~/api/auth/cookie.service'
import type { AuthResult } from '~/api/auth/keycloak'

import type { Right } from 'shared-projects-frontend/interfaces'
import { userRights } from 'shared-projects-frontend/lib'
import analytics from '~/analytics'
import { defineStore } from 'pinia'
import { pick } from 'es-toolkit'

// fix undefined localStorage on sever
let _localStorage = null
if (import.meta.client && typeof window !== 'undefined') _localStorage = window.localStorage
const localStorage = _localStorage

export interface UsersState {
  expiresIn?: number
  refreshToken?: string
  refreshTokenExp?: number
  accessToken?: string
  id?: number
  keycloak_id?: string
  userFromToken?: any
  userFromApi?: any
  permissions?: object
  id_token?: string
  roles?: string[]
  notificationsCount?: number
  notificationsSettings?: NotificationsSettings
  userDataRefreshLoop?: ReturnType<typeof setInterval> | null
  followedCategories?: any[]
}

const useUsersStore = defineStore('users', () => {
  // store is initialized before app is started, so we must check expiration here too
  if (import.meta.client) checkExpiredToken()

  const refreshToken = ref(localStorage?.getItem('REFRESH_TOKEN') ?? null)
  const userFromToken = ref(null)
  const userFromApi = ref(null)
  const accessToken = ref(localStorage?.getItem('ACCESS_TOKEN') ?? null)
  const keycloak_id = ref('')
  const id_token = ref(localStorage?.getItem('ID_TOKEN'))

  const rights = computed<Right>(() => {
    const safeUser = {
      permissions: userFromToken.value?.permissions || userFromApi.value?.permissions || [],
      roles: userFromToken.value?.roles || userFromApi.value?.roles || [],
    }
    return userRights(safeUser)
  })

  const notificationsCount = computed(() => {
    if (userFromApi.value) {
      return userFromApi.value.modules.notifications
    }
    return 0
  })

  const notificationsSettings = ref(null)
  const userDataRefreshLoop = ref(null)
  const followedCategories = ref<any[]>([])

  const isConnected = computed((): boolean => {
    return !!userFromToken.value
  })

  const id = computed((): number | undefined => {
    return userFromApi.value?.id
  })

  const user = computed((): UserModel | null => {
    if (userFromToken.value) {
      return {
        id: userFromToken.value.pid,
        given_name: userFromToken.value.given_name,
        family_name: userFromToken.value.family_name,
        email: userFromToken.value.email,
        roles: userFromToken.value.roles || [],
        permissions: userFromToken.value.permissions || {},
        slug: userFromToken.value.slug,
        researcher: userFromToken.value.researcher,
        signed_terms_and_conditions: userFromApi.value?.signed_terms_and_conditions || {},
        ...pick(userFromApi.value || {}, [
          'is_superuser',
          'linkedin',
          'facebook',
          'twitter',
          'website',
          'modules',
          'created_at',
          'location',
          'landline_phone',
          'mobile_phone',
          'skype',
        ]),
      }
    }
    return null
  })

  function stopUserDataRefreshLoop() {
    if (userDataRefreshLoop.value) {
      clearInterval(userDataRefreshLoop.value)
      userDataRefreshLoop.value = null
    }
  }

  function resetUser() {
    localStorage?.removeItem('REFRESH_TOKEN')
    localStorage?.removeItem('REFRESH_TOKEN_EXP')
    localStorage?.removeItem('ACCESS_TOKEN')
    localStorage?.removeItem('USER_ID') // TODO: keepin a while to allow past user clean up
    localStorage?.removeItem('KEYCLOAK_ID') // TODO: keepin a while to allow past user clean up
    localStorage?.removeItem('ID_TOKEN')
    refreshToken.value = ''
    accessToken.value = ''
    keycloak_id.value = ''
    userFromToken.value = null
    id_token.value = ''
    userFromApi.value = null
    notificationsSettings.value = null
    // API proxy cookie
    document.cookie = 'jwt_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
  }

  function logOut() {
    stopUserDataRefreshLoop()
    return removeApiCookie()
      .catch(console.error)
      .then(() => {
        logoutFromKeycloak()
        resetUser()
      })
  }

  // ex mutations
  function setUser(payload: UsersState) {
    localStorage?.setItem('EXPIRES_IN', payload.expiresIn)
    localStorage?.setItem('REFRESH_TOKEN', payload.refreshToken)
    localStorage?.setItem('REFRESH_TOKEN_EXP', '' + payload.refreshTokenExp)
    localStorage?.setItem('ACCESS_TOKEN', payload.accessToken)
    localStorage?.setItem('ID_TOKEN', payload.id_token)
    refreshToken.value = payload.refreshToken
    accessToken.value = payload.accessToken
    keycloak_id.value = payload.keycloak_id
    userFromToken.value = payload.userFromToken
    id_token.value = payload.id_token
    // API proxy cookie
    document.cookie = `jwt_access_token=${payload.accessToken}; path=/;`
  }

  async function logIn({
    access_token,
    refresh_token,
    expires_in,
    refresh_token_exp,
    parsedToken,
    id_token,
  }: AuthResult): Promise<string> {
    const keycloakID = parsedToken.sub
    setUser({
      expiresIn: expires_in,
      refreshToken: refresh_token,
      refreshTokenExp: refresh_token_exp,
      accessToken: access_token,
      keycloak_id: keycloakID,
      userFromToken: parsedToken,
      id_token: id_token,
    })
    analytics.identifyUser(keycloakID)

    return access_token
  }

  // was refreshTock
  async function doRefreshToken(): Promise<string> {
    try {
      const { refresh_token, access_token, parsedToken, expires_in, refresh_token_exp, id_token } =
        await refreshAccessToken()

      if (refresh_token && access_token && parsedToken) {
        const keycloakID = parsedToken.sub
        setUser({
          expiresIn: expires_in,
          refreshToken: refresh_token,
          refreshTokenExp: refresh_token_exp,
          accessToken: access_token,
          id_token,
          keycloak_id: keycloakID,
          userFromToken: parsedToken,
        })
      } else {
        resetUser()
      }
      return access_token
    } catch (err) {
      console.error('Error refreshing the user token :', err)
      logOut()
    }
  }

  function startUserDataRefreshLoop() {
    if (id.value) {
      stopUserDataRefreshLoop()
      userDataRefreshLoop.value = setInterval(
        () => {
          console.log('Refreshing user data...')
          getUser(id.value)
        },
        1000 * 60 * 5 // 5 minutes
      )
    }
  }

  watchEffect(async () => {
    if (id.value) await fetchFollowedCategories()
  })

  async function getUser(id) {
    // id is keycloak_id OR django user id OR slug
    try {
      // TODO: except for permissions, useless props that are on userFromApi anyway (to check)
      const user = await _getUser(id)
      userFromApi.value = user

      startUserDataRefreshLoop()

      return user
    } catch (err) {
      console.error(err)
    }
  }

  watch(
    () => keycloak_id.value,
    (neo, old) => {
      if (neo && neo !== old) {
        getUser(keycloak_id.value)
      }
    }
  )

  async function getNotifications(id) {
    // TODO: should be getNotificationsSetting
    const result = await getUserNotificationSettings(id)
    notificationsSettings.value = result
    return result
  }

  async function patchNotifications(userId: UserSlugOrId, body: NotificationSettingsForm) {
    // TODO: should be patchNotificationsSetting
    const result = await patchUserNotificationSettings(userId, body)

    notificationsSettings.value = result

    return result
  }

  async function fetchFollowedCategories() {
    if (!id.value) return
    try {
      // TODO check if paginated result workaround is needed
      const resp = await getProjectCategoriesFollow(id.value)
      followedCategories.value = resp.results
    } catch (err) {
      console.error('Error fetching followed categories:', err)
    }
  }

  /**
   * refresh connected user (form permissions refresh)
   *
   * @function
   * @name refreshUser
   * @kind variable
   * @memberof useUsersStore.defineStore('users') callback
   * @returns {Promise<UserModel>}
   */
  const refreshUser = () => getUser(id.value)

  return {
    // state
    refreshToken,
    userFromToken,
    userFromApi,
    accessToken,
    keycloak_id,
    rights,
    id_token,
    notificationsCount,
    notificationsSettings,
    userDataRefreshLoop,
    followedCategories,
    // getters
    isConnected,
    id,
    user,
    // actions
    stopUserDataRefreshLoop,
    resetUser,
    logOut,
    setUser,
    logIn,
    doRefreshToken,
    startUserDataRefreshLoop,
    getUser,
    refreshUser,
    getNotifications,
    patchNotifications,
    fetchFollowedCategories,
  }
})

export default useUsersStore
