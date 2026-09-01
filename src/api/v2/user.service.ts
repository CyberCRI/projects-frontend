import type {
  OrganizationModel,
  QueryFilterUser,
  UserSlugOrId,
} from 'shared-projects-frontend/models'

import type { RefOrRaw } from '~/interfaces/utils'

import {
  searchUserAdmin as fetchsearchUserAdmin,
  getUser as fetchUser,
  getUserGroups as fetchUserGroups,
  getUserProjectsMember as fetchUserProjectsMember,
  getUserProjectsFollower as fetchUserProjectsFollower,
  getUserProjectsReviewer as fetchUserProjectsReviewer,
  getUserCategoriesFollower as fetchUserCategoriesFollower,
} from 'shared-projects-frontend/apis'
import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'

import useUsersStore from '~/stores/useUsers'
import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig<QueryFilterUser>
type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterUser>

export const getUser = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: Config = {}
) => {
  const { translateUser } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user::${unref(userId)}`)

  const userStore = useUsersStore()

  const results = useAsyncAPI(
    key,
    ({ config }) => fetchUser(unref(userId), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateUser,
      watch: onlyRefs([organizationCode, userId]),
      ...config,
    }
  )

  /*
    if we fetch the local connected user, set store with the new datas
  */
  watchEffect(() => {
    // check user is loaded
    if (!results.data.value || results.status.value !== 'success') {
      return
    }

    // check local user is connected
    if (!userStore.isConnected || !userStore.user) {
      return
    }

    // check serializer is not defined
    const serializer = unref(config.query)?.serializer
    if (['light', 'superlight'].includes(serializer)) {
      return
    }

    // check is same user
    if (
      results.data.value.id === userStore.user.id ||
      results.data.value.slug === userStore.user.slug
    ) {
      userStore.forceSetUser(results.data.value)
    }
  })

  return results
}

export const getUserGroups = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const { translateGroups } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user::${unref(userId)}::group`)

  return useAsyncPaginationAPI(
    key,
    ({ config }) => fetchUserGroups(unref(userId), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateGroups,
      watch: onlyRefs([organizationCode, userId]),
      ...config,
    }
  )
}

export const getUserProjectsMember = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(() => `${unref(organizationCode)}::user::${unref(userId)}::projects::member`)
  return useAsyncPaginationAPI(
    key,
    ({ config }) => fetchUserProjectsMember(unref(userId), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateProjects,
      watch: onlyRefs([organizationCode, userId]),
      ...config,
    }
  )
}

export const getUserProjectsReviewer = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::user::${unref(userId)}::projects::reviewer`
  )
  return useAsyncPaginationAPI(
    key,
    ({ config }) => fetchUserProjectsReviewer(unref(userId), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateProjects,
      watch: onlyRefs([organizationCode, userId]),
      ...config,
    }
  )
}

export const getUserProjectsFollower = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const { translateProjects } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::user::${unref(userId)}::projects::follower`
  )
  return useAsyncPaginationAPI(
    key,
    ({ config }) => fetchUserProjectsFollower(unref(userId), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateProjects,
      watch: onlyRefs([organizationCode, userId]),
      ...config,
    }
  )
}

export const getUserCategoriesFollower = (
  organizationCode: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const { translateCategories } = useAutoTranslate()
  const key = computed(
    () => `${unref(organizationCode)}::user::${unref(userId)}::categories::follower`
  )
  return useAsyncPaginationAPI(
    key,
    ({ config }) => fetchUserCategoriesFollower(unref(userId), { ...DEFAULT_CONFIG, ...config }),
    {
      translate: translateCategories,
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
