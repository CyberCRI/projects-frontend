import type {
  OrganizationModel,
  QueryFilterUser,
  UserSlugOrId,
} from 'shared-projects-frontend/models'

import type { RefOrRaw } from '~/interfaces/utils'

import {
  searchUserAdmin as fetchsearchUserAdmin,
  getUser as fetchUser,
} from 'shared-projects-frontend/apis'
import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig<QueryFilterUser>
type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterUser>

export const getUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: Config = {}
) => {
  const { translateUserFull } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user::${unref(userId)}`)

  return useAsyncAPI(
    key,
    ({ config }) => fetchUser(unref(userId), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateUserFull,
      watch: onlyRefs([organizationCode, userId]),
      ...config,
    }
  )
}

// TODO change backend with prefix organization code in url not in query
export const searchUserAdmin = (
  organizationId: RefOrRaw<OrganizationModel['id']>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `organizationId${unref(organizationId)}::admin::users`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchsearchUserAdmin(unref(organizationId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      watch: onlyRefs([organizationId]),
      ...config,
    }
  )
}
