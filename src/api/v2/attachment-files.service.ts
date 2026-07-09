import {
  getProjectAttachmentFiles as fetchProjectAttachmentFiles,
  getUserAttachmentFile as fetchUserAttachmenFiles,
} from 'shared-projects-frontend/apis'
import type {
  OrganizationModel,
  ProjectSlugOrId,
  UserIdOrSlug,
} from 'shared-projects-frontend/models'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

// TODO change backend with prefix organization code in url
export const getProjectAttachmentFiles = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::project::${unref(projectSlugOrId)}::attachment::files::all`
  )

  const { translateFiles } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchProjectAttachmentFiles(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateFiles(data),
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

export const getUserAttachmentFile = (
  organization: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserIdOrSlug>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::user::${unref(userId)}::attachment::files::all`
  )

  const { translateFiles } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchUserAttachmenFiles(unref(userId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateFiles(data),
      watch: onlyRefs([organization, userId]),
      ...config,
    }
  )
}
