import type { APIParams, APIResponseList } from '@/api/types'
import type { NotificationModel } from '@/models/notifications.model'
import useAPI from '@/composables/useAPI'

export async function getNotifications(params: APIParams) {
    return (await useAPI(`/notification/`, { params })).data
}
