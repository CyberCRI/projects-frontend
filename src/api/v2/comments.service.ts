import { getProjectMessages as fetchgProjectMessages } from '@/api/project-messages.service'
import type { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import type { OrganizationModel } from '@/models/organization.model'
import type { QueryFilterComments } from '@/models/comment.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import { getComments } from '@/api/comments.service'
import type { RefOrRaw } from '@/interfaces/utils'
import { onlyRefs } from '@/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterComments>

// TODO change backend with prefix organization code in url not in query
export const getProjectComments = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const { translateComments } = useAutoTranslate()
  const key = computed(
    () => `organization::${unref(organization)}::project::${unref(projectSlugOrId)}::comments::all`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      // TODO add organizations
      getComments(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateComments,
      watch: onlyRefs([organization]),
      ...config,
    }
  )
}

// TODO change backend with prefix organization code in url not in query
export const getProjectMessages = (
  organization: RefOrRaw<OrganizationModel['code']>,
  projectSlugOrId: RefOrRaw<ProjectSlugOrId>,
  config: ConfigPagination = {}
) => {
  const { translateProjectMessages } = useAutoTranslate()
  const key = computed(
    () => `organization::${unref(organization)}::project::${unref(projectSlugOrId)}::messages::all`
  )

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      // TODO add organizations
      fetchgProjectMessages(unref(projectSlugOrId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: translateProjectMessages,
      watch: onlyRefs([organization]),
      ...config,
    }
  )
}
