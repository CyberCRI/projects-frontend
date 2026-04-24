import { getComments } from '@/api/comments.service'
import { UseAsyncPaginationApiConfig } from '@/api/v2/base.service'
import { onlyRefs } from '@/functs/onlyRefs'
import { RefOrRaw } from '@/interfaces/utils'
import { QueryFilterComments } from '@/models/comment.model'
import { OrganizationModel } from '@/models/organization.model'
import { ProjectSlugOrId } from '@/models/project.model'

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
