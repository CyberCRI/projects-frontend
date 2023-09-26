import { AuthResult } from '@/api/auth/keycloak'

import {
    getUser,
    logoutFromKeycloak,
    refreshAccessToken,
    getNotifications,
    patchNotifications,
} from '@/api/auth/auth.service'
import analytics from '@/analytics'
import funct from '@/functs/functions'
import { NotificationsSettings, UserModel } from '@/models/user.model'
import { checkExpiredToken } from '@/api/auth/keycloakUtils'
import { removeApiCookie } from '@/api/auth/cookie.service'
import store from '@/store'

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

const state = (): UsersState => {
    // store is initialized before app is started, so we must check expiration here too
    checkExpiredToken()
    return {
        refreshToken: localStorage.getItem('REFRESH_TOKEN'),
        userFromToken: null,
        userFromApi: null,
        accessToken: localStorage.getItem('ACCESS_TOKEN'),
        id: localStorage.getItem('USER_ID'),
        keycloak_id: localStorage.getItem('KEYCLOAK_ID'),
        loginLocked: false,
        permissions: {},
        id_token: localStorage.getItem('ID_TOKEN'),
        roles: [],
        notifications: 0,
        notificationsSettings: null,
    }
}

const getters = {
    isLoggedIn: (state: UsersState) => {
        return !!state.accessToken
    },

    kid(state: UsersState) {
        return state.keycloak_id
    },

    user: (state: UsersState): UserModel | null => {
        if (state.userFromToken) {
            return {
                id: state.userFromToken.pid,
                name: {
                    firstname: state.userFromToken.given_name,
                    lastname: state.userFromToken.family_name,
                },
                email: state.userFromToken.email,
                roles: state.userFromToken.roles || [],
                orgs: funct.getOrgsFromRoles(state.userFromToken.roles),
                permissions: state.permissions,
            }
        }

        return null
    },

    userFromApi: (state: UsersState) => {
        return state.userFromApi
    },

    accessToken: (state: UsersState) => {
        return state.accessToken
    },

    refreshToken: (state: UsersState) => {
        return state.refreshToken
    },

    isLoginLocked: (state: UsersState) => {
        return state.loginLocked
    },

    getPermissions: (state: UsersState) => {
        return state.permissions
    },

    getUserRoles: (state: UsersState) => {
        return state.roles
    },

    isConnected: (state: UsersState) => {
        return !!state.userFromToken
    },

    getNotificationCount: (state: UsersState) => {
        return state.notifications
    },

    getNotificationsSettings: (state: UsersState) => {
        return state.notificationsSettings
    },
}

const actions = {
    logOut({ commit, dispatch }): Promise<any> {
        return new Promise(function (resolve) {
            commit('UPDATE_LOGIN_LOCK', true)
            dispatch('app/updateLoading', { visible: true }, { root: true })
            removeApiCookie()
                .catch(console.error)
                .finally(function () {
                    logoutFromKeycloak()
                    commit('RESET_USER')
                    resolve(true)
                })
        })
    },

    async logIn(
        { commit, dispatch },
        { access_token, refresh_token, refresh_token_exp, parsedToken, id_token }: AuthResult
    ): Promise<string> {
        const keycloakID = parsedToken.sub
        const peopleID = parsedToken.pid
        commit('SET_USER', {
            refreshToken: refresh_token,
            refreshTokenExp: refresh_token_exp,
            accessToken: access_token,
            id: peopleID,
            keycloak_id: keycloakID,
            loginLocked: false,
            userFromToken: parsedToken,
            id_token: id_token,
        })
        analytics.identifyUser(peopleID)

        return access_token
    },

    refreshToken({ commit, dispatch }): Promise<string> {
        return refreshAccessToken()
            .then(({ refresh_token, access_token, parsedToken, refresh_token_exp, id_token }) => {
                if (refresh_token && access_token && parsedToken) {
                    const keycloakID = parsedToken.sub
                    const peopleID = parsedToken.pid
                    commit('SET_USER', {
                        refreshToken: refresh_token,
                        refreshTokenExp: refresh_token_exp,
                        accessToken: access_token,
                        id: peopleID,
                        id_token,
                        keycloak_id: keycloakID,
                        loginLocked: false,
                        userFromToken: parsedToken,
                    })
                } else {
                    commit('RESET_USER')
                }
                return access_token
            })
            .catch((err) => {
                console.error('Error refreshing the user token :', err)
                dispatch('logOut')
            })
    },

    async getUser({ commit }, kid) {
        try {
            const user = await getUser(kid)

            commit('SET_USER_PERMISSIONS', user.permissions)
            commit('SET_USER_ROLES', user.roles)
            commit('SET_NOTIFICATIONS_COUNT', user.notifications)
            commit('SET_USER_FROM_API', user)

            await store.dispatch('languages/updateCurrentLanguage', user.language)

            return user
        } catch (err) {
            console.error(err)
        }
    },

    lockLogin({ commit }, lock: boolean) {
        commit('UPDATE_LOGIN_LOCK', lock)
    },

    async getNotifications({ commit }, kid) {
        try {
            const result = await getNotifications(kid)

            commit('SET_NOTIFICATIONS_SETTINGS', result)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },

    async patchNotifications({ commit }, { kid, payload }) {
        try {
            const result = await patchNotifications({ kid, payload })

            commit('SET_NOTIFICATIONS_SETTINGS', result)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    RESET_USER(state: UsersState) {
        localStorage.removeItem('REFRESH_TOKEN')
        localStorage.removeItem('REFRESH_TOKEN_EXP')
        localStorage.removeItem('ACCESS_TOKEN')
        localStorage.removeItem('USER_ID')
        localStorage.removeItem('KEYCLOAK_ID')
        localStorage.removeItem('ID_TOKEN')
        state.refreshToken = ''
        state.accessToken = ''
        state.id = ''
        state.keycloak_id = ''
        state.userFromToken = null
        state.id_token = ''
        state.userFromApi = null
        state.loginLocked = false
        state.permissions = {}
        state.roles = []
        state.notifications = 0
        state.notificationsSettings = null
        // API proxy cookie
        document.cookie = 'jwt_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    },
    SET_USER(state: UsersState, payload: UsersState) {
        localStorage.setItem('REFRESH_TOKEN', payload.refreshToken)
        localStorage.setItem('REFRESH_TOKEN_EXP', '' + payload.refreshTokenExp)
        localStorage.setItem('ACCESS_TOKEN', payload.accessToken)
        localStorage.setItem('USER_ID', payload.id)
        localStorage.setItem('KEYCLOAK_ID', payload.keycloak_id)
        localStorage.setItem('ID_TOKEN', payload.id_token)
        state.refreshToken = payload.refreshToken
        state.accessToken = payload.accessToken
        state.id = payload.id
        state.keycloak_id = payload.keycloak_id
        state.loginLocked = payload.loginLocked || false
        state.userFromToken = payload.userFromToken
        state.id_token = payload.id_token
        // API proxy cookie
        document.cookie = `jwt_access_token=${payload.accessToken}; path=/;`
    },

    SET_USER_PERMISSIONS(state: UsersState, payload: string[]) {
        const permissions = {}

        for (const key of payload) {
            permissions[key] = true
        }

        state.permissions = permissions
    },

    SET_USER_ROLES(state: UsersState, roles: string[]) {
        state.roles = roles
    },

    SET_NOTIFICATIONS_COUNT(state: UsersState, notifications: number) {
        state.notifications = notifications
    },

    SET_USER_FROM_API(state: UsersState, user: object) {
        state.userFromApi = user
    },

    UPDATE_LOGIN_LOCK(state: UsersState, lock: boolean): void {
        state.loginLocked = lock
    },

    SET_NOTIFICATIONS_SETTINGS(state: UsersState, notifications: NotificationsSettings) {
        state.notificationsSettings = notifications
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
