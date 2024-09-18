import { NotificationModel } from '@/models/notifications.model'
import { getNotifications } from '@/api/notifications.service'
import { APIResponseList } from '@/api/types'

export interface NotificationsState {
    notifications: NotificationModel[]
}

const state = (): NotificationsState => ({
    notifications: [],
})

const getters = {
    notifications(state: NotificationsState): NotificationModel[] {
        return state.notifications
    },
}

const actions = {
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
