import { AuthResult } from '@/api/auth/keycloak'

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
    loginLocked: boolean
    userFromToken: any
    userFromApi: any
    permissions: object
    id_token: string
    roles: string[]
    notifications: number
    notificationsSettings: NotificationsSettings
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
            loginLocked: false, // not used ?
            permissions: {},
            id_token: localStorage.getItem('ID_TOKEN'),
            roles: [],
            notifications: 0,
            notificationsSettings: null,
        }
    },

    getters: {
        isLoggedIn(): boolean {
            return !!this.accessToken
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

        // userFromApi: (state: UsersState) => {
        //     return state.userFromApi
        // },

        // accessToken: (state: UsersState) => {
        //     return state.accessToken
        // },

        // refreshToken: (state: UsersState) => {
        //     return state.refreshToken
        // },

        // TODO useless renaming of loginLocked
        // not used ?
        isLoginLocked(): boolean {
            return this.loginLocked
        },

        // TODO useless renaming of permissions
        getPermissions(): object {
            return this.permissions
        },
        // TODO useless renaming of roles
        getUserRoles(): string[] {
            return this.roles
        },

        // TODO duplicate use of isLoggedIn ?
        isConnected(): boolean {
            return !!this.userFromToken
        },

        // useless renaming of notifications (witch should be named notificationsCount...)
        getNotificationCount(): number {
            return this.notifications
        },
        // useless renaming of notificationsSettings
        getNotificationsSettings(): NotificationsSettings {
            return this.notificationsSettings
        },
    },

    actions: {
        logOut(): Promise<any> {
            return new Promise(function (resolve) {
                this.loginLocked = true
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
                loginLocked: false,
                userFromToken: parsedToken,
                id_token: id_token,
            })
            analytics.identifyUser(keycloakID)

            return access_token
        },

        // was refreshTock
        doRefreshToken(): Promise<string> {
            return refreshAccessToken()
                .then(
                    ({ refresh_token, access_token, parsedToken, refresh_token_exp, id_token }) => {
                        if (refresh_token && access_token && parsedToken) {
                            const keycloakID = parsedToken.sub
                            this.setUser({
                                refreshToken: refresh_token,
                                refreshTokenExp: refresh_token_exp,
                                accessToken: access_token,
                                id_token,
                                keycloak_id: keycloakID,
                                loginLocked: false,
                                userFromToken: parsedToken,
                            })
                        } else {
                            this.resetUser()
                        }
                        return access_token
                    }
                )
                .catch((err) => {
                    console.error('Error refreshing the user token :', err)
                    this.logOut()
                })
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
                this.notifications = user.notifications
                this.userFromApi = user

                languagesStore.current = user.language as LanguageType

                return user
            } catch (err) {
                console.error(err)
            }
        },

        // TODO useless action on state
        // not used ?
        lockLogin(lock: boolean) {
            this.loginLocked = lock
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

        // POI
        setUser(payload: UsersState) {
            localStorage.setItem('REFRESH_TOKEN', payload.refreshToken)
            localStorage.setItem('REFRESH_TOKEN_EXP', '' + payload.refreshTokenExp)
            localStorage.setItem('ACCESS_TOKEN', payload.accessToken)
            localStorage.setItem('ID_TOKEN', payload.id_token)
            this.refreshToken = payload.refreshToken
            this.accessToken = payload.accessToken
            this.keycloak_id = payload.keycloak_id
            this.loginLocked = payload.loginLocked || false
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
            this.loginLocked = false
            this.permissions = {}
            this.roles = []
            this.notifications = 0
            this.notificationsSettings = null
            // API proxy cookie
            document.cookie = 'jwt_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
        },
    },
})

export default useUsersStore

/*

// const state = (): UsersState => {
//     // store is initialized before app is started, so we must check expiration here too
//     checkExpiredToken()
//     return {
//         refreshToken: localStorage.getItem('REFRESH_TOKEN'),
//         userFromToken: null,
//         userFromApi: null,
//         accessToken: localStorage.getItem('ACCESS_TOKEN'),
//         keycloak_id: '',
//         loginLocked: false,
//         permissions: {},
//         id_token: localStorage.getItem('ID_TOKEN'),
//         roles: [],
//         notifications: 0,
//         notificationsSettings: null,
//     }
// }

// const getters = {
//     isLoggedIn: (state: UsersState) => {
//         return !!state.accessToken
//     },

//     id(state: UsersState) {
//         return state.userFromApi?.id
//     },

//     user: (state: UsersState): UserModel | null => {
//         if (state.userFromToken) {
//             return {
//                 id: state.userFromToken.pid,
//                 name: {
//                     firstname: state.userFromToken.given_name,
//                     lastname: state.userFromToken.family_name,
//                 },
//                 email: state.userFromToken.email,
//                 roles: state.userFromToken.roles || [],
//                 orgs: funct.getOrgsFromRoles(state.userFromToken.roles),
//                 permissions: state.permissions,
//             }
//         }

//         return null
//     },

//     userFromApi: (state: UsersState) => {
//         return state.userFromApi
//     },

//     accessToken: (state: UsersState) => {
//         return state.accessToken
//     },

//     refreshToken: (state: UsersState) => {
//         return state.refreshToken
//     },

//     isLoginLocked: (state: UsersState) => {
//         return state.loginLocked
//     },

//     getPermissions: (state: UsersState) => {
//         return state.permissions
//     },

//     getUserRoles: (state: UsersState) => {
//         return state.roles
//     },

//     isConnected: (state: UsersState) => {
//         return !!state.userFromToken
//     },

//     getNotificationCount: (state: UsersState) => {
//         return state.notifications
//     },

//     getNotificationsSettings: (state: UsersState) => {
//         return state.notificationsSettings
//     },
// }

// const actions = {
//     logOut({ commit }): Promise<any> {
//         return new Promise(function (resolve) {
//             commit('UPDATE_LOGIN_LOCK', true)
//             removeApiCookie()
//                 .catch(console.error)
//                 .finally(function () {
//                     logoutFromKeycloak()
//                     commit('RESET_USER')
//                     resolve(true)
//                 })
//         })
//     },

//     async logIn(
//         { commit },
//         { access_token, refresh_token, refresh_token_exp, parsedToken, id_token }: AuthResult
//     ): Promise<string> {
//         const keycloakID = parsedToken.sub
//         commit('SET_USER', {
//             refreshToken: refresh_token,
//             refreshTokenExp: refresh_token_exp,
//             accessToken: access_token,
//             keycloak_id: keycloakID,
//             loginLocked: false,
//             userFromToken: parsedToken,
//             id_token: id_token,
//         })
//         analytics.identifyUser(keycloakID)

//         return access_token
//     },

//     refreshToken({ commit, dispatch }): Promise<string> {
//         return refreshAccessToken()
//             .then(({ refresh_token, access_token, parsedToken, refresh_token_exp, id_token }) => {
//                 if (refresh_token && access_token && parsedToken) {
//                     const keycloakID = parsedToken.sub
//                     commit('SET_USER', {
//                         refreshToken: refresh_token,
//                         refreshTokenExp: refresh_token_exp,
//                         accessToken: access_token,
//                         id_token,
//                         keycloak_id: keycloakID,
//                         loginLocked: false,
//                         userFromToken: parsedToken,
//                     })
//                 } else {
//                     commit('RESET_USER')
//                 }
//                 return access_token
//             })
//             .catch((err) => {
//                 console.error('Error refreshing the user token :', err)
//                 dispatch('logOut')
//             })
//     },

//     async getUser({ commit }, id) {
//         const languagesStore = useLanguagesStore()
//         // id is keycloak_id OR django user id OR slug
//         try {
//             const user = await getUser(id)

//             commit('SET_USER_PERMISSIONS', user.permissions)
//             commit('SET_USER_ROLES', user.roles)
//             commit('SET_NOTIFICATIONS_COUNT', user.notifications)
//             commit('SET_USER_FROM_API', user)

//             languagesStore.current = user.language as LanguageType

//             return user
//         } catch (err) {
//             console.error(err)
//         }
//     },

//     lockLogin({ commit }, lock: boolean) {
//         commit('UPDATE_LOGIN_LOCK', lock)
//     },

//     async getNotifications({ commit }, id) {
//         // TODO: should be getNotificationsSetting
//         try {
//             const result = await getNotifications(id)

//             commit('SET_NOTIFICATIONS_SETTINGS', result)

//             return result
//         } catch (err) {
//             throw new Error(err)
//         }
//     },

//     async patchNotifications({ commit }, { id, payload }) {
//         // TODO: should be patchNotificationsSetting
//         try {
//             const result = await patchNotifications({ id, payload })

//             commit('SET_NOTIFICATIONS_SETTINGS', result)

//             return result
//         } catch (err) {
//             throw new Error(err)
//         }
//     },
// }

// const mutations = {
// // changed to action
//     // RESET_USER(state: UsersState) {
//     //     localStorage.removeItem('REFRESH_TOKEN')
//     //     localStorage.removeItem('REFRESH_TOKEN_EXP')
//     //     localStorage.removeItem('ACCESS_TOKEN')
//     //     localStorage.removeItem('USER_ID') // TODO: keepin a while to allow past user clean up
//     //     localStorage.removeItem('KEYCLOAK_ID') // TODO: keepin a while to allow past user clean up
//     //     localStorage.removeItem('ID_TOKEN')
//     //     state.refreshToken = ''
//     //     state.accessToken = ''
//     //     state.keycloak_id = ''
//     //     state.userFromToken = null
//     //     state.id_token = ''
//     //     state.userFromApi = null
//     //     state.loginLocked = false
//     //     state.permissions = {}
//     //     state.roles = []
//     //     state.notifications = 0
//     //     state.notificationsSettings = null
//     //     // API proxy cookie
//     //     document.cookie = 'jwt_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
//     // },

//     // changed to an action
//     // SET_USER(state: UsersState, payload: UsersState) {
//     //     localStorage.setItem('REFRESH_TOKEN', payload.refreshToken)
//     //     localStorage.setItem('REFRESH_TOKEN_EXP', '' + payload.refreshTokenExp)
//     //     localStorage.setItem('ACCESS_TOKEN', payload.accessToken)
//     //     localStorage.setItem('ID_TOKEN', payload.id_token)
//     //     state.refreshToken = payload.refreshToken
//     //     state.accessToken = payload.accessToken
//     //     state.keycloak_id = payload.keycloak_id
//     //     state.loginLocked = payload.loginLocked || false
//     //     state.userFromToken = payload.userFromToken
//     //     state.id_token = payload.id_token
//     //     // API proxy cookie
//     //     document.cookie = `jwt_access_token=${payload.accessToken}; path=/;`
//     // },

//     // SET_USER_PERMISSIONS(state: UsersState, payload: string[]) {
//     //     const permissions = {}

//     //     for (const key of payload) {
//     //         permissions[key] = true
//     //     }

//     //     state.permissions = permissions
//     // },

//     // SET_USER_ROLES(state: UsersState, roles: string[]) {
//     //     state.roles = roles
//     // },

//     // SET_NOTIFICATIONS_COUNT(state: UsersState, notifications: number) {
//     //     state.notifications = notifications
//     // },

//     // SET_USER_FROM_API(state: UsersState, user: object) {
//     //     state.userFromApi = user
//     // },

//     // UPDATE_LOGIN_LOCK(state: UsersState, lock: boolean): void {
//     //     state.loginLocked = lock
//     // },

//     // SET_NOTIFICATIONS_SETTINGS(state: UsersState, notifications: NotificationsSettings) {
//     //     state.notificationsSettings = notifications
//     // },
// }

// export default {
//     namespaced: true,
//     state,
//     getters,
//     actions,
//     mutations,
// }
*/
