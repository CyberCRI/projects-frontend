import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { NotificationModel } from '@/models/notifications.model'

export async function getNotifications(): Promise<APIResponseList<NotificationModel>> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/notification/`)).data
}
