import type { AuthResult } from '@/api/auth/keycloak'

import {
    logoutFromKeycloak,
    refreshAccessToken,
    getNotifications,
    patchNotifications,
} from '@/api/auth/auth.service'
import { getUser } from '@/api/people.service'
import analytics from '@/analytics'
import funct from '@/functs/functions'
import { NotificationsSettings, UserModel } from '@/models/user.model'
import { checkExpiredToken } from '@/api/auth/keycloakUtils'
import { removeApiCookie } from '@/api/auth/cookie.service'

import useLanguagesStore from '@/stores/useLanguages'
import { LanguageType } from '@/models/types'
import { defineStore } from 'pinia'

export interface UsersState {
    refreshToken?: string
    refreshTokenExp?: number
    accessToken?: string
    id?: string
    keycloak_id?: string
    userFromToken?: any
    userFromApi?: any
    permissions?: object
    id_token?: string
    roles?: string[]
    notificationsCount?: number
    notificationsSettings?: NotificationsSettings
    userDataRefreshLoop?: ReturnType<typeof setInterval> | null
}

const useUsersStore = defineStore('users', {
    state: (): UsersState => {
        // store is initialized before app is started, so we must check expiration here too
        checkExpiredToken()
        return {
            refreshToken: localStorage.getItem('REFRESH_TOKEN'),
            userFromToken: null,
            userFromApi: null,
            accessToken: localStorage.getItem('ACCESS_TOKEN'),
            keycloak_id: '',
            permissions: {},
            id_token: localStorage.getItem('ID_TOKEN'),
            roles: [],
            notificationsCount: 0,
            notificationsSettings: null,
            userDataRefreshLoop: null,
        }
    },

    getters: {
        isConnected(): boolean {
            return !!this.userFromToken
        },

        id(): string | undefined {
            return this.userFromApi?.id
        },

        user(): UserModel | null {
            if (this.userFromToken) {
                return {
                    id: this.userFromToken.pid,
                    name: {
                        firstname: this.userFromToken.given_name,
                        lastname: this.userFromToken.family_name,
                    },
                    email: this.userFromToken.email,
                    roles: this.userFromToken.roles || [],
                    orgs: funct.getOrgsFromRoles(this.userFromToken.roles),
                    permissions: this.permissions,
                }
            }

            return null
        },
    },

    actions: {
        logOut(): Promise<any> {
            return new Promise((resolve) => {
                this.stopUserDataRefreshLoop()
                removeApiCookie()
                    .catch(console.error)
                    .finally(() => {
                        logoutFromKeycloak()
                        this.resetUser()
                        resolve(true)
                    })
            })
        },

        async logIn({
            access_token,
            refresh_token,
            refresh_token_exp,
            parsedToken,
            id_token,
        }: AuthResult): Promise<string> {
            const keycloakID = parsedToken.sub
            this.setUser({
                refreshToken: refresh_token,
                refreshTokenExp: refresh_token_exp,
                accessToken: access_token,
                keycloak_id: keycloakID,
                userFromToken: parsedToken,
                id_token: id_token,
            })
            analytics.identifyUser(keycloakID)

            return access_token
        },

        // was refreshTock
        async doRefreshToken(): Promise<string> {
            try {
                const { refresh_token, access_token, parsedToken, refresh_token_exp, id_token } =
                    await refreshAccessToken()

                if (refresh_token && access_token && parsedToken) {
                    const keycloakID = parsedToken.sub
                    this.setUser({
                        refreshToken: refresh_token,
                        refreshTokenExp: refresh_token_exp,
                        accessToken: access_token,
                        id_token,
                        keycloak_id: keycloakID,
                        userFromToken: parsedToken,
                    })
                } else {
                    this.resetUser()
                }
                return access_token
            } catch (err) {
                console.error('Error refreshing the user token :', err)
                this.logOut()
            }
        },

        startUserDataRefreshLoop() {
            if (this.id && !this.userDataRefreshLoop) {
                this.userDataRefreshLoop = setInterval(
                    () => {
                        this.getUser(this.id)
                    },
                    1000 * 60 * 5 // 5 minutes
                )
            }
        },

        stopUserDataRefreshLoop() {
            if (this.userDataRefreshLoop) {
                clearInterval(this.userDataRefreshLoop)
                this.userDataRefreshLoop = null
            }
        },

        async getUser(id) {
            const languagesStore = useLanguagesStore()
            // id is keycloak_id OR django user id OR slug
            try {
                // TODO: except for permissions, useless props that are on userFromApi anyway (to check)
                const user = await getUser(id)

                const permissions = {}
                for (const key of user.permissions) {
                    permissions[key] = true
                }
                this.permissions = permissions

                this.roles = user.roles
                this.notificationsCount = user.notifications
                this.userFromApi = user

                languagesStore.current = user.language as LanguageType

                this.startUserDataRefreshLoop()

                return user
            } catch (err) {
                console.error(err)
            }
        },

        async getNotifications(id) {
            // TODO: should be getNotificationsSetting
            try {
                const result = await getNotifications(id)

                this.notificationsSettings = result

                return result
            } catch (err) {
                throw new Error(err)
            }
        },

        async patchNotifications({ id, payload }) {
            // TODO: should be patchNotificationsSetting
            try {
                const result = await patchNotifications({ id, payload })

                this.notificationsSettings = result

                return result
            } catch (err) {
                throw new Error(err)
            }
        },

        // ex mutations
        setUser(payload: UsersState) {
            localStorage.setItem('REFRESH_TOKEN', payload.refreshToken)
            localStorage.setItem('REFRESH_TOKEN_EXP', '' + payload.refreshTokenExp)
            localStorage.setItem('ACCESS_TOKEN', payload.accessToken)
            localStorage.setItem('ID_TOKEN', payload.id_token)
            this.refreshToken = payload.refreshToken
            this.accessToken = payload.accessToken
            this.keycloak_id = payload.keycloak_id
            this.userFromToken = payload.userFromToken
            this.id_token = payload.id_token
            // API proxy cookie
            document.cookie = `jwt_access_token=${payload.accessToken}; path=/;`
        },

        resetUser() {
            localStorage.removeItem('REFRESH_TOKEN')
            localStorage.removeItem('REFRESH_TOKEN_EXP')
            localStorage.removeItem('ACCESS_TOKEN')
            localStorage.removeItem('USER_ID') // TODO: keepin a while to allow past user clean up
            localStorage.removeItem('KEYCLOAK_ID') // TODO: keepin a while to allow past user clean up
            localStorage.removeItem('ID_TOKEN')
            this.refreshToken = ''
            this.accessToken = ''
            this.keycloak_id = ''
            this.userFromToken = null
            this.id_token = ''
            this.userFromApi = null
            this.permissions = {}
            this.roles = []
            this.notificationsCount = 0
            this.notificationsSettings = null
            // API proxy cookie
            document.cookie = 'jwt_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
        },
    },
})

export default useUsersStore
