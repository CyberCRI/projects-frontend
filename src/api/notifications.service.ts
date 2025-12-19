import type { APIParams /*, APIResponseList*/ } from '@/api/types'
// import type { NotificationModel } from '@/models/notifications.model'
import useAPI from '@/composables/useAPI'
import { useRuntimeConfig } from '#imports'

export async function getNotifications(params: APIParams, orgCode: string | null = null) {
  const runtimeConfig = useRuntimeConfig()
  const currentOrgCode = runtimeConfig.public.appApiOrgCode

  return await useAPI(`organization/${orgCode || currentOrgCode}/notification/`, { params }) //.data.value
}
