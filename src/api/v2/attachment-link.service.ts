import {
  getProjectAttachmentLinks as fetchProjectAttachmentLinks,
  getUserAttachmentLink as fetchUserAttachmentLink,
} from 'shared-projects-frontend/apis'
import type {
  OrganizationModel,
  ProjectSlugOrId,
  UserSlugOrId,
} from 'shared-projects-frontend/models'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig

// TODO change backend with prefix organization code in url
export const getProjectAttachmentLinks = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::project::${unref(projectSlugOrId)}::attachment::links::all`
  )

  const { translateLinks } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchProjectAttachmentLinks(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateLinks(data),
      watch: onlyRefs([organization, projectSlugOrId]),
      ...config,
    }
  )
}

export const getUserAttachmentLinks = (
  organization: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(
    () => `${unref(organization)}::user::${unref(userId)}::attachment::links::all`
  )

  const { translateLinks } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchUserAttachmentLink(unref(userId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (data) => translateLinks(data),
      watch: onlyRefs([organization, userId]),
      ...config,
    }
  )
}
