import { NotificationModel } from '@/models/notifications.model'
import { getNotifications } from '@/api/notifications.service'
import { APIResponseList } from '@/api/types'

interface Toast {
    message: string
    isOpened: boolean
    type: string
}

export interface NotificationsState {
    toastList: Toast[]
    notifications: NotificationModel[]
}

const state = (): NotificationsState => ({
    toastList: [],
    notifications: [],
})

const getters = {
    getToastList(state: NotificationsState): Toast[] {
        return state.toastList
    },

    notifications(state: NotificationsState): NotificationModel[] {
        return state.notifications
    },
}

const actions = {
    pushToast({ commit }, payload): void {
        commit('ADD_TOAST', { ...payload, isOpened: true })
        if (!payload.remaining) {
            setTimeout(() => commit('REMOVE_TOAST', 0), payload.duration || 3000)
        }
    },
    deleteToast({ commit }, toastIndex: number): void {
        commit('REMOVE_TOAST', toastIndex)
    },

    async getNotifications({ commit }): Promise<APIResponseList<NotificationModel>> {
        try {
            const result = await getNotifications()

            commit('SET_NOTIFICATIONS', result.results)

            return result
        } catch (err) {
            throw new Error(err)
        }
    },
}

const mutations = {
    ADD_TOAST(state: NotificationsState, { message, type, isOpened }): void {
        state.toastList.push({ message, type, isOpened })
    },
    REMOVE_TOAST(state: NotificationsState, toastIndex: number): void {
        state.toastList = state.toastList.filter((_, index) => toastIndex !== index)
    },
    SET_NOTIFICATIONS(state: NotificationsState, notifications: NotificationModel[]): void {
        state.notifications = notifications
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
