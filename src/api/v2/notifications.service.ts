import type {
  OrganizationModel,
  QueryFilterNotification,
  UserSlugOrId,
} from 'shared-projects-frontend/models'

import type { RefOrRaw } from '~/interfaces/utils'

import {
  getNotifications as fetchNotifications,
  getUserNotificationSettings as fetchUserNotificationSettings,
} from 'shared-projects-frontend/apis'
import type { UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterNotification>

export const getNotifications = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::user::${userId}::notifications`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchNotifications(unref(organizationCode), unref(userId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationCode, userId]),
      ...config,
    }
  )
}

export const getUserNotificationSettings = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organizationCode)}::user::${userId}::notifications-settings`)

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchUserNotificationSettings(unref(organizationCode), unref(userId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationCode, userId]),
      ...config,
    }
  )
}
