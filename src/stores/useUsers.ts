import type { AuthResult } from '@/api/auth/keycloak'
import { getProjectCategoriesFollow } from '@/api/project-categories.service'

import {
  logoutFromKeycloak,
  refreshAccessToken,
  getNotifications as apiGetNotifications,
  patchNotifications as apiPatchNotifications,
} from '@/api/auth/auth.service'
import { getUser as _getUser } from '@/api/people.service'
import analytics from '@/analytics'
import funct from '@/functs/functions'
import { NotificationsSettings, UserModel } from '@/models/user.model'
import { checkExpiredToken } from '@/api/auth/keycloakUtils'
import { removeApiCookie } from '@/api/auth/cookie.service'

import { defineStore } from 'pinia'

// fix undefined localStorage on sever
let _localStorage = null
if (import.meta.client) _localStorage = window.localStorage
const localStorage = _localStorage

export interface UsersState {
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

  const refreshToken = ref(localStorage?.getItem('REFRESH_TOKEN'))
  const userFromToken = ref(null)
  const userFromApi = ref(null)
  const accessToken = ref(localStorage?.getItem('ACCESS_TOKEN'))
  const keycloak_id = ref('')
  const permissions = ref({})
  const id_token = ref(localStorage?.getItem('ID_TOKEN'))
  const roles = ref([])
  const notificationsCount = ref(0)
  const notificationsSettings = ref(null)
  const userDataRefreshLoop = ref(null)
  const followedCategories = ref<any[]>([])

  const isConnected = computed((): boolean => {
    return !!userFromToken.value
  })

  const id = computed((): number | undefined => {
    return userFromApi.value?.id
  })

  const user = computed(
    ():
      | (Omit<UserModel, 'permissions'> & {
          permissions: { [key: string]: boolean }
        })
      | null => {
      if (userFromToken.value) {
        return {
          id: userFromToken.value.pid,
          name: {
            firstname: userFromToken.value.given_name,
            lastname: userFromToken.value.family_name,
          },
          email: userFromToken.value.email,
          roles: userFromToken.value.roles || [],
          orgs: funct.getOrgsFromRoles(userFromToken.value.roles),
          permissions: permissions.value,
          slug: userFromToken.value.slug,
          researcher: userFromToken.value.researcher,
          signed_terms_and_conditions: userFromApi.value?.signed_terms_and_conditions || {},
        }
      }
      return null
    }
  )

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
    permissions.value = {}
    roles.value = []
    notificationsCount.value = 0
    notificationsSettings.value = null
    // API proxy cookie
    document.cookie = 'jwt_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
  }

  function logOut(): Promise<any> {
    return new Promise((resolve) => {
      stopUserDataRefreshLoop()
      removeApiCookie()
        .catch(console.error)
        .finally(() => {
          logoutFromKeycloak()
          resetUser()
          resolve(true)
        })
    })
  }

  // ex mutations
  function setUser(payload: UsersState) {
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
    refresh_token_exp,
    parsedToken,
    id_token,
  }: AuthResult): Promise<string> {
    const keycloakID = parsedToken.sub
    setUser({
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
      const { refresh_token, access_token, parsedToken, refresh_token_exp, id_token } =
        await refreshAccessToken()

      if (refresh_token && access_token && parsedToken) {
        const keycloakID = parsedToken.sub
        setUser({
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

      const _permissions = {}
      for (const key of user.permissions) {
        _permissions[key] = true
      }
      permissions.value = _permissions

      roles.value = user.roles
      notificationsCount.value = user.notifications
      userFromApi.value = user

      startUserDataRefreshLoop()

      return user
    } catch (err) {
      console.error(err)
    }
  }

  async function getNotifications(id) {
    // TODO: should be getNotificationsSetting
    try {
      const result = await apiGetNotifications(id)

      notificationsSettings.value = result

      return result
    } catch (err) {
      throw new Error(err)
    }
  }

  async function patchNotifications({ id, payload }) {
    // TODO: should be patchNotificationsSetting
    try {
      const result = await apiPatchNotifications({ id, payload })

      notificationsSettings.value = result

      return result
    } catch (err) {
      throw new Error(err)
    }
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

  return {
    // state
    refreshToken,
    userFromToken,
    userFromApi,
    accessToken,
    keycloak_id,
    permissions,
    id_token,
    roles,
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
    getNotifications,
    patchNotifications,
    fetchFollowedCategories,
  }
})

export default useUsersStore
