import type { APIParams } from '~/api/types'

import useAPI from '~/composables/useAPI'

import type { NotificationModel } from '~/models/notifications.model'
import type { PaginationResult } from '#imports'
import { useRuntimeConfig } from '#imports'

export async function getNotifications(params: APIParams, orgCode: string | null = null) {
  const runtimeConfig = useRuntimeConfig()
  const currentOrgCode = runtimeConfig.public.appApiOrgCode

  return await useAPI<PaginationResult<NotificationModel>>(
    `organization/${orgCode || currentOrgCode}/notification/`,
    { params }
  )
}
